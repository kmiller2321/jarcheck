import type { VercelRequest, VercelResponse } from "@vercel/node";
import type Stripe from "stripe";
import { getStripeClient } from "../_lib/stripe.js";
import { getSupabaseAdmin } from "../_lib/supabase.js";

// Stripe requires the raw, unparsed request body to verify the webhook
// signature, so we turn off Vercel's automatic JSON body parsing here.
export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripeClient();
  const supabase = getSupabaseAdmin();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(500).json({ error: "Stripe webhook isn't configured." });
  }

  const signature = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature as string, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook signature verification failed.` });
  }

  if (!supabase) {
    console.warn("Supabase not configured -- webhook received but subscription status not persisted.");
    return res.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.email || session.customer_details?.email;
        if (email && session.customer) {
          await supabase
            .from("subscribers")
            .update({
              stripe_customer_id: session.customer as string,
              subscription_status: "trialing",
            })
            .eq("email", email.toLowerCase().trim());
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscribers")
          .update({ subscription_status: subscription.status })
          .eq("stripe_customer_id", subscription.customer as string);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscribers")
          .update({ subscription_status: "canceled" })
          .eq("stripe_customer_id", subscription.customer as string);
        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Error handling Stripe webhook event:", err);
    return res.status(500).json({ error: "Webhook handler error." });
  }
}
