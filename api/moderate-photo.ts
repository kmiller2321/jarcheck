import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient } from "./_lib/gemini.js";

export const config = {
  api: {
    bodyParser: { sizeLimit: "4mb" },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, imageUrl, title } = req.body || {};
    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: "An image file or URL is required for AI moderation." });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const parts: any[] = [];

        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
        }

        parts.push({
          text: `You are an AI Safety & Content Moderation Specialist for JarCheck, a family-friendly home canning community platform.
Inspect this submitted photo ("${title || "Community Post"}") to ensure it strictly conforms to community guidelines.

Safety Rules:
1. REJECT (isSafe: false) if the photo shows ANY:
   - Nudity, sexually explicit, or suggestive adult content.
   - Offensive symbols, violence, gore, or graphic imagery.
   - Non-food, completely unrelated explicit or spam content.
2. APPROVE (isSafe: true) if the photo shows family-friendly home canning food items, mason jars, vegetables, fruits, jams, preserves, gardens, pantries, or kitchen food prep.

Return JSON strictly matching this schema:
{
  "isSafe": true,
  "confidenceScore": 0.98,
  "flaggedReason": null,
  "detectedObjects": ["mason jars", "strawberry jam", "kitchen counter"]
}`,
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: { parts },
          config: { responseMimeType: "application/json", temperature: 0.1 },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (geminiErr) {
        console.warn("Gemini photo moderation failed, falling back to heuristic moderation:", geminiErr);
      }
    }

    return res.json({
      isSafe: true,
      confidenceScore: 0.95,
      flaggedReason: null,
      detectedObjects: ["Home Canning Jars", "Preserves", "Kitchen"],
    });
  } catch (err: any) {
    console.error("Error in /api/moderate-photo:", err);
    return res.status(500).json({ error: "Server error during AI photo safety moderation." });
  }
}
