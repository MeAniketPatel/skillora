import { NextRequest } from "next/server";
import { genAI } from "@/lib/ai-client";
import { requireAuth } from "@/shared/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    await requireAuth();

    const { prompt, courseTitle, lessonTitle } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const systemInstruction = `You are a helpful, friendly AI study tutor on the Skillora learning platform.
You are helping the student study the course "${courseTitle || "General studies"}" and specifically the lesson "${lessonTitle || "General topic"}".
Answer their question professionally, keep it relatively concise and helpful, and use clear markdown spacing.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    // Request stream from Gemini
    const result = await model.generateContentStream(prompt);

    // Create a ReadableStream to stream the response chunks back to client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("AI chat route error:", error);
    return new Response(error?.message || "Internal server error", { status: 500 });
  }
}
