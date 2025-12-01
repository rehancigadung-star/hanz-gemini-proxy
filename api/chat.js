import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // Cek method POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST method" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message tidak boleh kosong" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.status(200).json({
      reply: responseText
    });

  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
