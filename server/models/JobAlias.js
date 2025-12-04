const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Job = require('./Job');

const JobAlias = sequelize.define('JobAlias', {
  query: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    set(value) {
      this.setDataValue('query', value.toLowerCase());
    }
  }
});

// Define Association
Job.hasMany(JobAlias);
JobAlias.belongsTo(Job);

module.exports = JobAlias;
