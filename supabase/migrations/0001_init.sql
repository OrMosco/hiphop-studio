-- 0001_init.sql — Hip-Hop Studio schema, RLS, triggers, admin RPCs

-- ─── Tables ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  avatar_url  text,
  phone       text,
  credits     integer not null default 0 check (credits >= 0),
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.sessions (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  location    text not null default 'קיבוץ אפק',
  capacity    integer,
  notes       text,
  created_at  timestamptz not null default now()
);
create index sessions_starts_at_idx on public.sessions (starts_at);

create table public.registrations (
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table public.attendance (
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  marked_by   uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table public.credit_transactions (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  delta       integer not null,
  reason      text not null,            -- 'purchase' | 'attendance' | 'attendance_undo' | 'adjustment'
  session_id  uuid references public.sessions(id) on delete set null,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);
create index credit_tx_user_idx on public.credit_transactions (user_id, created_at desc);

-- ─── Helpers ─────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ─── Profile on signup ───────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.sessions            enable row level security;
alter table public.registrations       enable row level security;
alter table public.attendance          enable row level security;
alter table public.credit_transactions enable row level security;

-- profiles: own row or admin. Students may only edit name/phone (column grants below).
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
revoke update on public.profiles from anon, authenticated;
grant  update (full_name, phone) on public.profiles to authenticated;

-- sessions: public schedule; admins manage.
create policy sessions_select on public.sessions for select using (true);
create policy sessions_admin_write on public.sessions for all
  using (public.is_admin()) with check (public.is_admin());

-- registrations: students manage their own for future sessions; admins all.
create policy reg_select on public.registrations for select
  using (user_id = auth.uid() or public.is_admin());
create policy reg_insert on public.registrations for insert
  with check (
    public.is_admin() or (
      user_id = auth.uid()
      and exists (select 1 from public.sessions s where s.id = session_id and s.starts_at > now())
    )
  );
create policy reg_delete on public.registrations for delete
  using (
    public.is_admin() or (
      user_id = auth.uid()
      and exists (select 1 from public.sessions s where s.id = session_id and s.starts_at > now())
    )
  );

-- attendance / credit_transactions: read own or admin; writes only via RPCs below.
create policy att_select on public.attendance for select
  using (user_id = auth.uid() or public.is_admin());
create policy ctx_select on public.credit_transactions for select
  using (user_id = auth.uid() or public.is_admin());

-- ─── Public roster (first names only) for the avatar stacks ─────────────────
create or replace function public.session_roster(p_from timestamptz default now() - interval '1 day')
returns table (session_id uuid, user_id uuid, full_name text, avatar_url text)
language sql stable security definer set search_path = public as $$
  select r.session_id, r.user_id, split_part(coalesce(p.full_name, ''), ' ', 1), p.avatar_url
  from public.registrations r
  join public.sessions s on s.id = r.session_id
  join public.profiles p on p.id = r.user_id
  where s.starts_at >= p_from
  order by r.created_at;
$$;
grant execute on function public.session_roster(timestamptz) to anon, authenticated;

-- ─── Admin RPCs ──────────────────────────────────────────────────────────────
create or replace function public.admin_adjust_credits(p_user uuid, p_delta integer, p_reason text default 'adjustment')
returns integer language plpgsql security definer set search_path = public as $$
declare v_new integer;
begin
  if not public.is_admin() then raise exception 'not authorized' using errcode = '42501'; end if;
  update public.profiles set credits = greatest(0, credits + p_delta)
    where id = p_user returning credits into v_new;
  if not found then raise exception 'student not found'; end if;
  insert into public.credit_transactions (user_id, delta, reason, created_by)
    values (p_user, p_delta, coalesce(p_reason, 'adjustment'), auth.uid());
  return v_new;
end $$;

-- Mark (p_present = true) or unmark attendance. Marking deducts one credit, unmarking refunds it.
create or replace function public.admin_set_attendance(p_session uuid, p_user uuid, p_present boolean)
returns integer language plpgsql security definer set search_path = public as $$
declare v_new integer; v_rows integer;
begin
  if not public.is_admin() then raise exception 'not authorized' using errcode = '42501'; end if;

  if p_present then
    insert into public.attendance (session_id, user_id, marked_by)
      values (p_session, p_user, auth.uid()) on conflict do nothing;
    get diagnostics v_rows = row_count;
    if v_rows > 0 then
      update public.profiles set credits = greatest(0, credits - 1) where id = p_user;
      insert into public.credit_transactions (user_id, delta, reason, session_id, created_by)
        values (p_user, -1, 'attendance', p_session, auth.uid());
    end if;
  else
    delete from public.attendance where session_id = p_session and user_id = p_user;
    get diagnostics v_rows = row_count;
    if v_rows > 0 then
      update public.profiles set credits = credits + 1 where id = p_user;
      insert into public.credit_transactions (user_id, delta, reason, session_id, created_by)
        values (p_user, 1, 'attendance_undo', p_session, auth.uid());
    end if;
  end if;

  select credits into v_new from public.profiles where id = p_user;
  return v_new;
end $$;

revoke execute on function public.admin_adjust_credits(uuid, integer, text)  from public, anon;
revoke execute on function public.admin_set_attendance(uuid, uuid, boolean)   from public, anon;
grant  execute on function public.admin_adjust_credits(uuid, integer, text)  to authenticated;
grant  execute on function public.admin_set_attendance(uuid, uuid, boolean)   to authenticated;
