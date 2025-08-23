const mongoose = require('mongoose');
require('dotenv').config();
const College = require('./models/College');

const addColleges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing colleges
    await College.deleteMany({});
    console.log('Cleared existing colleges');
    
    // Define all colleges with proper domains
    const colleges = [
      {
        name: 'RVR & JC College of Engineering',
        description: 'RVR & JC College of Engineering, Guntur - Excellence in Engineering Education',
        domain: 'rvrjc.ac.in',
        location: 'Guntur'
      },
      {
        name: 'KL University',
        description: 'KL University (Koneru Lakshmaiah Education Foundation), Guntur - Leading University in Engineering and Technology',
        domain: 'kluniversity.in',
        location: 'Guntur'
      },
      {
        name: 'Vignan\'s University',
        description: 'Vignan\'s University (Vignan\'s Foundation for Science, Technology & Research), Guntur - Innovation in Higher Education',
        domain: 'vignansuniversity.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Vasireddy Venkatadri Institute of Technology (VVIT)',
        description: 'Vasireddy Venkatadri Institute of Technology (VVIT), Guntur - Quality Technical Education',
        domain: 'vvit.net',
        location: 'Guntur'
      },
      {
        name: 'KKR & KSR Institute of Technology & Sciences (KITS)',
        description: 'KKR & KSR Institute of Technology & Sciences (KITS), Guntur - Excellence in Engineering',
        domain: 'kitsguntur.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Acharya Nagarjuna University (ANU) College of Engineering and Technology',
        description: 'Acharya Nagarjuna University (ANU) College of Engineering and Technology, Guntur - Premier Engineering Institution',
        domain: 'anu.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Bapatla Engineering College',
        description: 'Bapatla Engineering College, Guntur - Quality Engineering Education',
        domain: 'bec.edu.in',
        location: 'Guntur'
      },
      {
        name: 'Narasaraopeta Engineering College',
        description: 'Narasaraopeta Engineering College, Guntur - Technical Excellence',
        domain: 'nec.edu.in',
        location: 'Guntur'
      },
      {
        name: 'NRI Institute of Technology',
        description: 'NRI Institute of Technology, Guntur - Innovation in Engineering Education',
        domain: 'nriit.edu.in',
        location: 'Guntur'
      },
      {
        name: 'Vignan\'s Lara Institute of Technology & Science',
        description: 'Vignan\'s Lara Institute of Technology & Science, Guntur - Advanced Technical Education',
        domain: 'vlits.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Chebrolu Engineering College',
        description: 'Chebrolu Engineering College, Guntur - Quality Engineering Programs',
        domain: 'cec.edu.in',
        location: 'Guntur'
      },
      {
        name: 'Chalapathi Institute of Engineering and Technology',
        description: 'Chalapathi Institute of Engineering and Technology, Guntur - Technical Innovation',
        domain: 'ciet.ac.in',
        location: 'Guntur'
      },
      {
        name: 'KITS-AKSHAR Institute of Technology',
        description: 'KITS-AKSHAR Institute of Technology (formerly Guntur Engineering College), Guntur - Engineering Excellence',
        domain: 'kitsakshar.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Malineni Perumallu Educational Society\'s Group of Institutions',
        description: 'Malineni Perumallu Educational Society\'s Group of Institutions, Guntur - Comprehensive Technical Education',
        domain: 'mpes.ac.in',
        location: 'Guntur'
      },
      {
        name: 'University College of Engineering, Narasaraopet',
        description: 'University College of Engineering, Narasaraopet, Guntur - Quality Engineering Education',
        domain: 'ucen.ac.in',
        location: 'Guntur'
      },
      {
        name: 'Siddhartha Academy of Higher Education',
        description: 'Siddhartha Academy of Higher Education (formerly Velagapudi Ramakrishna Siddhartha Engineering College), Vijayawada - Premier Engineering Institution',
        domain: 'sahe.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT)',
        description: 'Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT), Vijayawada - Excellence in Technology',
        domain: 'pvpsit.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Andhra Loyola Institute of Engineering and Technology (ALIET)',
        description: 'Andhra Loyola Institute of Engineering and Technology (ALIET), Vijayawada - Quality Technical Education',
        domain: 'aliet.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Dhanekula Institute of Engineering Technology',
        description: 'Dhanekula Institute of Engineering Technology, Vijayawada - Innovation in Engineering',
        domain: 'diet.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'SRK Institute of Technology',
        description: 'SRK Institute of Technology, Vijayawada - Technical Excellence',
        domain: 'srkit.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Potti Sriramulu Chalavadi Mallikharjuna Rao College of Engineering and Technology',
        description: 'Potti Sriramulu Chalavadi Mallikharjuna Rao College of Engineering and Technology, Vijayawada - Engineering Education',
        domain: 'pscmr.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Vijaya Institute of Technology for Women',
        description: 'Vijaya Institute of Technology for Women, Vijayawada - Empowering Women in Technology',
        domain: 'vitw.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Vikas Group of Institutions',
        description: 'Vikas Group of Institutions, Vijayawada - Comprehensive Technical Education',
        domain: 'vikas.edu.in',
        location: 'Vijayawada'
      },
      {
        name: 'R.K. College of Engineering',
        description: 'R.K. College of Engineering, Vijayawada - Quality Engineering Programs',
        domain: 'rkce.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Lingayas Institute of Management and Technology',
        description: 'Lingayas Institute of Management and Technology, Vijayawada - Technology and Management Education',
        domain: 'limt.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'MIC College of Technology',
        description: 'MIC College of Technology, Vijayawada - Technical Innovation',
        domain: 'mict.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Nimra College of Engineering and Technology',
        description: 'Nimra College of Engineering and Technology, Vijayawada - Engineering Excellence',
        domain: 'nimra.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'Amrita Sai Institute of Science and Technology',
        description: 'Amrita Sai Institute of Science and Technology, Vijayawada - Science and Technology Education',
        domain: 'asist.ac.in',
        location: 'Vijayawada'
      },
      {
        name: 'MVR College of Engineering and Technology',
        description: 'MVR College of Engineering and Technology, Vijayawada - Quality Engineering Education',
        domain: 'mvrce.ac.in',
        location: 'Vijayawada'
      }
    ];
    
    // Insert all colleges
    const insertedColleges = await College.insertMany(colleges);
    console.log(`✅ Successfully added ${insertedColleges.length} colleges to the database!`);
    
    // Display all colleges
    console.log('\n📋 Colleges added:\n');
    insertedColleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name} (${college.location})`);
      console.log(`   Domain: ${college.domain}`);
      console.log('');
    });
    
    console.log('🎉 All colleges have been successfully added to the database!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error adding colleges:', error);
    process.exit(1);
  }
};

addColleges();
