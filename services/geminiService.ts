import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function askGemini(prompt: string) {
    try {
        const res = await axios.post(
            `${GEMINI_URL}?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        );

        return res.data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Gemini Error:", err);
        return "Error contacting Gemini API.";
    }
}
