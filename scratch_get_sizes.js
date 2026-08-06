const fs = require('fs');

function inspectHeader(filepath) {
  const buffer = fs.readFileSync(filepath);
  console.log(`${filepath}:`);
  console.log('  Magic bytes (hex):', buffer.subarray(0, 16).toString('hex'));
  console.log('  Magic bytes (ascii):', buffer.subarray(0, 16).toString('ascii').replace(/[^\x20-\x7E]/g, '.'));
  console.log('  Total size:', buffer.length);
  
  // PNG check
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    console.log(`  Identified: PNG, Dimensions: ${width}x${height}`);
  }
  // JPEG check
  else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    console.log('  Identified: JPEG');
    // Let's parse JPEG SOF marker
    let offset = 2;
    while (offset < buffer.length) {
      const marker = buffer.readUInt16BE(offset);
      const length = buffer.readUInt16BE(offset + 2);
      if (marker === 0xFFC0 || marker === 0xFFC2) { // SOF0 or SOF2
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        console.log(`  Dimensions: ${width}x${height}`);
        break;
      }
      offset += 2 + length;
    }
  }
  // WEBP check
  else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    console.log('  Identified: WEBP');
  } else {
    console.log('  Identified: Unknown');
  }
}

try {
  inspectHeader('public/uploads/upor5.webp');
  inspectHeader('public/uploads/lapalop1.webp');
  inspectHeader('public/uploads/lapalop2.webp');
  inspectHeader('public/uploads/lapalop3.webp');
} catch (e) {
  console.error(e);
}
