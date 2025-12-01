// Force Node runtime
export const config = {
  runtime: "nodejs"
};

const { GoogleGenAI } = require("@google/genai");

// Inisialisasi client dengan key dari Vercel Variables
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: userMessage }] }
      ]
    });

    res.status(200).json({
      reply: result.response.text()
    });

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};
