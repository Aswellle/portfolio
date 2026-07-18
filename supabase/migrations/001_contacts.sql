-- Run this in your Supabase SQL Editor
-- Creates the contacts table for the portfolio contact form

create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  message    text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- Index for time-based admin queries
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- Enable Row Level Security (required for Data API exposure)
alter table public.contacts enable row level security;

-- Explicitly grant table access to anon/authenticated roles so the Data API
-- can reach it (Supabase does not auto-expose new tables in all project configs)
grant usage on schema public to anon, authenticated;
grant insert on public.contacts to anon;
grant select on public.contacts to authenticated;

-- Allow anonymous inserts (contact form submissions)
-- Uses TO clause — auth.role() is deprecated per Supabase skill guidelines
create policy "anon_can_insert_contacts"
  on public.contacts for insert
  to anon
  with check (true);

-- Only authenticated users (you) can read contacts
create policy "authenticated_can_read_contacts"
  on public.contacts for select
  to authenticated
  using (true);
