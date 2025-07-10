#!/bin/bash
set -e

echo "Building Employee Rewards System..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the app
echo "Building app..."
npm run build

# Verify dist directory exists
if [ -d "dist" ]; then
    echo "✅ Build successful! dist directory created."
    echo "📁 Contents of dist:"
    ls -la dist/
else
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "🚀 Ready for deployment!"