import { supabase } from './supabase';

export async function getUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function adminOnly(request: Request) {
  const user = await getUser(request);
  if (!user) return null;
  // Basic check for now, can be expanded to check roles
  return user;
}
