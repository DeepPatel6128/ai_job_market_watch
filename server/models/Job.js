const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false
  },
  automationScore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  predictions: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  humanEdge: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Job;
