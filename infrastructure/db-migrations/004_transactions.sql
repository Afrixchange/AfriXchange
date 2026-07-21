-- Migration: 004_transactions
-- Description: Creates transactions table for all money movement

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  status text default 'pending',
  currency_from text,
  currency_to text,
  amount_from numeric(18,2),
  amount_to numeric(18,2),
  rate numeric(18,6),
  provider text,
  provider_ref text,
  held_reason text,
  created_at timestamptz default now()
);

-- RLS
alter table transactions enable row level security;

create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

-- Indexes
create index idx_transactions_user_id on transactions(user_id);
create index idx_transactions_status on transactions(status);
create index idx_transactions_created_at on transactions(created_at desc);

