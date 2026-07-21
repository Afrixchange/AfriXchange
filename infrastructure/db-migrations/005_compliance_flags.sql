-- Migration: 005_compliance_flags
-- Description: Creates compliance_flags table for audit trail

create table if not exists compliance_flags (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id),
  reason text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table compliance_flags enable row level security;

create policy "Users can view own compliance flags"
  on compliance_flags for select
  using (
    auth.uid() = (select user_id from transactions where id = transaction_id)
  );

-- Indexes
create index idx_compliance_flags_transaction_id on compliance_flags(transaction_id);
create index idx_compliance_flags_resolved on compliance_flags(resolved);

