const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

function getGeminiApiUrl(): string {
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

interface CallGeminiOptions {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  temperature?: number;
  maxOutputTokens?: number;
}

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { code?: string; message?: string; status?: string };
}

export class GeminiError extends Error {
  code?: string;
  status?: string;
  constructor(message: string, code?: string, status?: string) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
    this.status = status;
  }
}

export async function callGemini({
  systemPrompt,
  userPrompt,
  jsonMode = false,
  temperature = 0.7,
  maxOutputTokens = 2048,
}: CallGeminiOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError(
      "GEMINI_API_KEY is not configured. Add it to your .env.local file.",
      "MISSING_API_KEY",
    );
  }

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };

  if (jsonMode) {
    (body.generationConfig as Record<string, unknown>).responseMimeType =
      "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${getGeminiApiUrl()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new GeminiError(
      `Network error contacting Gemini: ${err instanceof Error ? err.message : "unknown"}`,
      "NETWORK_ERROR",
    );
  }

  let data: GeminiResponse;
  try {
    data = (await response.json()) as GeminiResponse;
  } catch {
    throw new GeminiError(
      `Gemini returned non-JSON response (status ${response.status})`,
      "INVALID_RESPONSE",
    );
  }

  if (!response.ok || data.error) {
    const message =
      data.error?.message ||
      `Gemini API request failed with status ${response.status}`;
    throw new GeminiError(message, data.error?.code, data.error?.status);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError(
      "Gemini returned an empty response. The model may have refused the prompt.",
      "EMPTY_RESPONSE",
    );
  }

  return text;
}

export function isAIEnabled(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
