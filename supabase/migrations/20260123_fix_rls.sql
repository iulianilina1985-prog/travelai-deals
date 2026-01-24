-- Add UPDATE policy for push_subscriptions (Required for upsert)
create policy "Users can update their own subscriptions" 
on public.push_subscriptions for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
