require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("Fetching available models...");
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("\n--- Available Models ---");
    if (data.models) {
      data.models.forEach(model => {
        // Filter for models that support 'generateContent'
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`\nName: ${model.name}`);
          console.log(`Display Name: ${model.displayName}`);
          console.log(`Description: ${model.description}`);
        }
      });
    } else {
      console.log("No models found.");
    }
    console.log("\n------------------------");

  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
