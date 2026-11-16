-- CodeElder database schema. Run in the Supabase SQL editor (or `supabase db push`).
-- All tables have Row Level Security. Users can only touch their own rows.
-- subscriptions / payment_events are written ONLY by the service role (webhook / admin).

create extension if not exists "pgcrypto";

-- ───────── profiles ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────── subscriptions (service-role writes only) ─────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null check (plan in ('solo','pro','max')),
  status text not null default 'active' check (status in ('active','past_due','canceled')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'selar',
  external_id text unique,
  email text,
  amount numeric,
  currency text,
  payload jsonb,
  applied boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────── playbooks (reusable instructions) ─────────
create table if not exists public.playbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  instructions text not null check (char_length(instructions) between 1 and 4000),
  created_at timestamptz not null default now()
);

-- ───────── assistant ─────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on public.messages(conversation_id, created_at);

-- ───────── reviews & tasks ─────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  language text not null default 'auto',
  code text not null,
  result jsonb not null,
  score int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  code text,
  result jsonb not null,
  status text not null default 'ready' check (status in ('ready','applied','dismissed')),
  created_at timestamptz not null default now()
);

-- ───────── usage ─────────
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('chat','review','task')),
  credits int not null check (credits > 0),
  created_at timestamptz not null default now()
);
create index if not exists usage_user_idx on public.usage_events(user_id, created_at);

-- ───────── RLS ─────────
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;
alter table public.playbooks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.tasks enable row level security;
alter table public.usage_events enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Users may READ their subscription; no insert/update/delete policy => only service role can write.
create policy "subs_select_own" on public.subscriptions for select using (auth.uid() = user_id);
-- payment_events: no policies => inaccessible to clients.

create policy "playbooks_all_own" on public.playbooks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "conv_all_own" on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "msg_select_own" on public.messages for select using (auth.uid() = user_id);
create policy "msg_insert_own" on public.messages for insert with check (
  auth.uid() = user_id and exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);
create policy "reviews_all_own" on public.reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_all_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usage_select_own" on public.usage_events for select using (auth.uid() = user_id);
-- usage_events inserts happen server-side with the service role so users cannot forge or erase usage.
