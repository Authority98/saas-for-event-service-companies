import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xkjjydzskuoiklpqzqtp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhramp5ZHpza3VvaWtscHF6cXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMTg3OTgsImV4cCI6MjA3Mjc5NDc5OH0.FLw03fi3Hf8ibEsN_WKvJp4eEG_LzsWAsMzjSEJYdxg'
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