import { createClient } from '@supabase/supabase-js';

// Aggressively strip any non-printable or non-ASCII characters that might have 
// snuck into the environment variables during deployment.
const sanitize = (str: string) => str.replace(/[^\x20-\x7E]/g, '').trim();

const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scjbackzybmoapkupfbi.supabase.co');
const supabaseAnonKey = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjamJhY2t6eWJtb2Fwa3VwZmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzM0MjUsImV4cCI6MjA5NDI0OTQyNX0.3rcgjJT4xpPijAW4sL6PQ--lshVlluQhAAU417zj5xw');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn('Supabase credentials missing or invalid.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
