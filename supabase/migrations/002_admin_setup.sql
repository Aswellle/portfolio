-- Run in Supabase SQL Editor
-- Extends contacts table for admin management

-- Add admin management columns
alter table public.contacts
  add column if not exists read_at   timestamptz,
  add column if not exists is_starred boolean not null default false;

-- Allow authenticated (admin) to update contacts (mark read, star)
create policy "authenticated_can_update_contacts"
  on public.contacts for update
  to authenticated
  using (true)
  with check (true);

-- Allow authenticated (admin) to delete contacts
create policy "authenticated_can_delete_contacts"
  on public.contacts for delete
  to authenticated
  using (true);

-- Enable Realtime so admin sees new messages instantly
-- Note: use the Supabase Dashboard > Database > Replication
-- to add contacts table to supabase_realtime publication,
-- OR run the line below (requires superuser):
-- alter publication supabase_realtime add table public.contacts;

-- Verify setup
select column_name, data_type
from information_schema.columns
where table_name = 'contacts' and table_schema = 'public'
order by ordinal_position;
