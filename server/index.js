const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sequelize = require('./config/database');
const Job = require('./models/Job');
const mockData = require('./mockData.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
// Note: This will fail if GEMINI_API_KEY is not set in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync().then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Search endpoint
app.get('/api/jobs/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // 1. Check Database first (Cache Hit)
    const cachedJob = await Job.findOne({ where: { title: query } });

    if (cachedJob) {
      console.log(`Cache HIT for: ${query}`);
      return res.json([cachedJob]);
    }

    console.log(`Cache MISS for: ${query}. Calling AI...`);

    // 3. Ask Gemini
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Server missing API Key. Please check server logs.'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the job market for the role: "${query}".
      Provide a JSON response with the following structure (no markdown formatting, just raw JSON):
      {
        "title": "${query}",
        "field": "Inferred Industry",
        "automationScore": <number 0-100 representing risk>,
        "predictions": {
          "5y": "Prediction for 5 years from now",
          "10y": "Prediction for 10 years from now",
          "20y": "Prediction for 20 years from now"
        },
        "humanEdge": "Key human skills that will remain relevant"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jobData = JSON.parse(text);

    // 4. Save to Database (Cache Fill)
    try {
      await Job.create(jobData);
      console.log(`Saved ${query} to database.`);
    } catch (dbError) {
      console.error('Failed to save to DB:', dbError);
    }

    // Return as an array to match the expected format
    res.json([jobData]);

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate analysis. Please try again.' });
  }
});

// Get all jobs (for testing)
app.get('/api/jobs', (req, res) => {
  res.json(mockData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
