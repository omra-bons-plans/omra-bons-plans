#!/usr/bin/env node

/**
 * Script de conversion automatique PNG/JPEG → WebP
 * Nécessite: npm install sharp
 * Usage: node scripts/convert-logos-webp.js
 */

const fs = require('fs');
const path = require('path');

// Vérifier si Sharp est installé
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('❌ Sharp n\'est pas installé. Installez-le avec:');
  console.error('   npm install sharp --save-dev');
  process.exit(1);
}

const LOGOS_DIR = path.join(__dirname, '../public/lovable-uploads');

// Logos à convertir
const logosToConvert = [
  // Logos agences
  'logomedinvoyages.png',
  'logoalsiratevoyage.png',
  'logoomrasounnah.png',
  'logoomrasounnah-favicon.png',
  'logosabile-new.png',
  'logoalmaqam.png',
  'logohayat.png',
  'logoalbayt.png',
  'logogatewaytravel.png',
  'logoomradiscount.png',
  'logolabbayk.png',
  'logoomrapourtous.jpeg',
  
  // Headers catégories
  '297b56e8-a8c3-4e62-a5f2-6f6f13481412.png',
  '2ca6155f-3ded-4f14-9525-569582b6e18b.png',
  '2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.png',
  '81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png',
];

async function convertToWebP(inputFile) {
  const inputPath = path.join(LOGOS_DIR, inputFile);
  const outputFile = inputFile.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const outputPath = path.join(LOGOS_DIR, outputFile);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Fichier introuvable: ${inputFile}`);
    return { success: false, input: inputFile };
  }

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSizeKB = (inputStats.size / 1024).toFixed(1);

    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 }) // Quality 80, max effort
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSizeKB = (outputStats.size / 1024).toFixed(1);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${inputFile} → ${outputFile}`);
    console.log(`   ${inputSizeKB} KB → ${outputSizeKB} KB (-${reduction}%)`);

    return {
      success: true,
      input: inputFile,
      output: outputFile,
      inputSize: inputStats.size,
      outputSize: outputStats.size,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`❌ Erreur avec ${inputFile}:`, error.message);
    return { success: false, input: inputFile, error: error.message };
  }
}

async function main() {
  console.log('🔄 Conversion PNG/JPEG → WebP (quality 80)');
  console.log('='.repeat(60));
  console.log('');

  const results = [];
  
  for (const logo of logosToConvert) {
    const result = await convertToWebP(logo);
    results.push(result);
    console.log('');
  }

  // Statistiques
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    const totalInputSize = successful.reduce((sum, r) => sum + r.inputSize, 0);
    const totalOutputSize = successful.reduce((sum, r) => sum + r.outputSize, 0);
    const totalReduction = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);
    
    console.log('='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`✅ Conversions réussies: ${successful.length}/${logosToConvert.length}`);
    console.log(`📦 Taille avant: ${(totalInputSize / 1024).toFixed(1)} KB`);
    console.log(`📦 Taille après: ${(totalOutputSize / 1024).toFixed(1)} KB`);
    console.log(`💾 Réduction totale: ${totalReduction}%`);
    console.log(`💾 Économie: ${((totalInputSize - totalOutputSize) / 1024).toFixed(1)} KB`);
  }
  
  if (failed.length > 0) {
    console.log('');
    console.log(`⚠️  Échecs: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.input}: ${f.error || 'introuvable'}`));
  }

  console.log('');
  console.log('✅ Conversion terminée !');
  console.log('');
  console.log('📝 Prochaine étape: Mettre à jour les références dans le code');
  console.log('   Voir: src/utils/agencyLogos.ts');
}

main().catch(console.error);
