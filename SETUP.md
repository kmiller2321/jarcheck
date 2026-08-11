# JarCheck — Email, Database & Stripe Setup

This app now runs as Vercel serverless functions (in `/api`) instead of a
standalone Express server, so it deploys cleanly on Vercel. Follow these
steps in order before your first deploy.

## 1. Supabase (subscriber database)

1. Create a free project at https://supabase.com.
2. Go to **SQL Editor → New query**, paste the contents of
   `supabase-schema.sql` (in this repo root), and run it. This creates the
   `subscribers`, `sent_emails`, `weekly_recipes`, and `pantry_items` tables.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL` (server) **and** `VITE_SUPABASE_URL` (frontend) -- same value, two variables
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ this key bypasses Row Level Security — only ever put it in server
     env vars, never in frontend code or `VITE_`-prefixed vars)
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY` (this one is safe to expose to the browser -- it's what subscriber login uses)

## 1b. Supabase Auth (subscriber login)

Subscribers log in with a passwordless "magic link" emailed to them --
no separate password to manage.

1. In your Supabase project, go to **Authentication → Providers** and
   confirm **Email** is enabled (it is by default).
2. Go to **Authentication → URL Configuration** and set:
   - **Site URL**: your production URL (e.g. `https://jarcheck.vercel.app`)
   - **Redirect URLs**: add both `http://localhost:3000` (or whatever
     `vercel dev` prints locally) and your production URL, so the login
     link works in both places.
3. That's it -- no extra keys beyond the `VITE_SUPABASE_*` ones above.

## 2. Resend (sending emails)

1. Create a free account at https://resend.com (100 emails/day free).
2. **Domains → Add Domain**, add your real domain (e.g. `jarcheck.com`) and
   add the DNS records it gives you at your domain registrar. Sending from
   an unverified domain either fails or lands in spam, so don't skip this.
   If you don't have a domain yet, Resend also gives you a temporary
   `onboarding@resend.dev` sender for testing.
3. **API Keys → Create API Key** → copy it into `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to an address on your verified domain, e.g.
   `"JarCheck <hello@yourdomain.com>"`.

## 3. Stripe (subscription billing)

1. Create an account at https://dashboard.stripe.com/register.
2. Stay in **Test mode** (toggle top-right) while building.
3. **Product catalog → Add product**:
   - Name: `JarCheck Pass`
   - Pricing: Recurring, `$9.99`, `Monthly`
   - Save, then copy the **Price ID** (starts `price_...`) → `STRIPE_PRICE_ID`
4. **Developers → API keys** → copy the **Secret key** → `STRIPE_SECRET_KEY`
5. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://YOUR_VERCEL_DOMAIN/api/stripe/webhook`
   - Events to send: `checkout.session.completed`,
     `customer.subscription.created`, `customer.subscription.updated`,
     `customer.subscription.deleted`
   - After creating it, copy the **Signing secret** (`whsec_...`) →
     `STRIPE_WEBHOOK_SECRET`
6. When you're ready for real payments, flip to **Live mode** and repeat
   steps 3–5 to get live keys (test and live keys/prices are separate).

The trial flow (`TrialModal.tsx`) creates a Stripe Checkout session in
subscription mode with a 15-day trial — a card is collected up front and
the first charge happens automatically on day 15 unless the customer
cancels via the "Manage Subscription" link in the footer.

## 4. Deploying

1. Push this project to GitHub.
2. Import the repo in Vercel (https://vercel.com/new). Vite is
   auto-detected; the `/api` folder becomes serverless functions
   automatically — no extra config needed beyond env vars.
3. In **Vercel → Project → Settings → Environment Variables**, add every
   variable from `.env.example` with your real values, including
   `APP_URL` set to your final Vercel URL (e.g. `https://jarcheck.vercel.app`,
   or your custom domain once attached).
4. Redeploy after adding env vars (Vercel doesn't hot-reload them into a
   running deployment).
5. Go back to Stripe's webhook settings and double check the endpoint URL
   matches your live `APP_URL` + `/api/stripe/webhook`.

## 5. Local development

```bash
npm install -g vercel   # if you don't have it
vercel link             # links this folder to your Vercel project
vercel env pull .env    # pulls the env vars you set in the dashboard
npm run dev             # runs `vercel dev`, which serves Vite + /api together
```

`vercel dev` is used instead of the old `tsx server.ts` so local
development matches production serverless behavior exactly, including how
`/api` routes behave.

## Testing the weekly cron without waiting for Monday

```bash
curl -X POST https://YOUR_VERCEL_DOMAIN/api/newsletter/dispatch-weekly \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"forceRegenerate": false}'
```

This sends the same recipe currently shown in the site's "Recipe of the
Week" section. Pass `"forceRegenerate": true` to have Gemini generate a
brand new recipe for the current week on the spot (useful for testing;
normally it only generates once per week and reuses that).

## Known gaps worth knowing about

- **Subscriber login is magic-link only.** There's no password reset flow
  to worry about since there are no passwords, but if a subscriber's inbox
  is unreachable they can't get in another way yet.
- **Privacy Policy / Terms of Service** in the footer are just plain text
  right now, not real pages. Stripe (and most payment processors) expects
  a real privacy policy and terms of service to be reachable from your
  site before you go live with real charges.
- **CAN-SPAM/GDPR**: the welcome and weekly emails include an unsubscribe
  link that works, which covers the basics, but you're responsible for
  your own compliance obligations based on where your subscribers are.
