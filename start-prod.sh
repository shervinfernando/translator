#!/bin/bash

# Production start script

set -e

echo "🚀 Starting Translation App in Production Mode"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your production settings before continuing."
    exit 1
fi

echo "✅ .env file found"
echo ""
echo "🐳 Building and starting production services..."
echo ""

# Build and start services in detached mode
docker-compose up -d --build

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
echo ""
