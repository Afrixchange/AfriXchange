-- Migration: 001_profiles
-- Description: Creates the profiles table extending auth.users

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  phone text,
  avatar_url text,
  kyc_status text default 'not_started',
  kyc_tier int default 0,
  transaction_pin_hash text,
  created_at timestamptz default now()
);

-- Add username and avatar_url columns if upgrading existing DB
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='username') then
    alter table profiles add column username text unique;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='avatar_url') then
    alter table profiles add column avatar_url text;
  end if;
end $$;

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

