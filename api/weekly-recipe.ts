import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOrGenerateWeeklyRecipe } from "./_lib/weeklyRecipe.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const recipe = await getOrGenerateWeeklyRecipe();
    // Safe to cache briefly at the edge -- same recipe all week.
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    return res.json(recipe);
  } catch (err) {
    console.error("Error in /api/weekly-recipe:", err);
    return res.status(500).json({ error: "Failed to load this week's recipe." });
  }
}
