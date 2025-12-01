// Konfigurasi untuk Node.js runtime
module.exports.config = {
  runtime: 'nodejs'
};

// Pakai CommonJS
const { GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY // PASTIKAN nama variabel sama
});

const modelName = 'gemini-2.5-flash';

module.exports = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userMessage
            }
          ]
        }
      ]
    });

    res.status(200).json({
      reply: result.response.text()
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
};
