const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeJob = async (query) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Server missing API Key');
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

  return JSON.parse(text);
};
