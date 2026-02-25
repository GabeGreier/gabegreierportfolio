alter table public.visuals
add column if not exists tags text[] not null default '{}';
