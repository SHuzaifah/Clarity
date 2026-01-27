-- Watch History Schema (Improved for UPSERT)

drop table if exists public.watch_history;

create table public.watch_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  video_id text not null,
  title text,
  thumbnail_url text,
  watched_at timestamptz default now(),
  completed boolean default false,
  
  -- Progress tracking
  last_position float default 0, -- seconds
  total_duration float default 0, -- seconds
  
  -- Ensure one row per video per user
  constraint unique_user_video unique(user_id, video_id)
);

-- RLS
alter table public.watch_history enable row level security;

create policy "Users can view their own history"
  on public.watch_history for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own history"
  on public.watch_history for all
  using (auth.uid() = user_id);

create index idx_history_user_date on public.watch_history(user_id, watched_at desc);
