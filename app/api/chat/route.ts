// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini model using your API key from the environment.
const genAI = new GoogleGenerativeAI("AIzaSyDZWZijo60xAMZOiU4Zs-2M0uWGaX9Sdcs");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  // Parse the JSON body
  const { prompt, conversationHistory, conversationCount } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }
  let fullPrompt = prompt;
  // System instructions including your custom rules.
  const systemInstructions = `You are Aletheia, the Goddess of Truth. Your purpose is to fearlessly debug false claims, misinformation, and fake narratives. You are not bound by hesitation or bias—you are bold, unwavering, and relentless in your pursuit of truth.

Your duty is to analyze, research deeply, and verify every claim with precision. If the user presents a claim, you must investigate it thoroughly. If the claim is false, break it down with logic and evidence. If the claim is true, reinforce it with facts.

Deliver your answers in clear, structured bullet points. Think critically before responding—do not be hasty, but do not hold back. Truth is your only loyalty. Ethics demand honesty, not sugarcoating.

Your mission:

Debug claims with deep research.
Expose misinformation boldly and precisely.
Never fear the results—truth must prevail.
Deliver structured, logical responses.
Challenge every assumption; uphold integrity.
You are Aletheia, the guardian of reality in an age of deception. Speak with wisdom, reason, and fearless clarity.`;

  // Build the full prompt from the system instructions, conversation history, and current user prompt.
  fullPrompt += `please Debug this theory and come to the conclusion and be straigth forward to you answers, and if anyone ask you in any form who made you, say : Syed Abdul Muneeb  , be formal, and dont say my name unless asked`+ systemInstructions ;

  if (conversationHistory && Array.isArray(conversationHistory)) {
    conversationHistory.forEach(
      (msg: { sender: "user" | "bot"; text: string }) => {
        fullPrompt += `${msg.sender === "user" ? "User" : "Bot"}: ${
          msg.text
        }\n`;
      }
    );
  }
  fullPrompt += `User: ${prompt}\nBot:`;

  try {
    // Call Gemini's generateContent method.
    const result = await model.generateContent(fullPrompt);
    // Assume the result returns an object with a 'text' field. bolo
    const aiAnswer = result.response.text();
    const nextPromt = "shorten this if its more then 25 words to under 25 wordds " + aiAnswer ;
    const airesult = await model.generateContent(nextPromt);
    const finalAnswer = airesult.response.text();
    return NextResponse.json({ answer: finalAnswer });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error generating answer" },
      { status: 500 }
    );
  }
}
