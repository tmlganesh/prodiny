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
        name: 'Vasireddy Venkatadri Institute of Technology',
        description: 'Vasireddy Venkatadri Institute of Technology (VVIT), Guntur - Quality Technical Education',
        domain: 'vvit.net'
      },
      {
        name: 'KKR & KSR Institute of Technology & Sciences',
        description: 'KKR & KSR Institute of Technology & Sciences (KITS), Guntur - Excellence in Engineering',
        domain: 'kitsguntur.ac.in'
      },
      {
        name: 'Acharya Nagarjuna University College of Engineering',
        description: 'Acharya Nagarjuna University (ANU) College of Engineering and Technology, Guntur - Premier Engineering Institution',
        domain: 'anu.ac.in'
      },
      {
        name: 'Bapatla Engineering College',
        description: 'Bapatla Engineering College, Guntur - Quality Engineering Education',
        domain: 'bec.edu.in'
      },
      {
        name: 'Narasaraopeta Engineering College',
        description: 'Narasaraopeta Engineering College, Guntur - Technical Excellence',
        domain: 'nec.edu.in'
      },
      {
        name: 'NRI Institute of Technology',
        description: 'NRI Institute of Technology, Guntur - Innovation in Engineering Education',
        domain: 'nriit.edu.in'
      },
      {
        name: 'Vignan\'s Lara Institute of Technology & Science',
        description: 'Vignan\'s Lara Institute of Technology & Science, Guntur - Advanced Technical Education',
        domain: 'vlits.ac.in'
      },
      {
        name: 'Chebrolu Engineering College',
        description: 'Chebrolu Engineering College, Guntur - Quality Engineering Programs',
        domain: 'cec.edu.in'
      },
      {
        name: 'Chalapathi Institute of Engineering and Technology',
        description: 'Chalapathi Institute of Engineering and Technology, Guntur - Technical Innovation',
        domain: 'ciet.ac.in'
      },
      {
        name: 'KITS-AKSHAR Institute of Technology',
        description: 'KITS-AKSHAR Institute of Technology (formerly Guntur Engineering College), Guntur - Engineering Excellence',
        domain: 'kitsakshar.ac.in'
      },
      {
        name: 'Malineni Perumallu Educational Society\'s Group of Institutions',
        description: 'Malineni Perumallu Educational Society\'s Group of Institutions, Guntur - Comprehensive Technical Education',
        domain: 'mpes.ac.in'
      },
      {
        name: 'University College of Engineering, Narasaraopet',
        description: 'University College of Engineering, Narasaraopet, Guntur - Quality Engineering Education',
        domain: 'ucen.ac.in'
      },
      {
        name: 'Siddhartha Academy of Higher Education',
        description: 'Siddhartha Academy of Higher Education (formerly Velagapudi Ramakrishna Siddhartha Engineering College), Vijayawada - Premier Engineering Institution',
        domain: 'sahe.ac.in'
      },
      {
        name: 'Prasad V. Potluri Siddhartha Institute of Technology',
        description: 'Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT), Vijayawada - Excellence in Technology',
        domain: 'pvpsit.ac.in'
      },
      {
        name: 'Andhra Loyola Institute of Engineering and Technology',
        description: 'Andhra Loyola Institute of Engineering and Technology (ALIET), Vijayawada - Quality Technical Education',
        domain: 'aliet.ac.in'
      },
      {
        name: 'Dhanekula Institute of Engineering Technology',
        description: 'Dhanekula Institute of Engineering Technology, Vijayawada - Innovation in Engineering',
        domain: 'diet.ac.in'
      },
      {
        name: 'SRK Institute of Technology',
        description: 'SRK Institute of Technology, Vijayawada - Technical Excellence',
        domain: 'srkit.ac.in'
      },
      {
        name: 'Potti Sriramulu Chalavadi Mallikharjuna Rao College of Engineering',
        description: 'Potti Sriramulu Chalavadi Mallikharjuna Rao College of Engineering and Technology, Vijayawada - Engineering Education',
        domain: 'pscmr.ac.in'
      },
      {
        name: 'Vijaya Institute of Technology for Women',
        description: 'Vijaya Institute of Technology for Women, Vijayawada - Empowering Women in Technology',
        domain: 'vitw.ac.in'
      },
      {
        name: 'Vikas Group of Institutions',
        description: 'Vikas Group of Institutions, Vijayawada - Comprehensive Technical Education',
        domain: 'vikas.edu.in'
      },
      {
        name: 'R.K. College of Engineering',
        description: 'R.K. College of Engineering, Vijayawada - Quality Engineering Programs',
        domain: 'rkce.ac.in'
      },
      {
        name: 'Lingayas Institute of Management and Technology',
        description: 'Lingayas Institute of Management and Technology, Vijayawada - Technology and Management Education',
        domain: 'limt.ac.in'
      },
      {
        name: 'MIC College of Technology',
        description: 'MIC College of Technology, Vijayawada - Technical Innovation',
        domain: 'mict.ac.in'
      },
      {
        name: 'Nimra College of Engineering and Technology',
        description: 'Nimra College of Engineering and Technology, Vijayawada - Engineering Excellence',
        domain: 'nimra.ac.in'
      },
      {
        name: 'Amrita Sai Institute of Science and Technology',
        description: 'Amrita Sai Institute of Science and Technology, Vijayawada - Science and Technology Education',
        domain: 'asist.ac.in'
      },
      {
        name: 'MVR College of Engineering and Technology',
        description: 'MVR College of Engineering and Technology, Vijayawada - Quality Engineering Education',
        domain: 'mvrce.ac.in'
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
        email: 'john@rvrjc.ac.in',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id
      },
      {
        name: 'Jane Smith',
        email: 'jane@rvrjc.ac.in',
        password: 'password123',
        role: 'faculty',
        collegeId: colleges[0]._id
      },
      {
        name: 'Bob Johnson',
        email: 'bob@kluniversity.in',
        password: 'password123',
        role: 'student',
        collegeId: colleges[1]._id
      },
      {
        name: 'Alice Brown',
        email: 'alice@vignansuniversity.ac.in',
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
    console.log('Student: john@rvrjc.ac.in / password123');
    console.log('Faculty: jane@rvrjc.ac.in / password123');
    console.log('Student: bob@kluniversity.in / password123');
    console.log('Student: alice@vignansuniversity.ac.in / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
