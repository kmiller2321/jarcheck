import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient } from "./_lib/gemini.js";
import { scanRecipeUSDA } from "../src/data/usdaData.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, recipeText, jarSize = "Pint (16 oz)", intendedMethod } = req.body || {};
    if (!recipeText) {
      return res.status(400).json({ error: "Recipe text is required." });
    }

    const attachMethodCheck = (result: any) => {
      if (intendedMethod === "WATER_BATH" || intendedMethod === "PRESSURE_CANNER") {
        result.userSelectedMethod = intendedMethod;
        result.methodMismatch = result.processingMethod !== "NOT_SAFE" && result.processingMethod !== intendedMethod;
      }
      return result;
    };

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are a Senior Master Food Safety Specialist certified by the USDA National Center for Home Food Preservation (NCHFP).
Analyze the following home canning recipe for biological and physical safety:

Recipe Title: "${title || "Untitled Recipe"}"
Target Jar Size: "${jarSize}"
Recipe Content:
${recipeText}

Evaluate strictly against USDA Guidelines:
1. Detect "Red Flag" ingredients (flour, cornstarch, butter, milk, cheese, cream, oil, pumpkin puree, low-acid veggies, unacidified tomatoes).
2. Determine processing method: 'WATER_BATH' (high acid pH <= 4.6), 'PRESSURE_CANNER' (low acid pH > 4.6), or 'NOT_SAFE' (contains dairy, flour, oil, purees).
3. Assign a safety score (0 to 100).
4. Provide safe USDA alternatives for high-risk ingredients.
5. Provide specific processing guidelines tailored strictly to the selected Jar Size ("${jarSize}"):
   - Calculate exact processing time in minutes for "${jarSize}". (Quarts require longer cook times than pints/1/2 pints. Half-gallon is ONLY USDA-approved for clear apple/grape juice; gallon jars are NOT approved for home canning under any circumstances).
   - Calculate recommended headspace for "${jarSize}" (e.g., 1/4" for jams in 1/2 pint/pint, 1/2" for quarts/fruits, 1" to 1-1/4" for pressure canning).
   - Include jarSizeSafetyNote if half-gallon or gallon jar presents safety risks for this recipe type.

Return a JSON object conforming strictly to this schema:
{
  "recipeTitle": "${title || "Custom Canning Recipe"}",
  "selectedJarSize": "${jarSize}",
  "safetyScore": 85,
  "status": "SAFE_WITH_MODIFICATIONS",
  "processingMethod": "PRESSURE_CANNER",
  "estimatedPh": 5.2,
  "redFlags": [{"keyword": "flour", "severity": "DANGER", "reason": "Flour thickeners impede heat flow in jars causing botulism risk.", "category": "THICKENER"}],
  "safeAlternatives": [{"original": "flour", "replacement": "ClearJel (modified cornstarch)", "rationale": "ClearJel allows heat to penetrate safely without breaking down."}],
  "canningGuidelines": {"jarSize": "${jarSize}", "processingTimeMinutes": 25, "recommendedHeadspace": "1 inch", "psiDialGauge": "11 PSI (0-2000 ft altitude)", "psiWeightedGauge": "10 PSI (0-1000 ft altitude)", "altitudeAdjustment": "Add +5 mins for water bath or +1-2 PSI for pressure canner per 1000 ft elevation.", "jarSizeSafetyNote": "Optional note regarding USDA jar size limits"},
  "mandatoryWarning": "CRITICAL SAFETY NOTICE: Always adhere strictly to USDA NCHFP tested formulas. Never alter density or acid ratios.",
  "summary": "Detailed summary of safety evaluation.",
  "timestamp": "${new Date().toISOString()}"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: { responseMimeType: "application/json", temperature: 0.2 },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsed.recipeText = recipeText;
          return res.json(attachMethodCheck(parsed));
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local USDA scanner:", geminiError);
      }
    }

    const localResult = scanRecipeUSDA(title || "", recipeText, jarSize);
    return res.json(attachMethodCheck(localResult));
  } catch (err: any) {
    console.error("Error in /api/analyze-recipe:", err);
    return res.status(500).json({ error: "Internal server error analyzing recipe." });
  }
}
