const mongoose = require('mongoose');
const College = require('../models/College');
const User = require('../models/User');

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
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const seedColleges = async () => {
  const colleges = [
    {
      name: 'RVR & JC College of Engineering',
      description: 'RVR & JC College of Engineering, Guntur - Excellence in Engineering Education',
      domain: 'rvrjc.ac.in'
    },
    {
      name: 'KL University',
      description: 'KL University (Koneru Lakshmaiah Education Foundation), Guntur - Leading University in Engineering and Technology',
      domain: 'kluniversity.in'
    },
    {
      name: 'Vignan\'s University',
      description: 'Vignan\'s University (Vignan\'s Foundation for Science, Technology & Research), Guntur - Innovation in Higher Education',
      domain: 'vignansuniversity.ac.in'
    },
    {
      name: 'Vasireddy Venkatadri Institute of Technology (VVIT)',
      description: 'Vasireddy Venkatadri Institute of Technology (VVIT), Guntur - Quality Technical Education',
      domain: 'vvit.net'
    },
    {
      name: 'KKR & KSR Institute of Technology & Sciences (KITS)',
      description: 'KKR & KSR Institute of Technology & Sciences (KITS), Guntur - Excellence in Engineering',
      domain: 'kitsguntur.ac.in'
    },
    // Add all other colleges...
    {
      name: 'MVR College of Engineering and Technology',
      description: 'MVR College of Engineering and Technology, Vijayawada - Quality Engineering Education',
      domain: 'mvrce.ac.in'
    }
  ];

  const existingColleges = await College.countDocuments();
  if (existingColleges === 0) {
    await College.insertMany(colleges);
    console.log('Colleges seeded successfully');
  }
};

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    
    if (req.method === 'POST' && req.query.action === 'seed') {
      await seedColleges();
      return res.json({ message: 'Database seeded successfully!' });
    }
    
    const collegeCount = await College.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({ 
      message: 'Seed endpoint ready',
      stats: {
        colleges: collegeCount,
        users: userCount
      },
      instruction: 'Send POST request with ?action=seed to seed the database'
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
