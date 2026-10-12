-- WOO-17: habits & checks, 본인 데이터만 접근(RLS)
create table public.habits (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  name text not null check (char_length(name) between 1 and 100),
  emoji text not null default '',
  repeat text not null check (repeat in ('daily','weekdays','weekends','custom')),
  days smallint[] not null default '{}',
  reminder text,
  created_at date not null,
  inserted_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table public.checks (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  habit_id text not null,
  day date not null,
  primary key (user_id, habit_id, day),
  foreign key (user_id, habit_id) references public.habits(user_id, id) on delete cascade
);

alter table public.habits enable row level security;
alter table public.checks enable row level security;

create policy "habits_own" on public.habits for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "checks_own" on public.checks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
