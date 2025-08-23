#!/bin/bash

echo "🚀 Prodiny Deployment Helper"
echo "=============================="

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ 1. Backend deployed to Railway/Render"
echo "✅ 2. Environment variables set in backend"
echo "✅ 3. Database seeded with colleges"
echo "✅ 4. Frontend API URL updated"
echo ""

echo "🔧 Building frontend for production..."
cd client
npm run build

echo ""
echo "✅ Frontend built successfully!"
echo ""
echo "📤 Next steps:"
echo "1. Deploy the 'client' folder to Vercel"
echo "2. Set REACT_APP_API_URL environment variable in Vercel"
echo "3. Test the deployment"
echo ""
echo "🌐 Your backend should be deployed to:"
echo "   Railway: https://railway.app"
echo "   Render: https://render.com"
echo ""
echo "🎉 Happy deploying!"
