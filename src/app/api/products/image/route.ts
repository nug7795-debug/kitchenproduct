import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');

  if (!file) {
    return new NextResponse('File parameter is required', { status: 400 });
  }

  // 1. Construct the public Supabase URL for this file in the 'products' bucket
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcsqcbrdfqgxqhnyqtoa.supabase.co';
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${file}`;

  try {
    // 2. Perform a HEAD request to check if the file actually exists in the new Supabase bucket
    const res = await fetch(publicUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    
    if (res.ok) {
      // File exists! Redirect directly to the Supabase URL
      return NextResponse.redirect(publicUrl);
    }
  } catch (err) {
    console.error('Error checking file in Supabase storage:', err);
  }

  // 3. If file does not exist, redirect to a high-quality, deterministic Unsplash placeholder
  const fallbacks = [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', // Kitchen cookware
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80', // Kitchen utensils
    'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80', // Kitchen scale/cup
    'https://images.unsplash.com/photo-1590794056226-79ef3a814c6e?w=600&auto=format&fit=crop&q=80', // Kitchen appliances
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', // Kitchen glass jars
    'https://images.unsplash.com/photo-1543083477-4f7f010a6675?w=600&auto=format&fit=crop&q=80', // Kitchen knives
    'https://images.unsplash.com/photo-1595231712426-63d1a4bbd828?w=600&auto=format&fit=crop&q=80'  // Kettle/Cooker
  ];

  // Deterministic index based on filename hash
  let hash = 0;
  for (let i = 0; i < file.length; i++) {
    hash = file.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbacks.length;

  return NextResponse.redirect(fallbacks[index]);
}
