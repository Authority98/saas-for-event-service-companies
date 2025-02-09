create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  size text,
  type text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policies
create policy "Allow anonymous read access" 
  on public.products for select 
  using (true);

create policy "Allow authenticated insert access" 
  on public.products for insert 
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update access" 
  on public.products for update 
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete access" 
  on public.products for delete 
  using (auth.role() = 'authenticated'); 