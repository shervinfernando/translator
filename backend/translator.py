"""
Translation service using MarianMT and NLLB models
"""
from transformers import MarianMTModel, MarianTokenizer, AutoModelForSeq2SeqLM, AutoTokenizer
import torch
from typing import Dict, Tuple, Optional
import os

class TranslationService:
    """Manages translation models and performs translations"""
    
    def __init__(self, cache_dir: Optional[str] = None):
        self.cache_dir = cache_dir or "./models"
        self.models: Dict[str, Tuple] = {}
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        # Model mappings for MarianMT
        self.marian_models = {}
        
        # NLLB model for Sinhala and fallback
        self.nllb_model_name = 'facebook/nllb-200-1.3B'
        
        # NLLB language codes mapping
        self.nllb_lang_codes = {
            'en': 'eng_Latn',
            'ja': 'jpn_Jpan',
            'zh': 'zho_Hans',
            'hi': 'hin_Deva',
            'si': 'sin_Sinh',
        }
        
    def _load_marian_model(self, model_name: str) -> Tuple:
        """Load a MarianMT model and tokenizer"""
        print(f"Loading MarianMT model: {model_name}")
        tokenizer = MarianTokenizer.from_pretrained(
            model_name, 
            cache_dir=self.cache_dir
        )
        model = MarianMTModel.from_pretrained(
            model_name,
            cache_dir=self.cache_dir
        ).to(self.device)
        return model, tokenizer
    
    def _load_nllb_model(self) -> Tuple:
        """Load NLLB model and tokenizer"""
        print(f"Loading NLLB model: {self.nllb_model_name}")
        tokenizer = AutoTokenizer.from_pretrained(
            self.nllb_model_name,
            cache_dir=self.cache_dir
        )
        model = AutoModelForSeq2SeqLM.from_pretrained(
            self.nllb_model_name,
            cache_dir=self.cache_dir
        ).to(self.device)
        return model, tokenizer
    
    def _get_model(self, lang_pair: str) -> Tuple[str, Tuple]:
        """Get the appropriate model for a language pair"""
        # Check if we have a MarianMT model for this pair
        if lang_pair in self.marian_models:
            if lang_pair not in self.models:
                model_name = self.marian_models[lang_pair]
                self.models[lang_pair] = self._load_marian_model(model_name)
            return 'marian', self.models[lang_pair]
        
        # Use NLLB for Sinhala or as fallback
        if 'nllb' not in self.models:
            self.models['nllb'] = self._load_nllb_model()
        return 'nllb', self.models['nllb']
    
    def translate(self, text: str, source_lang: str, target_lang: str) -> Dict[str, str]:
        """
        Translate text from source language to target language
        
        Args:
            text: Text to translate
            source_lang: Source language code (en, ja, zh, hi, si)
            target_lang: Target language code
            
        Returns:
            Dictionary with translated_text and model_used
        """
        if not text or not text.strip():
            return {
                "translated_text": "",
                "model_used": "none"
            }
        
        # Prevent translating to same language
        if source_lang == target_lang:
            return {
                "translated_text": text,
                "model_used": "pass-through"
            }
        
        lang_pair = f"{source_lang}-{target_lang}"
        
        try:
            model_type, (model, tokenizer) = self._get_model(lang_pair)
            
            if model_type == 'marian':
                # MarianMT translation
                inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                input_length = int(inputs["input_ids"].shape[1])
                max_new_tokens = min(256, max(32, input_length * 2))
                
                with torch.no_grad():
                    translated = model.generate(
                        **inputs,
                        max_new_tokens=max_new_tokens,
                        num_beams=5,
                        early_stopping=True,
                        no_repeat_ngram_size=3,
                        repetition_penalty=1.2,
                    )
                
                translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
                model_used = f"MarianMT ({lang_pair})"
                
            else:  # NLLB
                # Set source and target language codes
                tokenizer.src_lang = self.nllb_lang_codes[source_lang]
                
                inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                input_length = int(inputs["input_ids"].shape[1])
                max_new_tokens = min(256, max(32, input_length * 2))
                
                # Generate translation with target language
                forced_bos_token_id = tokenizer.convert_tokens_to_ids(self.nllb_lang_codes[target_lang])
                
                with torch.no_grad():
                    translated = model.generate(
                        **inputs,
                        forced_bos_token_id=forced_bos_token_id,
                        max_new_tokens=max_new_tokens,
                        num_beams=5,
                        early_stopping=True,
                        no_repeat_ngram_size=3,
                        repetition_penalty=1.2,
                    )
                
                translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
                model_used = f"NLLB-200 ({lang_pair})"
            
            return {
                "translated_text": translated_text,
                "model_used": model_used
            }
            
        except Exception as e:
            print(f"Translation error: {str(e)}")
            raise Exception(f"Translation failed: {str(e)}")
    
    def preload_models(self, lang_pairs: list = None):
        """Preload models to speed up first requests"""
        if lang_pairs is None:
            # Preload common pairs
            lang_pairs = ['en-ja', 'ja-en', 'en-zh', 'zh-en']
        
        for pair in lang_pairs:
            try:
                print(f"Preloading model for {pair}")
                self._get_model(pair)
            except Exception as e:
                print(f"Failed to preload {pair}: {str(e)}")
        
        # Always preload NLLB for Sinhala support
        try:
            print("Preloading NLLB model")
            self._get_model('en-si')  # This will load NLLB
        except Exception as e:
            print(f"Failed to preload NLLB: {str(e)}")
