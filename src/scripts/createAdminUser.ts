import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hdrfxmpssteinlribsob.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcmZ4bXBzc3RlaW5scmlic29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMTE3NDksImV4cCI6MjA1NDU4Nzc0OX0.ehi7xWmW56MJOK1P9wCW3v7kyVbnhAYeUosexlgd5kU'
);

async function createAdminUser() {
  const email = 'admin@cheshiretent.com';
  const password = 'Admin123!@#'; // You should change this password after first login

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return;
    }

    console.log('Admin user created successfully:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

createAdminUser(); 