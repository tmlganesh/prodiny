#!/bin/bash

# Build script for production deployment
echo "🚀 Starting production build..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🏗️ Building React client..."
npm run build

# Go back to root
cd ..

echo "✅ Build completed successfully!"
echo "📁 Client build files are in: client/build"
echo "🌐 Ready for deployment!"
