// Konfigurasi untuk memaksa Node.js runtime
module.exports.config = {
  runtime: 'nodejs'
};

// Menggunakan require (CommonJS)
const { GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const modelName = 'gemini-2.5-flash';

module.exports = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const result = await client.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: userMessage }] }]
    });

    res.status(200).json({
      reply: result.response.text()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
