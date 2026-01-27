-- Clarity Notes Schema

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Notes Table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Context
  node_id text not null,        -- which map node does this belong to?
  video_id text,                -- optional: specific video
  timestamp_seconds int,        -- optional: anchored to a video moment
  
  -- Content
  content text default '',
  
  -- Layer Type
  type text check (type in ('jot', 'concept', 'summary')) default 'jot',
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.notes enable row level security;

create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_notes_user_node on public.notes(user_id, node_id);
