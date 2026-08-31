import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { generateWelcomeEmail, generateWeeklyEmail, renderRecipeEmailHtml } from "../_lib/emailTemplates.js";
import { getOrGenerateWeeklyRecipe } from "../_lib/weeklyRecipe.js";

// Combines subscribe / unsubscribe / send-welcome / generate-weekly-email /
// dispatch-weekly / sent-log into ONE Vercel function (instead of 6) so the
// whole project stays under the Hobby plan's 12-function limit. The URL for
// each -- e.g. /api/newsletter/subscribe -- is unchanged; Vercel routes
// anything under /api/newsletter/* here automatically because of the
// [...route] filename, and we dispatch on the first path segment below.
export default async function handler(req: VercelRequest, res: VercelResponse) {
// Read the route segment directly from the URL instead of relying on
  // Vercel to auto-populate req.query.route -- on some deployments that
  // value doesn't get filled in for plain (non-Next.js) catch-all routes.
  const urlPath = (req.url || '').split('?')[0];
  const segments = urlPath.split('/').filter(Boolean);
  const route = segments[segments.length - 1] || '';

  switch (route) {
    case "subscribe":
      return handleSubscribe(req, res);
    case "unsubscribe":
      return handleUnsubscribe(req, res);
    case "send-welcome":
      return handleSendWelcome(req, res);
    case "generate-weekly-email":
      return handleGenerateWeeklyEmail(req, res);
    case "dispatch-weekly":
      return handleDispatchWeekly(req, res);
    case "sent-log":
      return handleSentLog(req, res);
    default:
      return res.status(404).json({ error: "Unknown newsletter endpoint." });
  }
}

async function handleSubscribe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, optInWeeklyEmail = true } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res.status(500).json({
        error: "Newsletter storage isn't configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      });
    }

    const unsubscribeToken = randomUUID();
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, unsubscribe_token")
      .eq("email", cleanEmail)
      .maybeSingle();

    const tokenToUse = existing?.unsubscribe_token || unsubscribeToken;

    const { data: subscriber, error: upsertError } = await supabase
      .from("subscribers")
      .upsert(
        {
          email: cleanEmail,
          opt_in_weekly: optInWeeklyEmail,
          unsubscribe_token: tokenToUse,
          subscribed_at: existing ? undefined : new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      return res.status(500).json({ error: "Failed to save subscription." });
    }

    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${tokenToUse}`;

    const welcomeEmail = await generateWelcomeEmail(cleanEmail, unsubscribeUrl);
    const sendResult = await sendEmail({ to: cleanEmail, subject: welcomeEmail.subject, html: welcomeEmail.html });

    await supabase.from("sent_emails").insert({
      type: "WELCOME_EMAIL",
      recipient: cleanEmail,
      subject: welcomeEmail.subject,
      sent_successfully: sendResult.sent,
      failure_reason: sendResult.reason || null,
    });

    return res.json({
      message: sendResult.sent
        ? `Successfully subscribed ${cleanEmail}! Welcome email sent.`
        : `Subscribed ${cleanEmail}, but the welcome email could not be sent (${sendResult.reason}).`,
      subscriber,
      emailSent: sendResult.sent,
      welcomeEmail: {
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
        recipient: cleanEmail,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Error in newsletter subscription:", err);
    return res.status(500).json({ error: "Failed to process newsletter subscription." });
  }
}

async function handleUnsubscribe(req: VercelRequest, res: VercelResponse) {
  const email = String(req.query.email || "").toLowerCase().trim();
  const token = String(req.query.token || "");

  if (!email || !token) return res.status(400).send("Missing email or token.");

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).send("Unsubscribe storage isn't configured.");

  const { data, error } = await supabase
    .from("subscribers")
    .update({ opt_in_weekly: false })
    .eq("email", email)
    .eq("unsubscribe_token", token)
    .select()
    .maybeSingle();

  if (error || !data) return res.status(400).send("Invalid or expired unsubscribe link.");

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(
    `<!DOCTYPE html><html><body style="font-family: sans-serif; text-align: center; padding: 60px 20px;">
      <h2>You're unsubscribed</h2>
      <p>${email} will no longer receive JarCheck Weekly emails.</p>
    </body></html>`,
  );
}

async function handleSendWelcome(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const supabase = getSupabaseAdmin();

    let unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=preview`;
    if (supabase) {
      const { data: existing } = await supabase
        .from("subscribers")
        .select("unsubscribe_token")
        .eq("email", cleanEmail)
        .maybeSingle();
      if (existing?.unsubscribe_token) {
        unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${existing.unsubscribe_token}`;
      }
    }

    const welcomeEmail = await generateWelcomeEmail(cleanEmail, unsubscribeUrl);
    const sendResult = await sendEmail({ to: cleanEmail, subject: welcomeEmail.subject, html: welcomeEmail.html });

    if (supabase) {
      await supabase.from("sent_emails").insert({
        type: "WELCOME_EMAIL",
        recipient: cleanEmail,
        subject: welcomeEmail.subject,
        sent_successfully: sendResult.sent,
        failure_reason: sendResult.reason || null,
      });
    }

    return res.json({
      message: sendResult.sent ? `Welcome email sent to ${cleanEmail}!` : `Could not send email (${sendResult.reason}).`,
      welcomeEmail: {
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
        recipient: cleanEmail,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error in send-welcome:", err);
    return res.status(500).json({ error: "Failed to generate welcome email." });
  }
}

async function handleGenerateWeeklyEmail(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { recipeTitle, season, ctaUrl } = req.body || {};
    const email = await generateWeeklyEmail({ recipeTitle, season, ctaUrl });
    return res.json(email);
  } catch (err) {
    console.error("Error in generate-weekly-email:", err);
    return res.status(500).json({ error: "Failed to generate AI newsletter email." });
  }
}

async function handleDispatchWeekly(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Storage isn't configured." });

  const { forceRegenerate } = (req.body || {}) as { forceRegenerate?: boolean };

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("opt_in_weekly", true);

  if (error) return res.status(500).json({ error: "Failed to load subscribers." });

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

async function handleSentLog(req: VercelRequest, res: VercelResponse) {
  if (process.env.ADMIN_KEY && req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Storage isn't configured." });

  const { data, error } = await supabase
    .from("sent_emails")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: "Failed to load sent log." });

  const { count } = await supabase.from("sent_emails").select("*", { count: "exact", head: true });

  return res.json({ totalSent: count || 0, recentSent: data });
}