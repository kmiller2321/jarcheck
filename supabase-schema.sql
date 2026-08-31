-- Run this once in your Supabase project's SQL Editor
-- (Project -> SQL Editor -> New query -> paste -> Run)

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  opt_in_weekly boolean not null default true,
  unsubscribe_token uuid not null default gen_random_uuid(),
  stripe_customer_id text,
  subscription_status text, -- e.g. trialing, active, past_due, canceled
  subscribed_at timestamptz not null default now()
);

create table if not exists sent_emails (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- WELCOME_EMAIL | WEEKLY_DISPATCH
  recipient text not null,
  subject text not null,
  sent_successfully boolean not null default true,
  failure_reason text,
  sent_at timestamptz not null default now()
);

create index if not exists idx_subscribers_email on subscribers (email);
create index if not exists idx_subscribers_stripe_customer on subscribers (stripe_customer_id);
create index if not exists idx_sent_emails_sent_at on sent_emails (sent_at desc);

-- These tables are only ever written to via the Supabase service-role key
-- from your serverless functions, never from the browser, so Row Level
-- Security can stay on with no public policies (the default, safest state).
alter table subscribers enable row level security;
alter table sent_emails enable row level security;

-- Added for: AI-generated weekly recipe caching (site + email use the same
-- generated recipe, one per ISO week) and each subscriber's online pantry.
create table if not exists weekly_recipes (
  id uuid primary key default gen_random_uuid(),
  week_key text not null unique, -- e.g. '2026-W32'
  title text not null,
  subtitle text,
  description text,
  prep_time text,
  processing_time text,
  yield_jars text,
  method text,
  headspace text,
  ingredients jsonb not null default '[]',
  instructions jsonb not null default '[]',
  safety_checklist jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists pantry_items (
  subscriber_email text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (subscriber_email, id)
);

create index if not exists idx_weekly_recipes_week_key on weekly_recipes (week_key);
create index if not exists idx_pantry_items_email on pantry_items (subscriber_email);

alter table weekly_recipes enable row level security;
alter table pantry_items enable row level security;
