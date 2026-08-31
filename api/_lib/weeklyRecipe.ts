import { getGeminiClient } from "./gemini.js";
import { getSupabaseAdmin } from "./supabase.js";

export interface WeeklyRecipeData {
  weekKey: string;
  title: string;
  subtitle: string;
  description: string;
  prepTime: string;
  processingTime: string;
  yieldJars: string;
  method: "Water Bath Canner" | "Pressure Canner";
  headspace: string;
  ingredients: string[];
  instructions: { stepNumber: number; title: string; detail: string; safetyNote?: string }[];
  safetyChecklist: string[];
}

/** ISO 8601 week key, e.g. "2026-W32". Recipes are cached one-per-week by this key. */
export function getIsoWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getCurrentSeason(date: Date = new Date()): string {
  const month = date.getUTCMonth(); // 0-11
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

function fallbackRecipe(weekKey: string): WeeklyRecipeData {
  return {
    weekKey,
    title: "Citrus Honey Peach Jam",
    subtitle: "Fresh Citrus & Golden Honey Peach Preserve for Water Bath Canning",
    description:
      "A vibrant home jam featuring sweet summer peaches, freshly squeezed citrus notes, and organic golden clover honey. Balanced specifically for home water bath processing.",
    prepTime: "20 Mins",
    processingTime: "10 Mins (Water Bath)",
    yieldJars: "6 Half-Pint (8 oz) Jars",
    method: "Water Bath Canner",
    headspace: "1/4 inch",
    ingredients: [
      "4 cups peeled, pitted, and chopped ripe peaches",
      "1/4 cup bottled lemon juice (strictly 5% acidity for safety)",
      "1/2 cup raw clover honey & 3.5 cups granulated sugar",
      "1 box (1.75 oz) powdered fruit pectin",
      "1 tsp grated lemon zest",
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Fruit & Acid Prep",
        detail: "Combine chopped peaches, lemon zest, and mandatory 1/4 cup bottled lemon juice in a large stockpot.",
        safetyNote: "Bottled lemon juice provides predictable 5% acidity necessary for safe water bath canning.",
      },
      {
        stepNumber: 2,
        title: "Pectin & Honey Boil",
        detail: "Stir in pectin and honey. Bring mixture to a rolling boil over high heat, stirring constantly.",
        safetyNote: "Maintain constant stirring to prevent scorching.",
      },
      {
        stepNumber: 3,
        title: "Sugar Boil & Jar Fill",
        detail: "Add sugar, return to a full rolling boil for 1 minute. Ladle into clean jars leaving 1/4 inch headspace.",
        safetyNote: "Check 1/4 inch headspace with a headspace gauge tool before applying lids.",
      },
      {
        stepNumber: 4,
        title: "Water Bath Processing",
        detail: "Process half-pint jars in a boiling water bath canner for 10 minutes (adjust for altitude).",
        safetyNote: "Allow jars to cool undisturbed on a towel for 12-24 hours before testing seals.",
      },
    ],
    safetyChecklist: [
      "Bottled lemon juice verified at 5% acidity",
      "Headspace verified at 1/4 inch",
      "Boiling water cover maintained 1-2 inches over jar lids",
      "Vacuum seals inspected after 24-hour cooling period",
    ],
  };
}

async function generateViaGemini(weekKey: string): Promise<WeeklyRecipeData> {
  const ai = getGeminiClient();
  if (!ai) return fallbackRecipe(weekKey);

  const season = getCurrentSeason();

  try {
    const prompt = `You are the recipe developer for JarCheck, a home canning safety brand. Create ONE original, USDA/NCHFP-safe home canning recipe for this week's featured "Recipe of the Week" newsletter feature. It should feel seasonal for ${season} in the Northern Hemisphere, and be distinct from generic jam recipes -- vary the format (jam, pickle, salsa, chutney, whole-fruit canning, pressure-canned vegetable or soup, etc.) and the featured produce week to week.

Hard safety rules the recipe MUST follow:
- If water-bath canning, the recipe must be high-acid (pH <= 4.6) -- use bottled lemon/lime juice or vinegar at a safe, standard ratio, never fresh juice for acidification.
- If any low-acid ingredients are involved (vegetables, meat, etc.), the method MUST be "Pressure Canner", not water bath.
- Never include flour, cornstarch, butter, cream, milk, cheese, or pureed low-acid vegetables/pumpkin as canned-in ingredients.
- Include a realistic processing time and headspace for the jar size implied by the yield.

Return ONLY a JSON object with exactly this shape, no markdown, no commentary:
{
  "title": "string",
  "subtitle": "string",
  "description": "1-2 sentence description",
  "prepTime": "e.g. '20 Mins'",
  "processingTime": "e.g. '10 Mins (Water Bath)'",
  "yieldJars": "e.g. '6 Half-Pint (8 oz) Jars'",
  "method": "Water Bath Canner" or "Pressure Canner",
  "headspace": "e.g. '1/4 inch'",
  "ingredients": ["string", "..."],
  "instructions": [{"stepNumber": 1, "title": "string", "detail": "string", "safetyNote": "optional string"}],
  "safetyChecklist": ["string", "..."]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.8 },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return { weekKey, ...parsed };
    }
  } catch (err) {
    console.warn("Gemini weekly recipe generation failed, using fallback recipe:", err);
  }

  return fallbackRecipe(weekKey);
}

/**
 * Returns this ISO week's featured recipe. Generated once per week via
 * Gemini and cached in Supabase (table: weekly_recipes) so the on-site
 * "Recipe of the Week" and the emailed newsletter always show the exact
 * same content. If Supabase isn't configured, generates fresh each call
 * (best-effort, no caching) rather than failing.
 */
export async function getOrGenerateWeeklyRecipe(forceRegenerate = false): Promise<WeeklyRecipeData> {
  const weekKey = getIsoWeekKey();
  const supabase = getSupabaseAdmin();

  if (supabase && !forceRegenerate) {
    const { data } = await supabase.from("weekly_recipes").select("*").eq("week_key", weekKey).maybeSingle();
    if (data) {
      return {
        weekKey: data.week_key,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        prepTime: data.prep_time,
        processingTime: data.processing_time,
        yieldJars: data.yield_jars,
        method: data.method,
        headspace: data.headspace,
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        safetyChecklist: data.safety_checklist || [],
      };
    }
  }

  const generated = await generateViaGemini(weekKey);

  if (supabase) {
    await supabase.from("weekly_recipes").upsert(
      {
        week_key: generated.weekKey,
        title: generated.title,
        subtitle: generated.subtitle,
        description: generated.description,
        prep_time: generated.prepTime,
        processing_time: generated.processingTime,
        yield_jars: generated.yieldJars,
        method: generated.method,
        headspace: generated.headspace,
        ingredients: generated.ingredients,
        instructions: generated.instructions,
        safety_checklist: generated.safetyChecklist,
      },
      { onConflict: "week_key" },
    );
  }

  return generated;
}
