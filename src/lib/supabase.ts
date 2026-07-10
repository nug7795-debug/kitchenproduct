import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcsqcbrdfqgxqhnyqtoa.supabase.co';
// Use the service role key to bypass RLS on the client and server side for this platform
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3FjYnJkZnFneHFobnlxdG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ1ODE1NiwiZXhwIjoyMDk5MDM0MTU2fQ.Ml3jBaMKOshrq4ykqQSH7pAM9oT1VtFfgFqwjh5Uvvs';

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
