# Guide d'Optimisation des Images pour LCP

## 📦 Logos PNG → WebP (Priorité HAUTE)

### Conversion manuelle recommandée

**Logos à convertir :**
- `public/lovable-uploads/logoalbayt.png` → `logoalbayt.webp`
- `public/lovable-uploads/logohayat.png` → `logohayat.webp`
- `public/lovable-uploads/logosabile-new.png` → `logosabile-new.webp`
- `public/lovable-uploads/logoalsiratevoyage.png` → `logoalsiratevoyage.webp`
- `public/lovable-uploads/logoomrasounnah-favicon.png` → `logoomrasounnah-favicon.webp`

### Outils recommandés :

1. **Squoosh (Google - gratuit)** ⭐
   - URL : https://squoosh.app/
   - Qualité : 80-85%
   - Garder la transparence activée
   - Gain attendu : -30% de poids

2. **cwebp (CLI)**
   ```bash
   cwebp -q 85 input.png -o output.webp
   ```

3. **ImageMagick**
   ```bash
   convert input.png -quality 85 output.webp
   ```

### Après conversion :
- Remplacer les extensions `.png` par `.webp` dans :
  - `src/utils/agencyLogos.ts`
  - `src/pages/ComparateurOmra.tsx`
  - `src/pages/Favoris.tsx`

## 🖼️ Hero Image Mobile (Optionnel)

Pour créer une version mobile optimisée de l'image hero :

```bash
# Réduire à 750px de large, qualité 70
cwebp -resize 750 0 -q 70 hero-kaaba-2025-new.jpg -o hero-kaaba-2025-mobile.avif
```

Puis mettre à jour `OptimizedHeroImage.tsx` pour utiliser deux sources :
- Mobile : `hero-kaaba-2025-mobile.avif` (750px)
- Desktop : `hero-kaaba-2025-new.avif` (1600px)

## 📊 Impact attendu

| Optimisation | Gain LCP | Gain poids |
|--------------|----------|------------|
| Logos WebP | -0.2s | -25-30% |
| Hero mobile | -0.3s | -40% |
| CSS contain | -0.1s | 0KB |

**Total attendu : LCP < 2.0s sur mobile**
