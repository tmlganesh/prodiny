const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://prodiny.vercel.app',
    'https://prodiny-client.vercel.app',
    'https://www.prodiny.com',
    'https://prodiny.com',
    'https://prodiny.onrender.com', // Add your Render domain
    // Add your actual domains here
    process.env.CLIENT_URL || 'http://localhost:3000'
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const collegeRoutes = require('./routes/colleges');
const subgroupRoutes = require('./routes/subgroups');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/subgroups', subgroupRoutes);
app.use('/api/users', userRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prodiny';
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set. Falling back to local MongoDB at', mongoUri);
  console.warn('To use a remote database, create a .env file at the project root with MONGODB_URI=<your-uri>');
}

// Disable buffering to prevent timeout errors
mongoose.set('bufferCommands', false);

// Enhanced MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 1, // Maintain at least 1 socket connection
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

mongoose.connect(mongoUri, mongooseOptions)
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Database name:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prodiny API is running!' });
});

// Catch-all handler: send back React's index.html file for any non-API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
