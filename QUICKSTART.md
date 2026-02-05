# Quick Start Guide

Get the Translation App running in 5 minutes!

## 🚀 Fastest Way (Docker Compose)

### Prerequisites
- Docker Desktop installed and running
- 5GB free disk space
- Internet connection (for downloading models)

### Steps

1. **Navigate to project directory:**
```bash
cd translation-app
```

2. **Start the application:**
```bash
./start.sh
```

Or on Windows:
```bash
docker-compose --profile dev up --build
```

3. **Access the application:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Note:** First startup takes 5-10 minutes to download translation models (~2-3GB).

## 🛠️ Development Setup (Without Docker)

### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the server:**
```bash
python main.py
```

Backend runs at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
echo "BACKEND_URL=http://localhost:8000" > .env.local
```

4. **Run development server:**
```bash
npm run dev
```

Frontend runs at http://localhost:3000

## ✅ Verify Installation

1. **Check backend health:**
```bash
curl http://localhost:8000/health
```

Expected output:
```json
{
  "status": "healthy",
  "device": "cpu",
  "loaded_models": []
}
```

2. **Check frontend:**
Open http://localhost:3000 in your browser

3. **Test translation:**
- Enter text: "Hello, world!"
- Select source: English
- Select target: Japanese
- Click "Translate"
- Should see: "こんにちは、世界！"

## 🎯 Common Commands

### Docker Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Start development mode (with hot reload)
docker-compose --profile dev up
```

### Development Commands
```bash
# Frontend
cd frontend
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter

# Backend
cd backend
pip install -r requirements.txt  # Install dependencies
python main.py                    # Start server
pytest                           # Run tests
```

## 🐛 Troubleshooting

### "Docker is not running"
- Start Docker Desktop
- Wait for it to fully initialize
- Try again

### "Port already in use"
- Stop services using ports 3000, 3001, or 8000
- Or change ports in `docker-compose.yml`

### "Models not loading"
- Ensure you have 5GB+ free space
- Check internet connection
- Wait for download to complete (can take 10+ minutes)
- Check logs: `docker-compose logs backend`

### "Frontend can't connect to backend"
- Verify backend is running: `curl http://localhost:8000/health`
- Check `BACKEND_URL` in `.env.local` or `.env`
- Check CORS settings in `backend/main.py`

### "Permission denied" on scripts
```bash
chmod +x start.sh start-prod.sh
```

### Memory issues
- Increase Docker memory limit to 4GB+
- Close other applications
- Use smaller models (see README.md)

## 📚 Next Steps

1. **Read the full README:**
   - `README.md` - Complete documentation
   - `backend/README.md` - Backend details
   - `frontend/README.md` - Frontend details

2. **Explore the API:**
   - Visit http://localhost:8000/docs
   - Try different endpoints
   - Test different language pairs

3. **Customize:**
   - Modify UI in `frontend/app/page.tsx`
   - Add languages in `backend/translator.py`
   - Adjust styling in `frontend/app/globals.css`

4. **Deploy:**
   - See `deployment/README.md`
   - Choose your cloud platform
   - Follow deployment guide

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- See `TESTING.md` for testing guide
- Read `CONTRIBUTING.md` for contribution guidelines
- Open an issue on GitHub

## 🎉 Success!

If you see the translation interface and can translate text, you're all set!

Enjoy translating! 🌐
