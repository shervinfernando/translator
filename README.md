# Multi-Language Translation Web App

A modern, AI-powered translation web application that supports translation between Japanese, English, Hindi, Sinhala, and Mandarin Chinese using state-of-the-art transformer models (MarianMT and NLLB-200).

## Features

- 🌐 **5 Languages**: English, Japanese, Mandarin, Hindi, and Sinhala
- 🤖 **AI-Powered**: Uses MarianMT and NLLB-200 transformer models
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode
- 🔄 **Bidirectional**: Translate in both directions between any language pair
- ⚡ **Fast**: Optimized model loading and caching
- 🐳 **Dockerized**: Easy deployment with Docker and Docker Compose
- 🌍 **Cloud Ready**: Deployment configurations for AWS, GCP, and Azure

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Browser   │─────▶│  Next.js     │─────▶│  Python FastAPI │
│   (React)   │◀─────│  Frontend    │◀─────│    Backend      │
└─────────────┘      └──────────────┘      └─────────────────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │  AI Models      │
                                            │  - MarianMT     │
                                            │  - NLLB-200     │
                                            └─────────────────┘
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management

### Backend
- **FastAPI** - Modern Python web framework
- **Transformers** - Hugging Face transformers library
- **PyTorch** - Deep learning framework
- **MarianMT** - Neural machine translation models
- **NLLB-200** - Meta's multilingual translation model

## Quick Start

### Prerequisites

- Node.js 20+ (for frontend)
- Python 3.11+ (for backend)
- Docker and Docker Compose (optional, for containerized deployment)

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd translation-app
```

2. Start the services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Note**: First startup will take several minutes as models are downloaded (~2-3GB).

### Option 2: Development Mode

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend:
```bash
python main.py
```

The backend will start on http://localhost:8000

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
echo "BACKEND_URL=http://localhost:8000" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

The frontend will start on http://localhost:3000

## Usage

1. Select source and target languages from the dropdowns
2. Enter text in the source text area
3. Click "Translate" to get the translation
4. Use the swap button (⇄) to reverse languages
5. Click "Copy" to copy the translation to clipboard
6. Click "Clear" to reset both text areas

## Supported Language Pairs

The application supports all combinations between:
- 🇬🇧 English (en)
- 🇯🇵 Japanese (ja)
- 🇨🇳 Mandarin Chinese (zh)
- 🇮🇳 Hindi (hi)
- 🇱🇰 Sinhala (si)

### Model Coverage

- **MarianMT models** (faster, specialized):
  - English ↔ Japanese
  - English ↔ Mandarin
  - English ↔ Hindi

- **NLLB-200 model** (broader coverage):
  - All pairs involving Sinhala
  - Fallback for any unsupported pairs

## Project Structure

```
translation-app/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Main translation interface
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Global styles
│   │   └── api/
│   │       └── translate/
│   │           └── route.ts # API route handler
│   ├── components/
│   │   ├── LanguageSelector.tsx
│   │   ├── TranslationBox.tsx
│   │   └── SwapButton.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── backend/                  # Python FastAPI backend
│   ├── main.py              # FastAPI app
│   ├── translator.py        # Translation service
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## API Documentation

### Endpoints

#### POST /translate
Translate text from source to target language.

**Request Body:**
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

#### GET /health
Health check endpoint.

#### GET /languages
Get list of supported languages.

Full API documentation available at: http://localhost:8000/docs

## Deployment

### Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up -d
```

For development with hot reload:
```bash
docker-compose --profile dev up
```

### Cloud Deployment

#### AWS

**Frontend (Amplify or S3 + CloudFront):**
```bash
cd frontend
npm run build
aws s3 sync out/ s3://your-bucket-name
```

**Backend (ECS Fargate):**
```bash
cd backend
docker build -t translation-backend .
# Push to ECR and deploy to ECS
```

#### Google Cloud Platform

**Frontend (Cloud Run):**
```bash
cd frontend
gcloud run deploy translation-frontend --source .
```

**Backend (Cloud Run with GPU):**
```bash
cd backend
gcloud run deploy translation-backend --source . --memory 4Gi
```

#### Azure

**Frontend (Static Web Apps):**
```bash
cd frontend
npm run build
az staticwebapp create --name translation-frontend
```

**Backend (Container Apps):**
```bash
cd backend
az containerapp create --name translation-backend --image <your-image>
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000
MODEL_CACHE_DIR=./backend/models

# Frontend
BACKEND_URL=http://localhost:8000
```

For production, update `BACKEND_URL` and `CORS_ORIGINS` with your actual domains.

## Performance Considerations

### Model Loading
- First request to each language pair takes longer (model loading)
- Subsequent requests are faster (cached models)
- Consider preloading common models on startup

### Resource Requirements
- **Memory**: 4-8GB RAM recommended
- **Storage**: 2-3GB for models
- **GPU**: Optional but recommended for faster inference

### Optimization Strategies
1. Use model quantization (int8, float16)
2. Enable model caching
3. Use GPU instances for production
4. Implement request batching
5. Add Redis for translation caching

## Troubleshooting

### Models not loading
- Ensure sufficient disk space (3GB+)
- Check internet connection for model downloads
- Verify Python dependencies are installed correctly

### CORS errors
- Update `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is allowed

### Memory issues
- Use smaller distilled models
- Enable model quantization
- Increase container memory limits

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- [Hugging Face](https://huggingface.co/) for the Transformers library
- [Helsinki-NLP](https://huggingface.co/Helsinki-NLP) for MarianMT models
- [Meta AI](https://ai.facebook.com/) for NLLB-200 model
- [Next.js](https://nextjs.org/) team for the amazing framework
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python framework

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js, FastAPI, and AI
