import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    const bucket = (formData.get('bucket') as string) || 'kitchenproduct';
    const folder = formData.get('folder') as string || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Generate filename if not provided
    const targetFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const targetPath = folder ? `${folder}/${targetFilename}` : targetFilename;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(targetPath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase admin storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(targetPath);

    return NextResponse.json({
      success: true,
      publicUrl
    });
  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
