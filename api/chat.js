// Konfigurasi Runtime Node.js (WAJIB untuk Vercel)
export const config = {
  runtime: 'nodejs'
};

// CommonJS require
const { GoogleGenAI } = require('@google/genai');

// Inisialisasi Client
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY   // ❗ WAJIB SAMA DENGAN VARIABLE DI VERCEL
});

const modelName = 'gemini-2.5-flash';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    res.status(200).json({
      reply: result.response.text()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
};
