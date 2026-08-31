import { getGeminiClient } from "./gemini.js";
import type { WeeklyRecipeData } from "./weeklyRecipe.js";

export interface FeaturedRecipe {
  title: string;
  subtitle?: string;
  ingredients?: string[];
  instructions?: { stepNumber: number; title: string; detail: string; safetyNote?: string }[];
  processingTime?: string;
  headspace?: string;
  yieldJars?: string;
}

const DEFAULT_RECIPE: FeaturedRecipe = {
  title: "Citrus Honey Peach Jam",
  subtitle: "Fresh Citrus & Golden Honey Peach Preserve for Water Bath Canning",
  processingTime: "10 Mins (Water Bath)",
  headspace: "1/4 inch",
  yieldJars: "6 Half-Pint (8 oz) Jars",
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
    },
    {
      stepNumber: 3,
      title: "Sugar Boil & Jar Fill",
      detail: "Add sugar, return to a full rolling boil for 1 minute. Ladle into clean jars leaving 1/4 inch headspace.",
    },
    {
      stepNumber: 4,
      title: "Water Bath Processing",
      detail: "Process jars in a boiling water bath canner for 10 minutes (adjusting for altitude as necessary).",
    },
  ],
};

function fallbackWelcomeHtml(email: string, recipe: FeaturedRecipe, unsubscribeUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
        <span style="background: rgba(255, 129, 7, 0.25); color: #FF8107; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 12px;">Official Welcome Email</span>
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Welcome to JarCheck Weekly! 🌿</h1>
        <p style="color: #d1d5db; margin-top: 8px; font-size: 14px; line-height: 1.5;">You are now subscribed to receive USDA-verified home canning recipes, safety guides, and seasonal preserve inspiration every week.</p>
      </div>

      <div style="padding: 28px 24px; color: #374151;">
        <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 18px; padding: 18px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 6px 0; color: #9a3412; font-size: 15px; font-weight: 800;">🎉 Thank You for Subscribing!</h3>
          <p style="margin: 0; font-size: 13px; color: #431407; line-height: 1.5;">We're thrilled to have you in our preserver community. Keep an eye on your inbox every week for fresh, tested recipes!</p>
        </div>

        <div style="background: #ffffff; border: 1px solid #f3f4f6; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          <span style="background: #FF8107; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">This Week's Featured Recipe</span>
          <h2 style="color: #111827; margin: 12px 0 6px 0; font-size: 22px; font-weight: 900;">${recipe.title}</h2>
          <p style="color: #6b7280; font-size: 13px; margin-top: 0;">${recipe.subtitle || ""}</p>

          <div style="padding: 12px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; font-size: 12px; font-weight: 700; color: #374151; margin: 16px 0; display: flex; justify-content: space-between;">
            <span>⏱️ ${recipe.processingTime}</span>
            <span>📐 ${recipe.headspace} Headspace</span>
            <span>🫙 ${recipe.yieldJars}</span>
          </div>

          <h3 style="color: #111827; font-size: 14px; margin-top: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">🛒 Required Ingredients</h3>
          <ul style="padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.7;">
            ${recipe.ingredients ? recipe.ingredients.map((i) => `<li>${i}</li>`).join("") : "<li>Fresh produce & acidity ingredients</li>"}
          </ul>

          <h3 style="color: #111827; font-size: 14px; margin-top: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">📋 Step-by-Step Canning Instructions</h3>
          <ol style="padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.7;">
            ${
              recipe.instructions
                ? recipe.instructions
                    .map(
                      (s) =>
                        `<li style="margin-bottom: 8px;"><strong>${s.title}:</strong> ${s.detail} ${s.safetyNote ? `<span style="color: #c2410c; display: block; font-size: 12px; margin-top: 2px;">⚠️ ${s.safetyNote}</span>` : ""}</li>`,
                    )
                    .join("")
                : "<li>Follow standard canning guidelines.</li>"
            }
          </ol>
        </div>

        <div style="background: linear-gradient(135deg, #FF8107 0%, #e06f00 100%); color: #ffffff; padding: 24px; border-radius: 20px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 900;">Unlock 50+ Archived Weekly Recipes</h3>
          <p style="margin: 0 0 16px 0; font-size: 13px; opacity: 0.95;">Subscribers get instant access to our AI safety auditor, digital jar tracker, and elevation calculators.</p>
          <a href="${process.env.APP_URL || "#"}" style="display: inline-block; background: #ffffff; color: #111827; font-weight: 900; font-size: 13px; padding: 12px 28px; border-radius: 12px; text-decoration: none;">Explore Member Dashboard →</a>
        </div>
      </div>

      <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
        Sent to ${email} • JarCheck Home Canning Assistant<br />
        <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
      </div>
    </div>`;
}

/**
 * Generates the welcome email HTML, trying Gemini first for a richer
 * result and falling back to a solid hand-built template if Gemini is
 * unavailable or errors out.
 */
export async function generateWelcomeEmail(
  email: string,
  unsubscribeUrl: string,
  featuredRecipe?: FeaturedRecipe,
): Promise<{ subject: string; html: string }> {
  const recipe = featuredRecipe || DEFAULT_RECIPE;
  const subject = `Welcome to JarCheck Weekly! 🌿 Here is This Week's Recipe: ${recipe.title}`;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Create a warm, premium, responsive HTML "Welcome Email" for a new subscriber to JarCheck Weekly Home Canning Assistant.
Subscriber Email: "${email}"
This Week's Featured Recipe: "${recipe.title}" - ${recipe.subtitle || ""}
Yield: ${recipe.yieldJars || "6 Half-Pint Jars"} | Processing: ${recipe.processingTime || "10 Mins Water Bath"} | Headspace: ${recipe.headspace || "1/4 inch"}

Ingredients:
${recipe.ingredients ? recipe.ingredients.map((i) => `- ${i}`).join("\n") : "- Ripe Peaches, Bottled Lemon Juice, Pectin, Honey, Sugar"}

Canning Steps:
${recipe.instructions ? recipe.instructions.map((s) => `Step ${s.stepNumber}: ${s.title} - ${s.detail} ${s.safetyNote ? `(Safety Note: ${s.safetyNote})` : ""}`).join("\n") : "Follow USDA water bath processing rules."}

Requirements for the HTML Email:
1. Warm Welcome Header thanking the subscriber for joining JarCheck Weekly!
2. Feature section with the full recipe: ingredients, yield, headspace, processing specs, step-by-step guidelines.
3. USDA Safety Banner reinforcing 5% bottled lemon juice and elevation adjustment rules.
4. High-converting CTA Box: "Unlock 50+ Past Weekly Recipes, AI Canning Safety Analyzer & Digital Pantry".
5. Styled with responsive inline CSS, warm amber/orange (#FF8107) brand accent, clean dark header (#111827), rounded cards, readable fonts.
6. Include an unsubscribe footer line linking to exactly this URL: ${unsubscribeUrl}

Return ONLY valid raw HTML string with inline CSS styling, with NO markdown formatting codeblocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      if (response.text) {
        const html = response.text.replace(/```html|```/g, "").trim();
        return { subject, html };
      }
    } catch (err) {
      console.warn("Gemini welcome email generation failed, using fallback template:", err);
    }
  }

  return { subject, html: fallbackWelcomeHtml(email, recipe, unsubscribeUrl) };
}

export async function generateWeeklyEmail(params: {
  recipeTitle?: string;
  season?: string;
  ctaUrl?: string;
}): Promise<{ subject: string; html: string }> {
  const recipeTitle = params.recipeTitle || DEFAULT_RECIPE.title;
  const season = params.season || "Summer";
  const ctaUrl = params.ctaUrl || process.env.APP_URL || "https://example.com";
  const subject = `🌿 JarCheck Weekly Tested Recipe: ${recipeTitle}`;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Create a gorgeous HTML email newsletter for home canning enthusiasts.
Featured Recipe: "${recipeTitle}"
Season: "${season}"
Includes:
1. Warm greeting to home preservers.
2. Complete free weekly tested recipe details, ingredient list, and 4 step-by-step canning directions with USDA safety check.
3. A prominent Call-to-Action (CTA) box: "Unlock 50+ Past Archived Weekly Recipes, AI Safety Analyzer & Altitude PSI Tools". Link button: "${ctaUrl}".
4. Clean responsive HTML with inline CSS styling, warm orange (#FF8107) accents, and clear typography.

Return ONLY the raw HTML string for the email template without markdown backticks.`,
      });

      if (response.text) {
        const html = response.text.replace(/```html|```/g, "").trim();
        return { subject, html };
      }
    } catch (err) {
      console.warn("Gemini weekly email generation failed, using fallback template:", err);
    }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden;">
      <div style="background: #0d0d0d; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="color: #FF8107; margin: 0; font-size: 24px;">JarCheck Weekly</h1>
        <p style="color: #9ca3af; margin-top: 4px; font-size: 13px;">USDA Tested Canning Inspiration & Safety</p>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <h2 style="color: #111827;">${recipeTitle}</h2>
        <p>This week's free recipe is verified for safe water-bath processing! Always use 5% bottled lemon juice to maintain proper acidity.</p>
        <div style="margin: 24px 0; padding: 20px; background: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; text-align: center;">
          <h3 style="color: #9a3412; margin-top: 0;">Want Unlimited Access to Past Weekly Recipes?</h3>
          <p style="font-size: 13px; color: #431407;">Unlock 50+ past archived weekly recipes, AI safety analyzer, and custom altitude calculators.</p>
          <a href="${ctaUrl}" style="display: inline-block; background: #FF8107; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none;">Upgrade to Pro ($9.99/mo)</a>
        </div>
      </div>
    </div>`;

  return { subject, html };
}

/**
 * Deterministic (non-AI) HTML formatter for the real weekly recipe object
 * used by the site's "Recipe of the Week" section. Used for the actual
 * Monday newsletter dispatch so the email always matches the site exactly,
 * with no risk of drifting from a second, separate Gemini call.
 */
export function renderRecipeEmailHtml(recipe: WeeklyRecipeData, ctaUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden;">
      <div style="background: #0d0d0d; color: #ffffff; padding: 28px 24px; text-align: center;">
        <span style="color: #FF8107; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Recipe of the Week</span>
        <h1 style="color: #ffffff; margin: 8px 0 4px 0; font-size: 24px; font-weight: 900;">${recipe.title}</h1>
        <p style="color: #9ca3af; margin: 0; font-size: 13px;">${recipe.subtitle}</p>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <p style="font-size: 14px; line-height: 1.6; color: #374151;">${recipe.description}</p>

        <div style="display: flex; gap: 10px; margin: 16px 0; font-size: 11px; font-weight: 700; color: #374151;">
          <span style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:8px 12px;">⏱️ ${recipe.processingTime}</span>
          <span style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:8px 12px;">📐 ${recipe.headspace}</span>
          <span style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:8px 12px;">🫙 ${recipe.yieldJars}</span>
        </div>

        <h3 style="font-size: 14px; margin-top: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">🛒 Ingredients</h3>
        <ul style="padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.7;">
          ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
        </ul>

        <h3 style="font-size: 14px; margin-top: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">📋 Steps</h3>
        <ol style="padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.7;">
          ${recipe.instructions
            .map(
              (s) =>
                `<li style="margin-bottom: 8px;"><strong>${s.title}:</strong> ${s.detail}${s.safetyNote ? `<span style="color:#c2410c;display:block;font-size:12px;margin-top:2px;">⚠️ ${s.safetyNote}</span>` : ""}</li>`,
            )
            .join("")}
        </ol>

        <div style="margin: 24px 0; padding: 20px; background: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; text-align: center;">
          <h3 style="color: #9a3412; margin-top: 0; font-size: 16px;">Want Full Access to the Recipe Archive?</h3>
          <p style="font-size: 13px; color: #431407;">Subscribers unlock 50+ past weekly recipes, the AI safety analyzer, and the digital pantry -- all with no limits.</p>
          <a href="${ctaUrl}" style="display: inline-block; background: #FF8107; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none;">Start Free Trial</a>
        </div>
      </div>
    </div>`;
}
