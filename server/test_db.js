require('dotenv').config();
const sequelize = require('./config/database');

async function testConnection() {
  console.log('Testing Database Connection...');
  console.log('URL:', process.env.DATABASE_URL ? 'Found (Hidden)' : 'Missing');

  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Optional: Sync to check if permissions are okay
    await sequelize.sync();
    console.log('✅ Models synced successfully.');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
