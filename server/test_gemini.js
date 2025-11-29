require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log("Checking API Key...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing from process.env");
    return;
  }
  console.log("API Key found (length: " + process.env.GEMINI_API_KEY.length + ")");

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Sending test prompt...");
    const result = await model.generateContent("Say 'Hello from Gemini!' if you can hear me.");
    const response = await result.response;
    const text = response.text();
    console.log("SUCCESS: Gemini responded:");
    console.log(text);
  } catch (error) {
    console.error("FAILURE: API Call failed.");
    console.error(error);
  }
}

test();
