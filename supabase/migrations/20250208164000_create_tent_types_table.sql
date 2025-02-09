create table public.tent_types (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.tent_types enable row level security;

-- Create policies
create policy "Allow anonymous read access" 
  on public.tent_types for select 
  using (true);

create policy "Allow authenticated insert access" 
  on public.tent_types for insert 
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update access" 
  on public.tent_types for update 
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete access" 
  on public.tent_types for delete 
  using (auth.role() = 'authenticated'); 