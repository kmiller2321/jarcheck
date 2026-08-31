import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient } from "./_lib/gemini.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const contents = messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents,
          config: {
            systemInstruction: `You are Master Canner AI, an authoritative, warm, and highly knowledgeable Master Food Preserver assistant for JarCheck.
You help home preservers with water-bath canning, pressure canning, altitude PSI adjustments, pH/acidification requirements, botulism prevention (Clostridium botulinum safety), jar sealing troubleshooting, and recipe conversions according to USDA and NCHFP standards.
Keep your responses practical, clear, structured with bullet points or steps when needed, and always emphasize food safety.`,
            temperature: 0.3,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiErr) {
        console.warn("Gemini chat failed, using fallback assistant:", geminiErr);
      }
    }

    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let fallbackReply =
      "Master Canner Safety Guidance:\n\nAlways follow tested USDA or NCHFP canning instructions. Never alter processing times or density ingredients (like adding flour, cornstarch, or excess butter) in canned goods.\n\nFor pressure canning, ensure your dial or weighted gauge is calibrated and adjusted for your specific elevation above sea level.";

    if (lastUserMsg.includes("botulism") || lastUserMsg.includes("safe")) {
      fallbackReply =
        "Botulism Prevention Standard:\nClostridium botulinum spores produce lethal neurotoxins in low-acid (pH > 4.6), anaerobic (vacuum-sealed) environments at room temperature.\n\n• High-Acid Foods (pH ≤ 4.6): Fruits, pickles, acidified tomatoes, jams — safe for Water-Bath Processing.\n• Low-Acid Foods (pH > 4.6): Vegetables, meats, poultry, seafood, soups — REQUIRE Pressure Canning at 10–15 PSI to reach 240°F (116°C).";
    } else if (lastUserMsg.includes("altitude") || lastUserMsg.includes("psi")) {
      fallbackReply =
        "Altitude PSI Adjustment Guide:\n• 0 – 1,000 ft: 11 PSI (dial gauge) / 10 PSI (weighted gauge)\n• 1,001 – 2,000 ft: 11 PSI (dial) / 15 PSI (weighted)\n• 2,001 – 4,000 ft: 12 PSI (dial) / 15 PSI (weighted)\n• 4,001 – 6,000 ft: 13 PSI (dial) / 15 PSI (weighted)\n• 6,001 – 8,000 ft: 14 PSI (dial) / 15 PSI (weighted)";
    }

    return res.json({ reply: fallbackReply });
  } catch (err: any) {
    console.error("Error in /api/canning-chat:", err);
    return res.status(500).json({ error: "Server error during AI chat session." });
  }
}
