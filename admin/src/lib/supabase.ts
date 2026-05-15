import { createClient } from '@supabase/supabase-js';

// Aggressively strip any non-printable or non-ASCII characters that might have 
// snuck into the environment variables during deployment.
const sanitize = (str: string) => str.replace(/[^\x20-\x7E]/g, '').trim();

const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const supabaseAnonKey = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing or invalid.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
