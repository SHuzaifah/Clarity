-- Collections Table
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- Collection Items Table
create table if not exists collection_items (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references collections(id) on delete cascade not null,
  video_id text not null,
  added_at timestamptz default now(),
  unique(collection_id, video_id)
);

-- RLS
alter table collections enable row level security;
alter table collection_items enable row level security;

-- Policies for Collections
drop policy if exists "Users can view their own collections" on collections;
create policy "Users can view their own collections" on collections for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own collections" on collections;
create policy "Users can insert their own collections" on collections for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own collections" on collections;
create policy "Users can update their own collections" on collections for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own collections" on collections;
create policy "Users can delete their own collections" on collections for delete using (auth.uid() = user_id);

-- Policies for Items
drop policy if exists "Users can view items in their collections" on collection_items;
create policy "Users can view items in their collections" on collection_items for select using (
    exists (select 1 from collections where id = collection_items.collection_id and user_id = auth.uid())
);

drop policy if exists "Users can add items to their collections" on collection_items;
create policy "Users can add items to their collections" on collection_items for insert with check (
    exists (select 1 from collections where id = collection_items.collection_id and user_id = auth.uid())
);

drop policy if exists "Users can remove items from their collections" on collection_items;
create policy "Users can remove items from their collections" on collection_items for delete using (
    exists (select 1 from collections where id = collection_items.collection_id and user_id = auth.uid())
);
