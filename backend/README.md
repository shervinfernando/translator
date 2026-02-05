# Translation Backend

FastAPI backend service for multi-language translation using transformer models.

## Features

- RESTful API for translation
- Support for MarianMT and NLLB-200 models
- Automatic model loading and caching
- CORS support for web applications
- Health check endpoints
- Interactive API documentation (Swagger UI)

## Setup

### Local Development

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The server will start on http://localhost:8000

### Docker

Build and run:
```bash
docker build -t translation-backend .
docker run -p 8000:8000 -v $(pwd)/models:/app/models translation-backend
```

## API Endpoints

### POST /translate
Translate text between languages.

**Request:**
```json
{
  "text": "Hello, world!",
  "source_lang": "en",
  "target_lang": "ja"
}
```

**Response:**
```json
{
  "translated_text": "こんにちは、世界！",
  "model_used": "MarianMT (en-ja)",
  "source_lang": "en",
  "target_lang": "ja"
}
```

### GET /health
Returns service health status and loaded models.

### GET /languages
Returns list of supported languages.

## Supported Languages

- `en` - English
- `ja` - Japanese
- `zh` - Mandarin Chinese
- `hi` - Hindi
- `si` - Sinhala

## Models

### MarianMT Models
- `Helsinki-NLP/opus-mt-en-jap`
- `Helsinki-NLP/opus-mt-jap-en`
- `Helsinki-NLP/opus-mt-en-zh`
- `Helsinki-NLP/opus-mt-zh-en`
- `Helsinki-NLP/opus-mt-en-hi`
- `Helsinki-NLP/opus-mt-hi-en`

### NLLB Model
- `facebook/nllb-200-distilled-600M` (for Sinhala and fallback)

## Environment Variables

- `PORT` - Server port (default: 8000)
- `HOST` - Server host (default: 0.0.0.0)
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)
- `MODEL_CACHE_DIR` - Directory for model cache (default: ./models)

## API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Performance

### First Request
The first request to a language pair will be slower as the model loads. Typical loading times:
- MarianMT models: 10-30 seconds
- NLLB-200 model: 30-60 seconds

### Subsequent Requests
Cached models provide fast inference:
- CPU: 1-3 seconds per translation
- GPU: 0.2-0.5 seconds per translation

### Memory Usage
- Base service: ~500MB
- Per MarianMT model: ~300-500MB
- NLLB-200 model: ~1.2GB

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
isort .
```

### Type Checking
```bash
mypy .
```

## Troubleshooting

### Model Download Issues
If models fail to download:
1. Check internet connection
2. Verify disk space (need 3GB+)
3. Try manual download:
```python
from transformers import MarianMTModel, MarianTokenizer
model = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-en-ja")
```

### Memory Errors
If running out of memory:
1. Close other applications
2. Use smaller batch sizes
3. Consider using distilled models
4. Use GPU if available

### CUDA/GPU Issues
To use GPU:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

## License

MIT License
