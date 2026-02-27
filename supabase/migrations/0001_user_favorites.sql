-- Favorites table for authenticated users (Supabase)

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  lag smallint not null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_favorites_lag_range check (lag between 1 and 5),
  constraint user_favorites_unique unique (user_id, date, lag)
);

alter table public.user_favorites enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_favorites_updated_at on public.user_favorites;
create trigger set_user_favorites_updated_at
before update on public.user_favorites
for each row
execute function public.set_updated_at();

-- RLS policies: users can only access their own rows
drop policy if exists "user_favorites_select_own" on public.user_favorites;
create policy "user_favorites_select_own"
on public.user_favorites
for select
using (auth.uid() = user_id);

drop policy if exists "user_favorites_insert_own" on public.user_favorites;
create policy "user_favorites_insert_own"
on public.user_favorites
for insert
with check (auth.uid() = user_id);

drop policy if exists "user_favorites_update_own" on public.user_favorites;
create policy "user_favorites_update_own"
on public.user_favorites
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_favorites_delete_own" on public.user_favorites;
create policy "user_favorites_delete_own"
on public.user_favorites
for delete
using (auth.uid() = user_id);

