const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('../routes/auth');
const projectRoutes = require('../routes/projects');
const collegeRoutes = require('../routes/colleges');
const subgroupRoutes = require('../routes/subgroups');
const userRoutes = require('../routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://prodiny.vercel.app',
    'https://prodiny-client.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    };

    const connection = await mongoose.connect(mongoUri, mongooseOptions);
    cachedDb = connection;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/colleges', collegeRoutes);
app.use('/subgroups', subgroupRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'API is running', timestamp: new Date().toISOString() });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prodiny API is running on Vercel!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the Express app as a serverless function
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
