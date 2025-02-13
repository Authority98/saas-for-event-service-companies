-- Create an enum type for product status
create type product_status as enum ('available', 'booked', 'maintenance');

-- Add status column to products table with default value
alter table public.products 
add column status product_status not null default 'available';

-- Update RLS policies to include the new column
drop policy if exists "Allow anonymous read access" on public.products;
drop policy if exists "Allow authenticated insert access" on public.products;
drop policy if exists "Allow authenticated update access" on public.products;
drop policy if exists "Allow authenticated delete access" on public.products;

-- Recreate policies with status column
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