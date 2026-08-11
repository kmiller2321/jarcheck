import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { renderRecipeEmailHtml } from "../_lib/emailTemplates.js";
import { getOrGenerateWeeklyRecipe } from "../_lib/weeklyRecipe.js";

/**
 * Triggered by Vercel Cron (see vercel.json) every Monday, or can be
 * called manually with the CRON_SECRET bearer token for testing.
 * Sends the CURRENT week's AI-generated recipe (same one shown on the
 * site's "Recipe of the Week" section -- generated once, reused for both)
 * to every opted-in subscriber.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: "Storage isn't configured." });
  }

  const { forceRegenerate } = (req.body || {}) as { forceRegenerate?: boolean };

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("opt_in_weekly", true);

  if (error) {
    return res.status(500).json({ error: "Failed to load subscribers." });
  }

  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const recipe = await getOrGenerateWeeklyRecipe(!!forceRegenerate);
  const subject = `🌿 JarCheck Weekly Recipe: ${recipe.title}`;
  const baseHtml = renderRecipeEmailHtml(recipe, appUrl);

  let sentCount = 0;
  let failedCount = 0;

  for (const sub of subscribers || []) {
    const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${sub.unsubscribe_token}`;
    const html = `${baseHtml}<p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px;"><a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a></p>`;

    const result = await sendEmail({ to: sub.email, subject, html });
    if (result.sent) sentCount++;
    else failedCount++;

    await supabase.from("sent_emails").insert({
      type: "WEEKLY_DISPATCH",
      recipient: sub.email,
      subject,
      sent_successfully: result.sent,
      failure_reason: result.reason || null,
    });
  }

  return res.json({
    status: "SUCCESS",
    weekKey: recipe.weekKey,
    recipeTitle: recipe.title,
    totalSubscribers: subscribers?.length || 0,
    sentCount,
    failedCount,
  });
}
