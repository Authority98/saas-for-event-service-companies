-- Add image_url column to tent_types table
alter table public.tent_types
add column if not exists image_url text; 