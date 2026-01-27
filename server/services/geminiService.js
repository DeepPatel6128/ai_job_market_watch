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
    1. Determine if the query is a valid job role.
    2. If valid, determine the "canonicalTitle" (e.g., "coding wizard" -> "Software Engineer").
    3. Provide "aliases" (synonyms, alternate titles).

    CRITICAL VALIDATION:
    If the query is NOT a valid job role (e.g., "hello", "random text", "testing", "who is"), return STRICTLY an empty JSON object: {}.

    If Valid, provide a JSON response with this structure:
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('Gemini Rate Limit Hit');
      throw new Error('AI Service is currently overloaded (Rate Limit). Please wait a minute and try again.');
    }
    throw error;
  }
};
