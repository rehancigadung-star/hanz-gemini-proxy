// File: api/chat.js (Kode Backend yang Diperbaiki)

// Menggunakan require() (CommonJS) untuk stabilitas di Vercel
const { GoogleGenAI } = require('@google/genai');

const modelName = 'gemini-2.5-flash';

// Konfigurasi agar Vercel tahu ini harus di-build sebagai Node.js standar
export const config = {
  runtime: 'nodejs'
};

export default async function handler(request, response) {
  
  // Ambil Kunci dari Environment Variables Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (request.method !== 'POST') {
    // Memberi tahu bahwa hanya POST yang diizinkan (sesuai dengan index.html)
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Cek Kunci API Dulu. Jika tidak ada, kembalikan error yang jelas.
  if (!apiKey) {
      return response.status(500).json({ error: 'GEMINI_API_KEY is not set in Vercel Environment Variables. Please check your Vercel Project Settings.' });
  }
  
  // Inisialisasi API setelah Kunci dipastikan ada
  const ai = new GoogleGenAI({ apiKey }); 

  try {
    // Membaca history chat dari permintaan frontend
    const { history } = await request.json(); 
    
    if (!history || !Array.isArray(history)) {
        return response.status(400).json({ error: 'Missing chat history' });
    }

    // Panggilan API ke Google Gemini
    const result = await ai.models.generateContent({
        model: modelName,
        contents: history,
    });
    
    // Mengembalikan balasan teks AI ke frontend
    response.status(200).json({ text: result.text });

  } catch (error) {
    console.error('Vercel Function Error:', error);
    // Error jika ada masalah saat berkomunikasi dengan API Google
    response.status(500).json({ error: 'Internal Server Error (API call failed). Check Vercel logs for details.' });
  }
}
