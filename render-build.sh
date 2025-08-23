#!/bin/bash

# Render Build Script - Handles all dependency conflicts
echo "🚀 Starting Render deployment build..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --production=false

echo "🔧 Setting up client environment..."
cd client

# Remove existing dependencies to start fresh
echo "🧹 Cleaning client dependencies..."
rm -rf node_modules package-lock.json

# Update package.json to use compatible versions
echo "📝 Updating package.json for compatibility..."
cat > package.json << 'EOF'
{
  "name": "prodiny-client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "axios": "^1.5.0",
    "lucide-react": "^0.279.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.15.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}
EOF

# Install with legacy peer deps to avoid conflicts
echo "📦 Installing client dependencies with compatibility flags..."
npm install --legacy-peer-deps --force

# Build the React app
echo "🏗️ Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build files are ready in client/build/"

cd ..
echo "🌐 Ready for production deployment!"
