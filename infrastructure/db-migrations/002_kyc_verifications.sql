-- Migration: 002_kyc_verifications
-- Description: Creates KYC verifications table and storage buckets

-- KYC submissions
create table if not exists kyc_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nin text,
  bvn text,
  selfie_url text,
  id_document_url text,
  status text default 'pending',
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table kyc_verifications enable row level security;

create policy "Users can view own verifications"
  on kyc_verifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own verification"
  on kyc_verifications for insert
  with check (auth.uid() = user_id);

-- Indexes
create index idx_kyc_verifications_user_id on kyc_verifications(user_id);
create index idx_kyc_verifications_status on kyc_verifications(status);

