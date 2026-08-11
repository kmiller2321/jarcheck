import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { generateWelcomeEmail } from "../_lib/emailTemplates.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    // Upsert subscriber
    const unsubscribeToken = randomUUID();
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, unsubscribe_token")
      .eq("email", cleanEmail)
      .maybeSingle();

    let tokenToUse = existing?.unsubscribe_token || unsubscribeToken;

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

    // Build + send welcome email (best-effort; don't fail the signup if email sending fails)
    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${tokenToUse}`;

    const welcomeEmail = await generateWelcomeEmail(cleanEmail, unsubscribeUrl);
    const sendResult = await sendEmail({
      to: cleanEmail,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });

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
      // Kept for the frontend's email preview modal (WeeklyRecipeArchive.tsx)
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
