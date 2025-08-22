# Prodiny - Setup and Deployment Guide

## 🚀 Quick Start

Your full-stack college collaboration platform is ready! Here's how to get it running:

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (version 16 or higher)
- **MongoDB** (local installation OR MongoDB Atlas account)
- **npm** or **yarn**

## 🛠️ Setup Instructions

### 1. Database Setup (Choose one option)

#### Option A: MongoDB Atlas (Recommended - Free & Easy)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/prodiny`)
5. Update the `MONGODB_URI` in your `.env` file

#### Option B: Local MongoDB
1. Install MongoDB locally on your machine
2. Start the MongoDB service
3. Use the default connection string: `mongodb://localhost:27017/prodiny`

### 2. Environment Configuration

Edit the `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Installation & Startup

#### Using Batch Files (Windows - Easiest)
1. Run `setup.bat` to install all dependencies
2. Configure your MongoDB connection in `.env`
3. Run `node seed.js` to populate sample data
4. Use `start-backend.bat` to start the server
5. Use `start-frontend.bat` to start the React app

#### Manual Installation
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Seed the database (after configuring MongoDB)
node seed.js

# Start backend (in one terminal)
npm run dev

# Start frontend (in another terminal)
cd client
npm start
```

## 🔗 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Sample User Accounts

After running the seed script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@prodiny.com | admin123 |
| Student | john@mit.edu | password123 |
| Faculty | jane@mit.edu | password123 |
| Student | bob@stanford.edu | password123 |

## 🌟 Features Overview

### For Students
- **Discover Projects**: Browse projects from your college
- **Join Communities**: Connect with peers in subgroups
- **Create Projects**: Start new collaborative projects
- **Build Portfolio**: Showcase your contributions

### For Faculty
- **Moderate Communities**: Pin important posts in subgroups
- **Mentor Students**: Guide student projects
- **Create Educational Projects**: Launch learning initiatives

### For Administrators
- **Manage Colleges**: Add/edit college information
- **User Management**: Control user roles and permissions
- **Platform Analytics**: View usage statistics

## 🎯 How to Use

1. **Sign Up**: Create an account and select your college
2. **Explore Dashboard**: See the Reddit-style project feed
3. **Join Projects**: Click "Join" on interesting projects
4. **Expand Colleges**: Click on college names to see subgroups
5. **Join Subgroups**: Connect with communities that interest you
6. **Create Content**: Start your own projects or join discussions

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running (if local)
   - Check your connection string in `.env`
   - For Atlas: verify IP whitelist and credentials

2. **Port Already in Use**
   - Change the PORT in `.env` to something else (e.g., 5001)
   - Make sure no other apps are using ports 3000 or 5000

3. **Dependencies Issues**
   - Delete `node_modules` folders and run `npm install` again
   - Try using `npm ci` instead of `npm install`

4. **CORS Errors**
   - The backend is configured for CORS
   - If issues persist, check the proxy setting in `client/package.json`

## 📁 Project Structure

```
Prodiny-new/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   └── package.json
├── models/                 # Database models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── server.js              # Express server
├── seed.js               # Database seeding
└── package.json          # Backend dependencies
```

## 🚀 Next Steps

1. **Customize**: Modify colors, logos, and branding in Tailwind config
2. **Extend**: Add new features like file uploads, notifications, etc.
3. **Deploy**: Use platforms like Heroku, Vercel, or AWS for production
4. **Scale**: Add caching, rate limiting, and database indexing

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your MongoDB connection
4. Make sure both backend and frontend servers are running

## 🌐 Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB database
3. Generate a strong JWT secret
4. Enable HTTPS
5. Set up proper logging and monitoring

---

**Congratulations! Your college collaboration platform is ready to connect students and foster amazing projects! 🎉**
