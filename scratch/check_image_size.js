async function check() {
  const urls = [
    'https://scjbackzybmoapkupfbi.supabase.co/storage/v1/object/public/kitchenproduct/products/1779385992520-18v3klb.webp',
    'https://scjbackzybmoapkupfbi.supabase.co/storage/v1/object/public/kitchenproduct/products/1779365197039-wnyr80j.webp'
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(url);
      console.log('  Status:', res.status);
      console.log('  Content-Length:', res.headers.get('content-length'), 'bytes');
      console.log('  Content-Type:', res.headers.get('content-type'));
    } catch (e) {
      console.error(e);
    }
  }
}

check();
