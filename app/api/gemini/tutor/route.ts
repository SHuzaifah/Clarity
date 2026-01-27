import { NextRequest, NextResponse } from "next/server";
import { tutorModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    const { action, context, userQuery } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const { videoTitle, nodeTitle, currentNotes, timestamp } = context;

    let systemPrompt = `You are a quiet, insightful tutor inside a learning app called Clarity. 
    Your goal is to help the user understand the concept: "${nodeTitle}" (Video: "${videoTitle}").
    Current Video Timestamp: ${timestamp}s.
    User's Notes so far: "${currentNotes || '(User has written no notes yet)'}".
    
    You do NOT chat casually. You explain, ask probing questions, or refine thoughts.
    Keep answers concise and relevant to the video context. 
    Do not say "Hello" or "How can I help". Jump straight to the value.
    `;

    let userPrompt = "";

    if (action === "explain") {
        systemPrompt += `\nThe user is stuck or needs a better explanation. Explain the current concept simply. Use an analogy if appropriate.`;
        userPrompt = userQuery || "Explain this concept.";
    } else if (action === "refine") {
        systemPrompt += `\nThe user wants to clean up their notes. Organize the provided notes into clear, markdown bullets. Fix typos and improve clarity. Do not add new information, just structure the existing thoughts.`;
        userPrompt = "Refine my notes.";
    } else if (action === "socratic") {
        systemPrompt += `\nDo not answer the user's question directly. Instead, ask a Socratic question that guides them to the answer based on the video context. Check their understanding.`;
        userPrompt = userQuery || "Test my understanding.";
    } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    try {
        const result = await tutorModel.generateContent([
            systemPrompt,
            userPrompt
        ]);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
