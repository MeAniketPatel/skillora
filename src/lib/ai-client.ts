import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "mock-api-key";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(prompt: string, systemInstruction?: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI API error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
