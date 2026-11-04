import fs from 'fs';
import path from 'path';

const dotNext = path.join(process.cwd(), '.next');
const outDir = path.join(process.cwd(), 'out');

if (fs.existsSync(dotNext)) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Copy all manifests and files from .next to out so Vercel finds them regardless of settings
  const entries = fs.readdirSync(dotNext);
  for (const entry of entries) {
    if (entry === 'cache') continue; // Skip cache for speed
    const src = path.join(dotNext, entry);
    const dest = path.join(outDir, entry);
    try {
      fs.cpSync(src, dest, { recursive: true, force: true });
    } catch (err) {
      console.warn(`[postbuild] Could not copy ${entry}:`, err.message);
    }
  }
  console.log('[postbuild] Synchronized .next manifests and build output to out/');
}
