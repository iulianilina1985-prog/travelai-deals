-- Add memory column to chat_conversations
alter table public.chat_conversations 
add column if not exists memory jsonb default '{}'::jsonb;
