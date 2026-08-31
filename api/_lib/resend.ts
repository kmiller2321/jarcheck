import { Resend } from "resend";

let cachedClient: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = new Resend(apiKey);
  return cachedClient;
}

/**
 * Sends an email via Resend. Returns { sent: true } on success,
 * or { sent: false, reason } if Resend isn't configured or the send fails.
 * Callers should NOT throw on a failed send -- log it and continue,
 * so a broken email provider never breaks the newsletter signup flow.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string; id?: string }> {
  const client = getResendClient();
  const from = process.env.EMAIL_FROM;

  if (!client) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }
  if (!from) {
    return { sent: false, reason: "EMAIL_FROM not configured" };
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return { sent: false, reason: error.message };
    }

    return { sent: true, id: data?.id };
  } catch (err: any) {
    console.error("Resend send exception:", err);
    return { sent: false, reason: err?.message || "Unknown error" };
  }
}
