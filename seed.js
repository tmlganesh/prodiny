const mongoose = require('mongoose');
require('dotenv').config();

const College = require('./models/College');

const collegeNames = [
  "Vasireddy Venkatadri Institute of Technology (VVIT), Guntur",
  "National Institute of Technology (NIT), Tadepalligudem",
  "Indian Institute of Technology (IIT), Tirupati",
  "Andhra University College of Engineering, Visakhapatnam",
  "Jawaharlal Nehru Technological University (JNTU), Kakinada",
  "Jawaharlal Nehru Technological University (JNTU), Anantapur",
  "Jawaharlal Nehru Technological University (JNTU), Pulivendula",
  "KL University (Koneru Lakshmaiah Education Foundation), Vaddeswaram",
  "VIT-AP University, Amaravati",
  "SRM University, Amaravati",
  "GITAM Institute of Technology, Visakhapatnam",
  "Gayatri Vidya Parishad College of Engineering, Visakhapatnam",
  "RVR & JC College of Engineering, Guntur",
  "Prasad V. Potluri Siddhartha Institute of Technology, Vijayawada",
  "Velagapudi Ramakrishna Siddhartha Engineering College (VRSEC), Vijayawada",
  "Sagi Ramakrishnam Raju Engineering College (SRKR), Bhimavaram",
  "Aditya Engineering College, Surampalem",
  "Sri Vasavi Engineering College, Tadepalligudem",
  "Gudlavalleru Engineering College, Gudlavalleru",
  "Vignan’s Foundation for Science, Technology and Research, Guntur",
  "Vignan’s Lara Institute of Technology & Science, Guntur",
  "Vignan’s Institute of Information Technology, Visakhapatnam",
  "Anil Neerukonda Institute of Technology and Sciences (ANITS), Visakhapatnam",
  "Raghu Engineering College, Visakhapatnam",
  "Raghu Institute of Technology, Visakhapatnam",
  "Bapatla Engineering College, Bapatla",
  "PACE Institute of Technology & Sciences, Ongole",
  "QIS College of Engineering & Technology, Ongole",
  "DNR College of Engineering & Technology, Bhimavaram",
  "Sri Vishnu Engineering College for Women, Bhimavaram",
  "Shri Vishnu Institute of Technology, Bhimavaram",
  "Avanthi Institute of Engineering & Technology, Vizianagaram",
  "VSM College of Engineering, Ramachandrapuram",
  "Kakinada Institute of Engineering & Technology, Kakinada",
  "Kakinada Institute of Technology & Science, Kakinada",
  "Pragati Engineering College, Surampalem",
  "Bonam Venkata Chalamayya Engineering College, Odalarevu",
  "Dadi Institute of Engineering & Technology, Anakapalle",
  "Chaitanya Engineering College, Visakhapatnam",
  "Sanketika Institute of Technology & Management, Visakhapatnam",
  "Sri Sivani College of Engineering, Srikakulam",
  "Gonna Institute of Information Technology & Sciences (GIITS), Visakhapatnam",
  "Avanthi’s St. Theressa Institute of Engineering & Technology, Garividi",
  "Sri Mittapalli College of Engineering, Guntur",
  "Narasaraopeta Engineering College, Narasaraopet",
  "Nalanda Institute of Engineering & Technology, Guntur",
  "Eswar College of Engineering, Narasaraopet",
  "Bapatla Women’s Engineering College, Bapatla",
  "Chalapathi Institute of Engineering & Technology, Guntur",
  "Rise Krishna Sai Prakasam Group of Institutions, Ongole",
  "Krishna Chaitanya Institute of Technology & Sciences, Markapur",
  "Rajeev Gandhi Memorial College of Engineering & Technology (RGMCET), Nandyal",
  "G. Pullaiah College of Engineering & Technology, Kurnool",
  "G. Pulla Reddy Engineering College, Kurnool",
  "Madanapalle Institute of Technology & Science (MITS), Madanapalle",
  "Annamacharya Institute of Technology & Sciences (AITS), Rajampet",
  "Srinivasa Ramanujan Institute of Technology, Anantapur",
  "Intell Engineering College, Anantapur",
  "St. Johns College of Engineering & Technology, Kurnool",
  "KSRM College of Engineering, Kadapa",
  "Kandula Sreenivasa Reddy Memorial College of Engineering, Kadapa",
  "Chadalawada Ramanamma Engineering College, Tirupati",
  "SV University College of Engineering, Tirupati",
  "Sri Venkatesa Perumal College of Engineering & Technology, Puttur",
  "Sree Vidyanikethan Engineering College, Tirupati",
  "Sree Rama Engineering College, Tirupati",
  "Siddhartha Institute of Engineering & Technology, Puttur",
  "BIT Institute of Technology, Hindupur",
  "Lakireddy Bali Reddy College of Engineering, Mylavaram",
  "MIC College of Technology, Kanchikacherla",
  "VKR, VNB & AGK Engineering College, Gudivada",
  "Nova College of Engineering & Technology, Jupudi",
  "Lingayas Institute of Management & Technology, Vijayawada",
  "Malineni Lakshmaiah Engineering College, Guntur",
  "Chadalawada Institute of Technology, Tirupati",
  "Potti Sriramulu College of Engineering & Technology, Vijayawada",
  "Rajiv Gandhi University of Knowledge Technologies (RGUKT), Nuzvid",
  "Rajiv Gandhi University of Knowledge Technologies (RGUKT), Srikakulam",
  "Rajiv Gandhi University of Knowledge Technologies (RGUKT), Ongole",
  "Rajiv Gandhi University of Knowledge Technologies (RGUKT), RK Valley",
  "Sai Ganapathi Engineering College, Visakhapatnam",
  "Avanthi Institute of Engineering & Technology (Hyderabad Campus), Vizag zone",
  "Godavari Institute of Engineering & Technology (GIET), Rajahmundry",
  "Chaitanya Bharathi Institute of Technology, Cuddapah",
  "Pydah College of Engineering & Technology, Visakhapatnam",
  "Sri Sunflower College of Engineering & Technology, Lankapalli",
  "Swarnandhra College of Engineering & Technology, Narasapuram",
  "Eluru College of Engineering & Technology, Eluru",
  "Helapuri Institute of Technology & Science, Eluru",
  "Ramachandra College of Engineering, Eluru",
  "Prasiddha College of Engineering & Technology, Amalapuram",
  "Rajamahendri Institute of Engineering & Technology, Rajahmundry",
  "GIET Engineering College, Rajahmundry",
  "Sir C R Reddy College of Engineering, Eluru",
  "Sri Sai Institute of Technology & Science, Rayachoti",
  "MVR College of Engineering & Technology, Paritala",
  "Kommuri Pratap Reddy Institute of Technology, Guntur",
  "Bharatiya Vidya Bhavan’s Sardar Patel College of Engineering, Guntur",
  "Sri Chaitanya Institute of Science & Technology, Karimnagar (AP region)"
];

const andhraColleges = collegeNames.map((name, idx) => {
  // Generate a domain from the name (simple slug)
  const domain = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '.ac.in';
  return {
    name,
    description: `${name} - Premier Engineering Institution in Andhra Pradesh`,
    domain: domain
  };
});

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await College.deleteMany({});
    await College.create(andhraColleges);
    console.log('Seeded 100 Andhra colleges (provided list)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding colleges:', err);
    process.exit(1);
  }
};

seedData();
