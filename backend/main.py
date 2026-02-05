"""
FastAPI backend for translation service
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from translator import TranslationService
import os
from typing import Optional

app = FastAPI(
    title="Multi-Language Translation API",
    description="Translation service supporting Japanese, English, Hindi, Sinhala, and Mandarin",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize translation service
cache_dir = os.getenv("MODEL_CACHE_DIR", "./models")
translation_service = TranslationService(cache_dir=cache_dir)

# Supported languages
SUPPORTED_LANGUAGES = ['en', 'ja', 'zh', 'hi', 'si']


class TranslationRequest(BaseModel):
    """Request model for translation"""
    text: str = Field(..., description="Text to translate", min_length=1, max_length=5000)
    source_lang: str = Field(..., description="Source language code (en, ja, zh, hi, si)")
    target_lang: str = Field(..., description="Target language code (en, ja, zh, hi, si)")


class TranslationResponse(BaseModel):
    """Response model for translation"""
    translated_text: str
    model_used: str
    source_lang: str
    target_lang: str


@app.on_event("startup")
async def startup_event():
    """Preload models on startup"""
    print("Starting translation service...")
    print("Preloading models (this may take a few minutes)...")
    # Preload common models in background
    # For production, you might want to do this asynchronously
    # translation_service.preload_models()
    print("Service ready!")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Multi-Language Translation API",
        "version": "1.0.0",
        "supported_languages": SUPPORTED_LANGUAGES,
        "endpoints": {
            "translate": "/translate",
            "health": "/health",
            "languages": "/languages"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "device": translation_service.device,
        "loaded_models": list(translation_service.models.keys())
    }


@app.get("/languages")
async def get_languages():
    """Get list of supported languages"""
    return {
        "languages": [
            {"code": "en", "name": "English", "flag": "🇬🇧"},
            {"code": "ja", "name": "Japanese", "flag": "🇯🇵"},
            {"code": "zh", "name": "Mandarin", "flag": "🇨🇳"},
            {"code": "hi", "name": "Hindi", "flag": "🇮🇳"},
            {"code": "si", "name": "Sinhala", "flag": "🇱🇰"}
        ]
    }


@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """
    Translate text from source language to target language
    """
    # Validate language codes
    if request.source_lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported source language: {request.source_lang}. Supported: {SUPPORTED_LANGUAGES}"
        )
    
    if request.target_lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported target language: {request.target_lang}. Supported: {SUPPORTED_LANGUAGES}"
        )
    
    # Validate text
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Perform translation
        result = translation_service.translate(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )
        
        return TranslationResponse(
            translated_text=result["translated_text"],
            model_used=result["model_used"],
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )
        
    except Exception as e:
        print(f"Translation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
