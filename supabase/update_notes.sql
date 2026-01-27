-- Add notes column to watch_history table
-- Run this in your Supabase SQL Editor

alter table public.watch_history 
add column if not exists notes jsonb default '{}'::jsonb;
