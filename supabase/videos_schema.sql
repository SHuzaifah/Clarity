-- Create Table (safe to run repeatedly)
create table if not exists videos (
  id text primary key, -- YouTube Video ID
  channel_id text not null,
  channel_title text, 
  channel_thumbnail_url text,
  title text not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Ensure columns exist (migration for older runs)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'videos' and column_name = 'channel_title') then
        alter table videos add column channel_title text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'videos' and column_name = 'channel_thumbnail_url') then
        alter table videos add column channel_thumbnail_url text;
    end if;
end $$;

-- Indexes
create index if not exists videos_channel_id_idx on videos (channel_id);
create index if not exists videos_published_at_idx on videos (published_at desc);

-- RLS
alter table videos enable row level security;

-- Policies (Drop first to allow re-run)
drop policy if exists "Allow public read access" on videos;
create policy "Allow public read access" on videos for select using (true);

drop policy if exists "Allow insert/update for authorized roles" on videos;
create policy "Allow insert/update for authorized roles" on videos for all using (true) with check (true);
