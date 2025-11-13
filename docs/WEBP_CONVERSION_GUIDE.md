# 🖼️ Guide de conversion des logos en WebP

## Problème

Lovable ne peut pas convertir directement les images PNG/JPEG en WebP. Vous devez utiliser un outil externe.

## Solutions disponibles

### Option 1 : Script Node.js automatique (RECOMMANDÉ)

**Avantages** : Rapide, automatique, précis

```bash
# 1. Installer Sharp (outil de conversion)
npm install sharp --save-dev

# 2. Exécuter le script
node scripts/convert-logos-webp.js
```

Le script va :
- ✅ Convertir automatiquement les 16 logos PNG/JPEG en WebP
- ✅ Qualité optimale (80%) pour balance taille/qualité
- ✅ Afficher les statistiques de compression
- ✅ Économie attendue : ~400-500 KB

### Option 2 : Outil en ligne de commande (cwebp)

**macOS** :
```bash
brew install webp
cd public/lovable-uploads/

# Convertir tous les logos
for file in *.{png,jpg,jpeg}; do
  [ -f "$file" ] && cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

**Linux (Ubuntu/Debian)** :
```bash
sudo apt-get install webp
cd public/lovable-uploads/

# Convertir tous les logos
for file in *.{png,jpg,jpeg}; do
  [ -f "$file" ] && cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

**Windows** :
```powershell
# Télécharger cwebp : https://developers.google.com/speed/webp/download
# Puis dans PowerShell :
cd public\lovable-uploads\
Get-ChildItem -Filter *.png,*.jpg,*.jpeg | ForEach-Object {
  cwebp -q 80 $_.FullName -o ($_.BaseName + ".webp")
}
```

### Option 3 : Outils en ligne

Services gratuits pour conversion batch :
1. **Squoosh.app** (Google) : https://squoosh.app/
2. **CloudConvert** : https://cloudconvert.com/png-to-webp
3. **Convertio** : https://convertio.co/fr/png-webp/

**Étapes** :
1. Télécharger tous les logos depuis `public/lovable-uploads/`
2. Convertir en WebP (quality 80%)
3. Télécharger les fichiers WebP
4. Les replacer dans `public/lovable-uploads/`

### Option 4 : Photoshop / GIMP

**Photoshop** :
- Installer le plugin WebP
- Fichier → Exporter → Enregistrer pour le web
- Format WebP, qualité 80

**GIMP** (gratuit) :
- Installer le plugin WebP : https://github.com/aferrero2707/gimp-web-plugin
- Fichier → Exporter sous → Format WebP
- Qualité 80

## Fichiers à convertir (16 fichiers)

### Logos agences (12 fichiers) :
- ✅ `logomedinvoyages.png` → `logomedinvoyages.webp`
- ✅ `logoalsiratevoyage.png` → `logoalsiratevoyage.webp`
- ✅ `logoomrasounnah.png` → `logoomrasounnah.webp`
- ✅ `logoomrasounnah-favicon.png` → `logoomrasounnah-favicon.webp`
- ✅ `logosabile-new.png` → `logosabile-new.webp`
- ✅ `logoalmaqam.png` → `logoalmaqam.webp`
- ✅ `logohayat.png` → `logohayat.webp`
- ✅ `logoalbayt.png` → `logoalbayt.webp`
- ✅ `logogatewaytravel.png` → `logogatewaytravel.webp`
- ✅ `logoomradiscount.png` → `logoomradiscount.webp`
- ✅ `logolabbayk.png` → `logolabbayk.webp`
- ✅ `logoomrapourtous.jpeg` → `logoomrapourtous.webp`

### Headers catégories (4 fichiers) :
- ✅ `297b56e8-a8c3-4e62-a5f2-6f6f13481412.png` → `.webp`
- ✅ `2ca6155f-3ded-4f14-9525-569582b6e18b.png` → `.webp`
- ✅ `2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.png` → `.webp`
- ✅ `81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png` → `.webp`

## Après la conversion

Une fois les fichiers WebP créés, **le code existant va automatiquement les détecter** ! ✨

Le composant `LazyAgencyLogo` essaie automatiquement de charger la version WebP :
```typescript
// Il cherche d'abord logomedinvoyages.webp
// Si trouvé → charge le WebP
// Si non trouvé → fallback vers logomedinvoyages.png
```

**Aucune modification de code nécessaire** si vous conservez les fichiers PNG originaux en backup.

## Vérification après conversion

```bash
# Vérifier les tailles
cd public/lovable-uploads/
ls -lh *.webp

# Comparer les tailles
du -sh *.png *.jpeg *.webp
```

## Gains attendus

**Avant conversion** :
- 16 logos PNG/JPEG : ~700 KB

**Après conversion** :
- 16 logos WebP (quality 80) : ~200-250 KB

**Économie totale** : ~450-500 KB (-65%)

## Support des navigateurs

WebP est supporté par :
- ✅ Chrome 32+ (2014)
- ✅ Firefox 65+ (2019)
- ✅ Safari 14+ (2020)
- ✅ Edge 18+ (2018)

**Couverture** : >96% des navigateurs en 2025
