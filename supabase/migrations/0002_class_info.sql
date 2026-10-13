-- Single-row table with editable class details (song name, dance style).
create table if not exists public.class_info (
  id          boolean primary key default true check (id),  -- enforces a single row
  song_name   text,
  dance_style text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);

insert into public.class_info (id) values (true) on conflict (id) do nothing;

alter table public.class_info enable row level security;

drop policy if exists "class_info read"   on public.class_info;
drop policy if exists "class_info update" on public.class_info;
create policy "class_info read"   on public.class_info for select using (true);
create policy "class_info update" on public.class_info for update
  using (public.is_admin()) with check (public.is_admin());

grant select on public.class_info to anon, authenticated;
grant update (song_name, dance_style, updated_at, updated_by) on public.class_info to authenticated;
