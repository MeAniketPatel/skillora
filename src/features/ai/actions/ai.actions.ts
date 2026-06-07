"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { ValidationError } from "@/shared/lib/errors";
import { callGemini, isAIEnabled } from "../lib/gemini";
import { revalidatePath } from "next/cache";

export { isAIEnabled };

export async function generateAICourseDescription(title: string) {
  return actionHandler(async () => {
    await requireTeacher();

    if (!title || !title.trim()) {
      throw new ValidationError(
        "Course title is required to generate description",
      );
    }

    const systemPrompt = `You are an expert online curriculum designer. Generate a professional, comprehensive, and engaging course description in HTML format.

Rules:
- Use <p> tags for paragraphs
- Use <h3> for section headings
- Use <ul> and <li> for bullet lists
- Use <strong> for emphasis
- Tailor the content specifically to the course title — do not use generic filler
- Do not wrap the output in a markdown code block
- Output ONLY the raw HTML, no preamble or explanation
- Aim for 3-5 paragraphs and 4-6 bullet points covering what the student will learn`;

    const userPrompt = `Generate a course description for: "${title.trim()}"`;

    const html = await callGemini({ systemPrompt, userPrompt, temperature: 0.7 });

    return { description: html.trim() };
  });
}

interface GeminiQuizQuestion {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

function normalizeQuizQuestions(
  raw: unknown,
  topic: string,
): GeminiQuizQuestion[] {
  let arr: unknown[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.questions)) arr = obj.questions;
    else if (Array.isArray(obj.quiz)) arr = obj.quiz;
    else {
      const firstArray = Object.values(obj).find((v) => Array.isArray(v));
      if (Array.isArray(firstArray)) arr = firstArray;
    }
  }

  return arr
    .filter((q): q is Record<string, unknown> => !!q && typeof q === "object")
    .map((q) => {
      const text = String(q.question ?? q.prompt ?? "").trim();
      const optionsRaw = Array.isArray(q.options) ? q.options : [];
      const options = optionsRaw
        .filter((o): o is Record<string, unknown> => !!o && typeof o === "object")
        .map((o) => ({
          text: String(o.text ?? o.answer ?? "").trim(),
          isCorrect: Boolean(o.isCorrect ?? o.correct ?? false),
        }));
      const explanation = String(q.explanation ?? q.rationale ?? "").trim();
      return { question: text || `Question about ${topic}`, options, explanation };
    })
    .filter((q) => q.options.length > 0);
}

export async function generateAIQuizQuestions(topic: string) {
  return actionHandler(async () => {
    await requireTeacher();

    if (!topic || !topic.trim()) {
      throw new ValidationError("Quiz topic is required to generate questions");
    }

    const systemPrompt = `You are an expert educator. Generate exactly 3 multiple-choice quiz questions on the topic provided.

Output format (strict JSON, no markdown):
{
  "questions": [
    {
      "question": "string",
      "options": [
        { "text": "string", "isCorrect": boolean },
        { "text": "string", "isCorrect": boolean },
        { "text": "string", "isCorrect": boolean },
        { "text": "string", "isCorrect": boolean }
      ],
      "explanation": "string explaining the correct answer"
    }
  ]
}

Rules:
- Exactly 3 questions
- Exactly 4 options per question
- Exactly 1 option per question has isCorrect: true
- Questions must be specifically about the topic — not generic
- Distractors should be plausible but clearly wrong
- Explanations should teach, not just confirm`;

    const userPrompt = `Generate 3 quiz questions on the topic: "${topic.trim()}"`;

    const raw = await callGemini({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.7,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("Gemini returned invalid JSON for quiz questions");
      }
      parsed = JSON.parse(match[0]);
    }

    const questions = normalizeQuizQuestions(parsed, topic.trim());
    if (questions.length === 0) {
      throw new Error("Gemini returned no usable questions");
    }

    return { questions };
  });
}

export async function getAIConfigStatus() {
  return actionHandler(async () => {
    return {
      enabled: isAIEnabled(),
      provider: "gemini" as const,
    };
  });
}

// Re-export revalidatePath helper if other actions need it
export { revalidatePath };
