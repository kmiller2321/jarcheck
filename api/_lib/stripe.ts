import Stripe from "stripe";

let cachedClient: Stripe | null | undefined;

export function getStripeClient(): Stripe | null {
  if (cachedClient !== undefined) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    cachedClient = null;
    return null;
  }

  // No apiVersion pinned here on purpose -- the installed `stripe` package's
  // type definitions require an exact literal string matching that SDK
  // version. Omitting it lets the SDK use its built-in default, which
  // avoids a TypeScript build break if the package is ever upgraded.
  cachedClient = new Stripe(secretKey);
  return cachedClient;
}
