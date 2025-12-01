import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { history, model } = req.body;

    if (!history || history.length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const chatModel = genAI.getGenerativeModel({ model });

    const chat = chatModel.startChat({
      history: history,
    });

    const lastUserMsg = history[history.length - 1].parts[0].text;

    const result = await chat.sendMessage(lastUserMsg);

    const text = result.response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}
