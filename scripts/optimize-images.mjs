/**
 * ⚡ Script d'optimisation d'images
 * Usage: node scripts/optimize-images.mjs
 *
 * Pré-requis: npm install -D sharp
 *
 * Ce script convertit toutes les images PNG/JPG > 100KB en WebP
 * et génère des variants optimisés (mobile + desktop)
 */

import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

// Essaie d'importer sharp, sinon affiche les instructions
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('\n⚠️  sharp n\'est pas installé. Exécutez:');
  console.log('   npm install -D sharp\n');
  console.log('Puis relancez: node scripts/optimize-images.mjs\n');
  console.log('Fichiers à optimiser (> 100KB):');

  // Lister quand même les fichiers à optimiser
  const dir = join(process.cwd(), 'public/lovable-uploads');
  try {
    const files = await readdir(dir);
    for (const file of files) {
      const ext = extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const s = await stat(join(dir, file));
        const kb = Math.round(s.size / 1024);
        if (kb > 100) {
          console.log(`  📸 ${file} → ${kb}KB → cible <50KB (WebP)`);
        }
      }
    }
  } catch {
    console.log('  (dossier lovable-uploads introuvable)');
  }
  process.exit(0);
}

const DIRS = [
  'public/lovable-uploads',
  'public',
];

const TARGET_QUALITY = 80;
const SKIP_IF_EXISTS = true;
let totalSaved = 0;
let filesProcessed = 0;

async function optimizeDir(dir) {
  const fullDir = join(process.cwd(), dir);
  let files;
  try {
    files = await readdir(fullDir);
  } catch {
    return;
  }

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const srcPath = join(fullDir, file);
    const baseName = basename(file, ext);
    const webpPath = join(fullDir, `${baseName}.webp`);

    const srcStat = await stat(srcPath);
    const srcKB = Math.round(srcStat.size / 1024);

    if (srcKB < 50) continue; // Déjà petit, pas besoin

    // Skip si WebP existe déjà
    if (SKIP_IF_EXISTS) {
      try {
        await stat(webpPath);
        console.log(`  ⏭  ${file} → WebP existe déjà`);
        continue;
      } catch {
        // Pas de WebP, continuer
      }
    }

    try {
      const info = await sharp(srcPath)
        .webp({ quality: TARGET_QUALITY, effort: 6 })
        .toFile(webpPath);

      const webpKB = Math.round(info.size / 1024);
      const saved = srcKB - webpKB;
      totalSaved += saved;
      filesProcessed++;

      console.log(`  ✅ ${file}`);
      console.log(`     ${srcKB}KB (PNG) → ${webpKB}KB (WebP) — économie: ${saved}KB (${Math.round(saved/srcKB*100)}%)`);
    } catch (err) {
      console.log(`  ❌ Erreur sur ${file}: ${err.message}`);
    }
  }
}

console.log('🖼  Optimisation des images...\n');
for (const dir of DIRS) {
  console.log(`📁 ${dir}/`);
  await optimizeDir(dir);
}

console.log(`\n✅ Terminé! ${filesProcessed} fichiers optimisés, ${Math.round(totalSaved/1024)}MB économisés`);
console.log('\n📝 Prochaine étape: mettre à jour les références dans le code (utiliser les .webp)');
