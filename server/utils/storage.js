const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The bucket name (e.g., 'products', 'banners')
 * @param {string} path - The destination path within the bucket
 * @param {Buffer} fileBuffer - The file content
 * @param {string} contentType - The MIME type of the file
 */
const uploadFile = async (bucket, path, fileBuffer, contentType) => {
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

module.exports = {
  supabaseAdmin,
  uploadFile
};
