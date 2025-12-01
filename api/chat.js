import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(message);

    res.status(200).json({
      reply: result.response.text(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
      detail: err.message,
    });
  }
}
