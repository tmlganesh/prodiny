const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const College = require('./models/College');
const Project = require('./models/Project');
const Subgroup = require('./models/Subgroup');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await College.deleteMany({});
    await Project.deleteMany({});
    await Subgroup.deleteMany({});

    console.log('Cleared existing data');

    // Create colleges
    const colleges = await College.create([
      {
        name: 'MIT',
        description: 'Massachusetts Institute of Technology - Leading in technology and innovation',
        domain: 'mit.edu'
      },
      {
        name: 'Stanford University',
        description: 'Stanford University - Excellence in research and education',
        domain: 'stanford.edu'
      },
      {
        name: 'Harvard University',
        description: 'Harvard University - America\'s oldest institution of higher learning',
        domain: 'harvard.edu'
      },
      {
        name: 'UC Berkeley',
        description: 'University of California, Berkeley - Premier public research university',
        domain: 'berkeley.edu'
      }
    ]);

    console.log('Created colleges');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@prodiny.com',
      password: 'admin123',
      role: 'admin',
      collegeId: colleges[0]._id
    });

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@mit.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id
      },
      {
        name: 'Jane Smith',
        email: 'jane@mit.edu',
        password: 'password123',
        role: 'faculty',
        collegeId: colleges[0]._id
      },
      {
        name: 'Bob Johnson',
        email: 'bob@stanford.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[1]._id
      },
      {
        name: 'Alice Brown',
        email: 'alice@harvard.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[2]._id
      }
    ]);

    console.log('Created users');

    // Create subgroups
    const subgroups = await Subgroup.create([
      {
        name: 'AI/ML Research',
        description: 'Group for artificial intelligence and machine learning enthusiasts',
        collegeId: colleges[0]._id,
        members: [users[0]._id, users[1]._id]
      },
      {
        name: 'Web Development',
        description: 'Full-stack web development community',
        collegeId: colleges[0]._id,
        members: [users[0]._id]
      },
      {
        name: 'Data Science Club',
        description: 'Data science and analytics discussion group',
        collegeId: colleges[1]._id,
        members: [users[2]._id]
      },
      {
        name: 'Cybersecurity Forum',
        description: 'Information security and ethical hacking community',
        collegeId: colleges[2]._id,
        members: [users[3]._id]
      }
    ]);

    // Add subgroups to colleges
    await College.findByIdAndUpdate(colleges[0]._id, { 
      $push: { subgroups: { $each: [subgroups[0]._id, subgroups[1]._id] } } 
    });
    await College.findByIdAndUpdate(colleges[1]._id, { 
      $push: { subgroups: subgroups[2]._id } 
    });
    await College.findByIdAndUpdate(colleges[2]._id, { 
      $push: { subgroups: subgroups[3]._id } 
    });

    // Add subgroups to users
    await User.findByIdAndUpdate(users[0]._id, { 
      $push: { subgroups: { $each: [subgroups[0]._id, subgroups[1]._id] } } 
    });
    await User.findByIdAndUpdate(users[1]._id, { 
      $push: { subgroups: subgroups[0]._id } 
    });
    await User.findByIdAndUpdate(users[2]._id, { 
      $push: { subgroups: subgroups[2]._id } 
    });
    await User.findByIdAndUpdate(users[3]._id, { 
      $push: { subgroups: subgroups[3]._id } 
    });

    console.log('Created subgroups');

    // Create projects
    const projects = await Project.create([
      {
        title: 'AI-Powered Study Assistant',
        description: 'Building an intelligent study companion that helps students organize their learning materials and track progress using machine learning algorithms.',
        tags: ['AI', 'Machine Learning', 'Education', 'React', 'Python'],
        ownerId: users[0]._id,
        members: [users[0]._id, users[1]._id],
        collegeId: colleges[0]._id,
        status: 'open'
      },
      {
        title: 'Campus Event Management System',
        description: 'A comprehensive platform for managing college events, RSVPs, and notifications with real-time updates.',
        tags: ['Web Development', 'Node.js', 'React', 'MongoDB'],
        ownerId: users[1]._id,
        members: [users[1]._id],
        collegeId: colleges[0]._id,
        status: 'in-progress'
      },
      {
        title: 'Blockchain-based Voting System',
        description: 'Developing a secure and transparent voting system for student elections using blockchain technology.',
        tags: ['Blockchain', 'Security', 'Solidity', 'Web3'],
        ownerId: users[2]._id,
        members: [users[2]._id],
        collegeId: colleges[1]._id,
        status: 'open'
      },
      {
        title: 'Mental Health Tracking App',
        description: 'Mobile application to help students track their mental health and connect with counseling resources.',
        tags: ['Mobile Development', 'React Native', 'Health', 'Firebase'],
        ownerId: users[3]._id,
        members: [users[3]._id],
        collegeId: colleges[2]._id,
        status: 'open'
      },
      {
        title: 'Sustainable Campus Initiative',
        description: 'IoT-based solution to monitor and reduce energy consumption across campus buildings.',
        tags: ['IoT', 'Sustainability', 'Arduino', 'Data Analysis'],
        ownerId: users[0]._id,
        members: [users[0]._id],
        collegeId: colleges[0]._id,
        status: 'completed'
      }
    ]);

    // Add projects to colleges
    await College.findByIdAndUpdate(colleges[0]._id, { 
      $push: { projects: { $each: [projects[0]._id, projects[1]._id, projects[4]._id] } } 
    });
    await College.findByIdAndUpdate(colleges[1]._id, { 
      $push: { projects: projects[2]._id } 
    });
    await College.findByIdAndUpdate(colleges[2]._id, { 
      $push: { projects: projects[3]._id } 
    });

    console.log('Created projects');

    // Add some posts to subgroups
    await Subgroup.findByIdAndUpdate(subgroups[0]._id, {
      $push: {
        posts: [
          {
            title: 'Welcome to AI/ML Research Group!',
            content: 'This is a place for discussing latest trends in artificial intelligence and machine learning. Feel free to share your projects, research papers, and ask questions!',
            author: users[1]._id,
            isPinned: true
          },
          {
            title: 'Upcoming ML Workshop',
            content: 'We\'re organizing a hands-on machine learning workshop next week. Topics will include neural networks, deep learning frameworks, and practical applications.',
            author: users[0]._id,
            isPinned: false
          }
        ]
      }
    });

    console.log('Added posts to subgroups');

    console.log('Seed data created successfully!');
    console.log('\nSample accounts:');
    console.log('Admin: admin@prodiny.com / admin123');
    console.log('Student: john@mit.edu / password123');
    console.log('Faculty: jane@mit.edu / password123');
    console.log('Student: bob@stanford.edu / password123');
    console.log('Student: alice@harvard.edu / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
