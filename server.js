const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
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

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prodiny API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
