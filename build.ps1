# Build script for production deployment (Windows PowerShell)
Write-Host "🚀 Starting production build..." -ForegroundColor Green

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install client dependencies and build
Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install

Write-Host "🏗️ Building React client..." -ForegroundColor Yellow
npm run build

# Go back to root
Set-Location ..

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Client build files are in: client/build" -ForegroundColor Cyan
Write-Host "🌐 Ready for deployment!" -ForegroundColor Green
