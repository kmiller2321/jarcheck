import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null | undefined;

export function getGeminiClient(): GoogleGenAI | null {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    cachedClient = null;
    return null;
  }

  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "jarcheck-app",
      },
    },
  });
  return cachedClient;
}
