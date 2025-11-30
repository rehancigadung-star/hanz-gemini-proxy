// File: api/chat.js (Kode Backend Vercel yang Aman)

// Pastikan Anda telah menginstal paket Google GenAI di project Vercel Anda
import { GoogleGenAI } from '@google/genai'; 

// Inisialisasi API dengan Kunci yang disembunyikan di Vercel Environment Variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const modelName = 'gemini-2.5-flash';

export default async function handler(request, response) {
  
  // Pastikan hanya metode POST yang diizinkan dari frontend
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Membaca body yang dikirim dari index.html (yang berisi history chat)
    const { history } = await request.json(); 
    
    if (!history || !Array.isArray(history)) {
        return response.status(400).json({ error: 'Missing chat history' });
    }

    // Melakukan panggilan ke API Gemini menggunakan Kunci Rahasia
    const result = await ai.models.generateContent({
        model: modelName,
        contents: history,
    });
    
    // Mengembalikan respons sederhana ke index.html
    response.status(200).json({ text: result.text });

  } catch (error) {
    console.error('Vercel Function Error:', error);
    // Tambahkan CORS agar frontend bisa membaca error
    response.setHeader('Access-Control-Allow-Origin', '*'); 
    response.status(500).json({ error: 'Internal Server Error (Backend Failure)' });
  }
}
