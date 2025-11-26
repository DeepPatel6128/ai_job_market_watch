const express = require('express');
const cors = require('cors');
const mockData = require('./mockData.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Search endpoint
app.get('/api/jobs/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Simple case-insensitive search
  const results = mockData.filter(job =>
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.field.toLowerCase().includes(query.toLowerCase())
  );

  res.json(results);
});

// Get all jobs (for testing)
app.get('/api/jobs', (req, res) => {
  res.json(mockData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
