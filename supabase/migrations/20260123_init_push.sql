-- Create push_subscriptions table
create table if not exists public.push_subscriptions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.push_subscriptions enable row level security;

-- Policies
create policy "Users can view their own subscriptions" 
on public.push_subscriptions for select 
using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions" 
on public.push_subscriptions for insert 
with check (auth.uid() = user_id);

create policy "Users can delete their own subscriptions" 
on public.push_subscriptions for delete 
using (auth.uid() = user_id);

-- Add last_notified_at to saved_searches
alter table public.saved_searches 
add column if not exists last_notified_at timestamp with time zone;
