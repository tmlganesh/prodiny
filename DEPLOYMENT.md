# Prodiny Deployment Guide - Vercel Full Stack

## 🚀 Deploy Both Frontend and Backend on Vercel

This project is now configured to deploy both frontend (React) and backend (Node.js) on Vercel using serverless functions.

### 📋 Pre-deployment Checklist

1. ✅ Ensure your MongoDB Atlas database is set up
2. ✅ Have your environment variables ready
3. ✅ Commit all changes to your GitHub repository

### 🌐 Deploy to Vercel

#### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

#### Step 2: Configure Environment Variables
In Vercel dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://ganesh:Prodiny123@cluster0.ucqxdv1.mongodb.net/prodiny?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters_long_change_this_for_production
JWT_EXPIRE=7d
NODE_ENV=production
```

#### Step 3: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

### 🗄️ Seed the Database

After deployment, visit:
```
https://your-app-name.vercel.app/api/seed?action=seed
```

This will populate your database with all 29 colleges.

### 🔧 API Endpoints

Your API will be available at:
- `https://your-app-name.vercel.app/api/auth/*`
- `https://your-app-name.vercel.app/api/colleges`
- `https://your-app-name.vercel.app/api/projects`
- `https://your-app-name.vercel.app/api/users`
- `https://your-app-name.vercel.app/api/subgroups`

### 🧪 Test the Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend Health**: Visit `https://your-app-name.vercel.app/api/health`
3. **Colleges API**: Visit `https://your-app-name.vercel.app/api/colleges`

### 🔄 Local Development

For local development:

```bash
# Start backend
npm run server

# Start frontend (in another terminal)
cd client
npm start
```

### 📝 Sample Accounts

After seeding, you can use:
- **Admin:** admin@prodiny.com / admin123
- **Student:** john@rvrjc.ac.in / password123
- **Faculty:** jane@rvrjc.ac.in / password123

### 🚨 Troubleshooting

**Common Issues:**

1. **Build Fails**: Check that all dependencies are in package.json
2. **API 500 Errors**: Verify environment variables are set correctly
3. **Database Connection**: Ensure MongoDB URI is correct and database allows connections

**Logs:**
- Check Vercel function logs in the Vercel dashboard
- Check the Functions tab for detailed error logs

### 🎉 Success!

Your full-stack application is now running entirely on Vercel! 

Both frontend and backend are deployed together, with the backend running as serverless functions.
