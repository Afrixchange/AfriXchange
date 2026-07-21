-- Migration: 006_audit_logs
-- Description: Creates append-only audit_logs table for immutable admin action tracking

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- RLS: Only service_role can insert/select (no public access)
alter table audit_logs enable row level security;

-- No RLS policies for public — only accessible via service_role

-- Indexes
create index idx_audit_logs_action on audit_logs(action);
create index idx_audit_logs_actor_id on audit_logs(actor_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);

-- Trigger function to ensure no updates or deletes
create or replace function prevent_audit_logs_modification()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is append-only: no update or delete allowed';
end;
$$;

create or replace trigger trg_prevent_audit_update
  before update on audit_logs
  for each row
  execute function prevent_audit_logs_modification();

create or replace trigger trg_prevent_audit_delete
  before delete on audit_logs
  for each row
  execute function prevent_audit_logs_modification();

