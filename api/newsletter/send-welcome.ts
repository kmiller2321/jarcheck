import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { generateWelcomeEmail } from "../_lib/emailTemplates.js";

/**
 * Used by the "Preview Welcome Email Sample" / "Re-Send Welcome Email"
 * buttons in WeeklyRecipeArchive.tsx. Actually sends via Resend so what
 * the user previews matches what really lands in an inbox.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const supabase = getSupabaseAdmin();

    // Reuse the subscriber's existing unsubscribe token if they're already
    // in the list, otherwise this is just a preview send with a dummy link.
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
