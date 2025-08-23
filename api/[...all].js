const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all routes
const authRoutes = require('../routes/auth');
const projectRoutes = require('../routes/projects');
const collegeRoutes = require('../routes/colleges');
const subgroupRoutes = require('../routes/subgroups');
const userRoutes = require('../routes/users');

// Database connection cache
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Disconnect if already connected with different URI
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
    };

    cachedDb = await mongoose.connect(mongoUri, mongooseOptions);
    console.log('MongoDB connected successfully to:', mongoose.connection.db.databaseName);
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/colleges', collegeRoutes);
app.use('/subgroups', subgroupRoutes);
app.use('/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Prodiny API is running on Vercel!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Prodiny API - Welcome!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found', path: req.originalUrl });
});

// Export as serverless function
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
};
