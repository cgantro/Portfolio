import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const ASSET_DIR = "./asset";
const MAX_WIDTH = 1200;

// Compression settings
const WEBP_QUALITY = 80;
const PNG_QUALITY = 80;
const JPEG_QUALITY = 82;

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);

  let pipeline = sharp(filePath).resize({ width: MAX_WIDTH, withoutEnlargement: true });

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else {
    console.log(`  ⏭  ${name} — skipped (unsupported format)`);
    return;
  }

  const before = (await stat(filePath)).size;
  const buf = await pipeline.toBuffer();
  const after = buf.byteLength;

  if (after < before) {
    // Write to a safe temp path then move back (handles Korean/space filenames)
    const tmpPath = join(ASSET_DIR, `__tmp_compress${ext}`);
    await sharp(buf).toFile(tmpPath);
    const { rename } = await import("fs/promises");
    await rename(tmpPath, filePath);
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(
      `  ✅ ${name.padEnd(40)} ${(before / 1024).toFixed(0).padStart(5)}KB → ${(after / 1024).toFixed(0).padStart(5)}KB  (-${saved}%)`
    );
  } else {
    console.log(`  ➖ ${name} — already optimized`);
  }
}

async function run() {
  const files = await readdir(ASSET_DIR);
  console.log(`\n🗜  Compressing ${files.length} assets in ${ASSET_DIR}/\n`);
  for (const f of files) {
    if (f.startsWith("__tmp")) continue;
    const full = join(ASSET_DIR, f);
    try {
      await compress(full);
    } catch (err) {
      console.log(`  ⚠️  ${f} — skipped (${err.code ?? err.message})`);
    }
  }
  console.log("\n✨ Done!\n");
}

run().catch(console.error);
