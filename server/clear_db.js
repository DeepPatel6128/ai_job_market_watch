require('dotenv').config();
const sequelize = require('./config/database');
const Job = require('./models/Job');
const JobAlias = require('./models/JobAlias');

async function clearDb() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await sequelize.close();
  }
}

clearDb();
