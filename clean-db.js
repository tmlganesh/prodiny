// clean-db.js
// Script to delete all documents from all collections in the MongoDB Atlas cluster

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const coll of collections) {
      await mongoose.connection.db.collection(coll.name).deleteMany({});
      console.log(`Cleared collection: ${coll.name}`);
    }
    console.log('All collections cleaned.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning database:', err);
    process.exit(1);
  }
}

cleanDatabase();
