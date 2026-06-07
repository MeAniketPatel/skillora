import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "mock-api-key";
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

export function getModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction,
  });
}

export async function askGemini(prompt: string, systemInstruction?: string) {
  try {
    const model = getModel(systemInstruction);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI API error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
