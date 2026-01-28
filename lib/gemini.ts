import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Tutor features will fail.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const tutorModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        responseMimeType: "application/json",
    },
});

export async function expandSearchQuery(query: string): Promise<string[]> {
    if (!query) return [];

    try {
        const prompt = `
        You are an intelligent search assistant for an educational video platform called Clarity.
        Your goal is to expand the user's search query into a list of relevant semantic search terms to find the best educational content.
        
        User Query: "${query}"
        
        Rules:
        1. Identify the core intent (e.g., "squeeze theorem" -> "Calculus", "Limits", "Squeeze Theorem").
        2. Add synonyms and related academic concepts.
        3. If it's a known creator (e.g., "organic chem tutor"), add their likely topics ("Chemistry", "Organic Chemistry").
        4. Return a JSON array of strings (max 6 terms).
        5. Prioritize relevance.
        
        Example Output: ["Calculus", "Limits", "Squeeze Theorem", "Math", "Continuity"]
        `;

        const result = await tutorModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON
        const terms = JSON.parse(text);
        if (Array.isArray(terms)) {
            return terms;
        }
        return [query];
    } catch (error) {
        console.error("Gemini search expansion error:", error);
        return [query];
    }
}
