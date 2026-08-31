import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient } from "./_lib/gemini.js";
import { scanRecipeUSDA } from "../src/data/usdaData.js";

type IntendedMethod = "WATER_BATH" | "PRESSURE_CANNER";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      title,
      recipeText,
      jarSize = "Pint (16 oz)",
      intendedMethod,
    } = req.body || {};

    if (!recipeText) {
      return res.status(400).json({ error: "Recipe text is required." });
    }

    const normalizedIntendedMethod: IntendedMethod | undefined =
      intendedMethod === "WATER_BATH" || intendedMethod === "PRESSURE_CANNER"
        ? intendedMethod
        : undefined;

    const attachMethodCheck = (result: any) => {
      if (normalizedIntendedMethod) {
        result.userSelectedMethod = normalizedIntendedMethod;

        if (result.processingMethod === "NOT_SAFE") {
          result.methodMismatch = true;
        } else {
          result.methodMismatch =
            result.processingMethod !== normalizedIntendedMethod;
        }
      }

      return result;
    };

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are an AI assistant that analyzes home-canning recipes using publicly available USDA and National Center for Home Food Preservation (NCHFP) guidance.

IMPORTANT:
- Do NOT claim to be USDA-certified.
- Do NOT claim that JarCheck or this analysis certifies a recipe as safe.
- Do NOT invent or estimate a USDA-tested processing time, pressure, headspace, or jar-size recommendation.
- A generic ingredient analysis is NOT equivalent to a tested canning recipe.
- If a specific tested process cannot be established from the information provided, clearly say that tested guidance is required.
- Be conservative whenever safety information is uncertain.

Recipe Title: "${title || "Untitled Recipe"}"
Target Jar Size: "${jarSize}"
User's Intended Canning Method: "${normalizedIntendedMethod || "Not specified"}"

Recipe Content:
${recipeText}

Evaluate the recipe for:
1. Potential red-flag ingredients or preparation methods.
2. Whether the user's intended method appears inappropriate based on the recipe characteristics.
3. Whether the recipe appears to contain low-acid ingredients, high-acid ingredients, acidified ingredients, or ingredients that may interfere with safe heat penetration.
4. Whether the selected jar size presents an obvious safety concern.
5. Whether a tested USDA/NCHFP recipe or process would be required before canning.

Method classification:
- "WATER_BATH" = the recipe appears appropriate for a tested boiling-water process.
- "PRESSURE_CANNER" = the recipe appears to involve low-acid food that ordinarily requires pressure processing.
- "NOT_SAFE" = the recipe contains a significant known home-canning hazard, uses a prohibited container/process, or cannot reasonably be recommended for home canning based on the information provided.

Safety score:
Assign a conservative 0-100 score reflecting how many obvious safety concerns are present.
This score is NOT a certification.

Processing guidelines:
Only provide specific processing parameters when they are explicitly supported by a recognized tested recipe/process contained in the recipe information or known USDA/NCHFP guidance.
Otherwise:
- processingTimeMinutes MUST be 0
- recommendedHeadspace MUST be "See tested recipe"
- psiDialGauge MUST be "See tested pressure-canning guidance"
- psiWeightedGauge MUST be "See tested pressure-canning guidance"
- altitudeAdjustment MUST be "Follow the altitude adjustment in the applicable tested recipe/process."
- jarSizeSafetyNote should explain when the selected jar size requires a tested recipe or is not approved.

Return ONLY valid JSON conforming to this schema:

{
  "recipeTitle": "${title || "Custom Canning Recipe"}",
  "selectedJarSize": "${jarSize}",
  "safetyScore": 85,
  "status": "SAFE_WITH_MODIFICATIONS",
  "processingMethod": "PRESSURE_CANNER",
  "estimatedPh": 5.2,
  "redFlags": [
    {
      "keyword": "example",
      "severity": "WARNING",
      "reason": "Explanation of the concern.",
      "category": "LOW_ACID"
    }
  ],
  "safeAlternatives": [
    {
      "original": "example",
      "replacement": "Safer alternative",
      "rationale": "Why this alternative may reduce the identified concern."
    }
  ],
  "canningGuidelines": {
    "jarSize": "${jarSize}",
    "processingTimeMinutes": 0,
    "recommendedHeadspace": "See tested recipe",
    "psiDialGauge": "See tested pressure-canning guidance",
    "psiWeightedGauge": "See tested pressure-canning guidance",
    "altitudeAdjustment": "Follow the altitude adjustment in the applicable tested recipe/process.",
    "jarSizeSafetyNote": "A tested recipe/process is required for specific processing parameters."
  },
  "mandatoryWarning": "This analysis does not certify a recipe as safe. Always follow a current tested recipe and processing guidance from USDA, NCHFP, or a local Extension office.",
  "summary": "Conservative safety assessment explaining what was detected and whether tested guidance is required.",
  "timestamp": "${new Date().toISOString()}"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);

          parsed.recipeText = recipeText;

          return res.json(attachMethodCheck(parsed));
        }
      } catch (geminiError) {
        console.warn(
          "Gemini API call failed, falling back to local USDA scanner:",
          geminiError
        );
      }
    }

    const localResult = scanRecipeUSDA(
      title || "",
      recipeText,
      jarSize
    );

    localResult.recipeText = recipeText;

    return res.json(attachMethodCheck(localResult));
  } catch (err: any) {
    console.error("Error in /api/analyze-recipe:", err);
    return res
      .status(500)
      .json({ error: "Internal server error analyzing recipe." });
  }
}