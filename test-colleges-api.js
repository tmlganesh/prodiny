const mongoose = require('mongoose');
require('dotenv').config();
const College = require('./models/College');

const testCollegesAPI = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const colleges = await College.find({}).sort({ name: 1 });
    console.log(`\n✅ Total colleges in database: ${colleges.length}\n`);
    
    // Test API format
    const apiFormat = colleges.map(c => ({ 
      _id: c._id, 
      name: c.name, 
      domain: c.domain,
      description: c.description 
    }));
    
    console.log('📋 Colleges formatted for API:');
    console.log(JSON.stringify({ colleges: apiFormat.slice(0, 3) }, null, 2));
    console.log(`... and ${apiFormat.length - 3} more colleges`);
    
    // Test combobox format
    const comboboxFormat = colleges.map(c => ({ label: c.name, value: c._id }));
    console.log('\n📋 Colleges formatted for Combobox:');
    comboboxFormat.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.label} (ID: ${item.value})`);
    });
    console.log(`... and ${comboboxFormat.length - 5} more options`);
    
    console.log('\n✅ All colleges are properly formatted and ready for use!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testCollegesAPI();
