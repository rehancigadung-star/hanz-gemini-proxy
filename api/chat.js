import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({ error: "Missing history" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(history);
    const text = result.response.text();

    return res.status(200).json({ text });

  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({
      error: "Backend Failure",
      detail: err.toString()
    });
  }
}
