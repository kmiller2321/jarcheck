import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateWeeklyEmail } from "../_lib/emailTemplates.js";

/**
 * Used by the "Preview AI Auto-Email Draft" button on each past recipe
 * card in WeeklyRecipeArchive.tsx. Pure preview -- generates HTML only,
 * does not send anything or touch the database.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { recipeTitle, season, ctaUrl } = req.body || {};
    const email = await generateWeeklyEmail({ recipeTitle, season, ctaUrl });
    return res.json(email);
  } catch (err) {
    console.error("Error in generate-weekly-email:", err);
    return res.status(500).json({ error: "Failed to generate AI newsletter email." });
  }
}
