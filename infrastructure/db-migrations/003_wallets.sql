-- Migration: 003_wallets
-- Description: Creates wallets table for currency balances

create table if not exists wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  currency text not null,
  balance numeric(18,2) default 0,
  updated_at timestamptz default now(),
  unique(user_id, currency)
);

-- RLS
alter table wallets enable row level security;

create policy "Users can view own wallets"
  on wallets for select
  using (auth.uid() = user_id);

-- Indexes
create index idx_wallets_user_id on wallets(user_id);

