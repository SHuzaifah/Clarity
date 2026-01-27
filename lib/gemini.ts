import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Tutor features will fail.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const tutorModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        maxOutputTokens: 500, // Keep it concise
        temperature: 0.7,
    },
});
