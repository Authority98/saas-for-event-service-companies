-- Add missing columns to tent_types table to match frontend expectations
ALTER TABLE public.tent_types 
ADD COLUMN capacity integer DEFAULT 0,
ADD COLUMN features text[] DEFAULT '{}',
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update existing records to have default values
UPDATE public.tent_types 
SET 
  capacity = 50,  -- Default capacity
  features = '{}',  -- Empty array
  status = 'active'  -- Default status
WHERE capacity IS NULL OR features IS NULL OR status IS NULL;

-- Make capacity and status NOT NULL after setting defaults
ALTER TABLE public.tent_types 
ALTER COLUMN capacity SET NOT NULL,
ALTER COLUMN status SET NOT NULL;
