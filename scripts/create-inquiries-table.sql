-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/zgecpsubfiyzgpnlxtny/sql

create table if not exists inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  company      text,
  email        text not null,
  phone        text,
  message      text not null,
  product_slug text,
  product_name text,
  locale       text default 'en',
  created_at   timestamptz default now()
);

alter table inquiries enable row level security;

create policy "Service role full access"
  on inquiries for all
  using (true)
  with check (true);
