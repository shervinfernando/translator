#!/bin/bash

# Quick start script for development

set -e

echo "🚀 Starting Translation App Development Environment"
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
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. You can edit it if needed."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Starting services with Docker Compose..."
echo "⏳ This may take a few minutes on first run (downloading models ~2-3GB)..."
echo ""

# Start services
docker-compose --profile dev up --build

# This will keep running until you press Ctrl+C
