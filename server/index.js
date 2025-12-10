const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sequelize = require('./config/database');
const Job = require('./models/Job');
const JobAlias = require('./models/JobAlias');
const mockData = require('./mockData.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Search endpoint
app.get('/api/jobs/search', async (req, res) => {
// ... (rest of the file remains unchanged until the end)
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const normalizedQuery = query.toLowerCase();

  try {
    // 1. Unified Lookup: Check JobAlias
    const alias = await JobAlias.findOne({
      where: { query: normalizedQuery },
      include: Job
    });

    if (alias && alias.Job) {
      console.log(`Cache HIT (Alias) for: ${query} -> ${alias.Job.title}`);
      return res.json([alias.Job]);
    }

    console.log(`Cache MISS for: ${query}. Calling AI...`);

    // 2. Ask Gemini (Analysis + Canonical Title + Aliases)
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Server missing API Key. Please check server logs.'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the job market for the role: "${query}".

      Crucial:
      1. Determine the "canonicalTitle" for this role (e.g., if user types "coding wizard", canonical is "Software Engineer").
      2. Provide a list of "aliases" (synonyms, alternate titles, common search terms) for this role.

      Provide a JSON response with the following structure (no markdown formatting, just raw JSON):
      {
        "canonicalTitle": "Standardized Job Title",
        "aliases": ["Title 1", "Title 2", "Title 3"],
        "field": "Inferred Industry",
        "automationScore": <number 0-100 representing risk>,
        "predictions": {
          "5y": { "text": "Prediction for 5 years", "score": <number 0-100 impact> },
          "10y": { "text": "Prediction for 10 years", "score": <number 0-100 impact> },
          "20y": { "text": "Prediction for 20 years", "score": <number 0-100 impact> }
        },
        "humanEdge": "Key human skills that will remain relevant"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const aiData = JSON.parse(text);
    const canonicalTitle = aiData.canonicalTitle;
    const normalizedCanonical = canonicalTitle.toLowerCase();

    // Ensure aliases is an array and includes the canonical title and user query
    const aliases = Array.isArray(aiData.aliases) ? aiData.aliases : [];
    const allAliases = new Set([
      normalizedCanonical,
      query.toLowerCase(),
      ...aliases.map(a => a.toLowerCase())
    ]);

    // 3. Write Strategy
    let job;

    // Check if Job exists for canonical title (via Alias to be safe/consistent)
    const existingAlias = await JobAlias.findOne({
      where: { query: normalizedCanonical },
      include: Job
    });

    if (existingAlias && existingAlias.Job) {
      console.log(`Found existing Job for canonical: ${canonicalTitle}`);
      job = existingAlias.Job;
    } else {
      console.log(`Creating NEW Job: ${canonicalTitle}`);
      // Create Job
      job = await Job.create({
        title: canonicalTitle,
        field: aiData.field,
        automationScore: aiData.automationScore,
        predictions: aiData.predictions,
        humanEdge: aiData.humanEdge
      });
    }

    // Bulk Create Aliases
    console.log(`Saving aliases: ${[...allAliases].join(', ')}`);
    const aliasPromises = [...allAliases].map(aliasQuery =>
      JobAlias.findOrCreate({
        where: { query: aliasQuery },
        defaults: { JobId: job.id }
      })
    );

    await Promise.all(aliasPromises);

    // Return as an array to match the expected format
    res.json([job]);

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate analysis. Please try again.' });
  }
});

// Get all jobs (for testing)
app.get('/api/jobs', (req, res) => {
  res.json(mockData);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
