"use server";

import { actionHandler } from "@/lib/action-utils";
import { requireTeacher } from "@/lib/auth-helpers";
import { ValidationError } from "@/lib/errors";

export async function generateAICourseDescription(title: string) {
  return actionHandler(async () => {
    await requireTeacher();

    if (!title || !title.trim()) {
      throw new ValidationError("Course title is required to generate description");
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert online curriculum designer. Generate a professional, comprehensive, and engaging course description in HTML format. Use paragraph tags, list items, and strong tags. Do not wrap in a markdown block, just output raw HTML.",
              },
              {
                role: "user",
                content: `Generate a course description for: "${title}"`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        const htmlDescription = data.choices?.[0]?.message?.content;
        if (htmlDescription) {
          return { description: htmlDescription.trim() };
        }
      } catch (err) {
        console.error("OpenAI request failed, falling back to mock generator:", err);
      }
    }

    const fallbackHTML = `
      <p>Welcome to <strong>${title}</strong>! This comprehensive curriculum program has been carefully structured to take you from a baseline understanding to an advanced operational proficiency.</p>
      <p>Through interactive modules and structured labs, you will master the core foundations, design principles, and optimization strategies required in industry environments today.</p>
      <h3>What you will learn:</h3>
      <ul>
        <li><strong>Core Foundations:</strong> Learn the essential mechanics, paradigms, and syntax constructs.</li>
        <li><strong>Advanced Architectures:</strong> Apply design systems and modular design patterns to keep projects scalable.</li>
        <li><strong>Performance Tuning:</strong> Debug runtime bottlenecks, optimize execution cycles, and refine deployment files.</li>
        <li><strong>Real-World Integrations:</strong> Build real-world portfolio deliverables and get evaluation feedback.</li>
      </ul>
      <p>No prior specialist expertise is required, though basic literacy in the technology stack is highly recommended. Join us and upgrade your skill profile!</p>
    `;

    return { description: fallbackHTML.trim() };
  });
}

export async function generateAIQuizQuestions(topic: string) {
  return actionHandler(async () => {
    await requireTeacher();

    if (!topic || !topic.trim()) {
      throw new ValidationError("Quiz topic is required to generate questions");
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an educator. Generate 3 multiple choice questions for a quiz on the specified topic. Output the result ONLY as a JSON array of objects. Each object must have: 'question' (string), 'options' (array of objects with: 'text' (string) and 'isCorrect' (boolean)), and 'explanation' (string). Ensure exactly one option is marked correct.",
              },
              {
                role: "user",
                content: `Generate questions on: "${topic}"`,
              },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        });

        const data = await response.json();
        const jsonStr = data.choices?.[0]?.message?.content;
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          const questions = parsed.questions || parsed;
          if (Array.isArray(questions)) {
            return { questions };
          }
        }
      } catch (err) {
        console.error("OpenAI quiz request failed, falling back to mock generator:", err);
      }
    }

    const fallbackQuestions = [
      {
        question: `What is the primary architectural concept when learning ${topic}?`,
        options: [
          { text: "Separation of concerns and modular code distribution", isCorrect: true },
          { text: "Monolithic file pooling without imports", isCorrect: false },
          { text: "Dynamic layout manipulation without compile checking", isCorrect: false },
          { text: "Server-side routing exclusion models", isCorrect: false },
        ],
        explanation: "Modern development paradigms prioritize splitting systems into distinct modules with dedicated responsibilities.",
      },
      {
        question: `Which of the following describes a key performance best-practice in ${topic}?`,
        options: [
          { text: "Excessive polling cycles over standard database triggers", isCorrect: false },
          { text: "Caching static configurations and optimizing payload states", isCorrect: true },
          { text: "Executing database queries directly within client-side markup renders", isCorrect: false },
          { text: "Disabling types and lint checking prior to build execution", isCorrect: false },
        ],
        explanation: "Caching immutable states and pruning network payloads significantly improves rendering latency and resource conservation.",
      },
      {
        question: `How does one verify correctness of implementation modules in ${topic}?`,
        options: [
          { text: "Conducting unit tests, compiler checks, and manual walkthrough builds", isCorrect: true },
          { text: "Relying on user bug logs after publishing directly to main branches", isCorrect: false },
          { text: "Restricting compilation tests to local development run loops", isCorrect: false },
          { text: "Using print statements without test assertions", isCorrect: false },
        ],
        explanation: "A robust verification lifecycle employs automated unit testing, strict type assertions, and staging environment verification.",
      },
    ];

    return { questions: fallbackQuestions };
  });
}
