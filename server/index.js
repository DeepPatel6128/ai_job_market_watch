const express = require('express');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Sync Database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Mount Routes
app.use('/api/jobs', jobRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
