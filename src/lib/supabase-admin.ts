import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scjbackzybmoapkupfbi.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Admin features will not work.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || '');

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (bucket: string, path: string, fileBuffer: Buffer | ArrayBuffer, contentType: string) => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) throw error;

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
};
