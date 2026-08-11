<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/78837aae-aee6-4f92-a859-57ad8d8c917e

## Run Locally

**Prerequisites:** Node.js, a [Vercel](https://vercel.com) account (free), Supabase, Resend, and Stripe accounts.

See **[SETUP.md](./SETUP.md)** for the full one-time setup of the database,
email sending, and Stripe billing — do that first.

1. Install dependencies:
   `npm install`
2. Link the project and pull your env vars:
   `vercel link && vercel env pull .env`
3. Run the app (serves the frontend and `/api` functions together):
   `npm run dev`

## Deploying

Push to GitHub, import the repo in Vercel, add the environment variables
from `.env.example` in the Vercel dashboard, and deploy. Full details in
[SETUP.md](./SETUP.md).
