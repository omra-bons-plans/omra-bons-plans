# 🧹 Plan de nettoyage des logos - Suppression de 18 fichiers orphelins

## Analyse actuelle

**Total fichiers** : 37 fichiers dans `public/lovable-uploads/`
**Fichiers utilisés** : 19 fichiers (15 logos + 4 headers)
**Fichiers orphelins** : 18 fichiers inutilisés ❌

## Logos réellement utilisés (15 fichiers)

### Agences (14 logos uniques) :
1. ✅ `logomedinvoyages.png` - Medin Voyages
2. ✅ `logoalsiratevoyage.png` - Al Sirate Voyage
3. ✅ `logoomrasounnah.png` - Omra Du Savoir
4. ✅ `logoomrasounnah-favicon.png` - Omra Sounnah
5. ✅ `logoomrapourtous.jpeg` - Omra Pour Tous
6. ✅ `logotawaf.webp` - TAWAF (déjà WebP) 🎯
7. ✅ `logosabile-new.png` - Sabil Voyages
8. ✅ `logoalmaqam.png` - Al Maqam Voyages
9. ✅ `logopelrinhajj.webp` - Pèlerin Hajj (déjà WebP) 🎯
10. ✅ `logohayat.png` - Al Hayat Voyages
11. ✅ `logoalbayt.png` - Al Bayt
12. ✅ `logogatewaytravel.png` - Gateway-travel
13. ✅ `logoomradiscount.png` - Omra Discount
14. ✅ `logolabbayk.png` - Labbayk
15. ✅ `logoomragate.webp` - OMRA GATE (déjà WebP) 🎯

### Headers de catégories (4 images) :
1. ✅ `297b56e8-a8c3-4e62-a5f2-6f6f13481412.png` - Header Chauffeurs
2. ✅ `2ca6155f-3ded-4f14-9525-569582b6e18b.png` - Header Babysitting
3. ✅ `2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.png` - Header Guides
4. ✅ `81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png` - Exemple annonce

## ❌ Fichiers orphelins à SUPPRIMER (18 fichiers)

**Doublons/versions obsolètes** :
- `81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png` (doublon de 81c64f5d...)
- `d5128689-bda3-4612-9ae8-6910ed21a8c8.png` (non utilisé)
- `d5128689-bda3-4612-9ae8-6910ed21a8c8-optimized.png` (doublon)
- `logosabile.png` (ancien logo, remplacé par logosabile-new.png)
- `logosabilvoyages.png` (doublon/non utilisé)

**Fichiers jamais référencés** :
- `3c50d8af-60ac-440c-8d0e-00a3fa82d43e.png`
- `51ece2ce-993f-4656-b73e-55303748f985.png`
- `56a2ede6-440b-4caf-8593-87bdc843a439.png`
- `5918566f-ff7c-4389-9910-1902eba8f5d6.png`
- `65b9282b-fcad-4d0b-8167-14248d2d69af.png`
- `674f1083-7ba3-4a76-aa68-3aa43ab71c6c.png`
- `9620a4d7-67e8-42d0-b852-bee640f652f1.png`
- `b44f7a09-71c3-4dcb-92b6-d93306719835.png`
- `d506d5c2-ddc8-446e-84b9-f2254d23d35a.png`
- `f137f21e-556a-46f4-affa-52a97b71a0b8.png`
- `f3eee9aa-6ad2-4c1d-bda5-2dadff68a39d.png`
- `ff7dd8f2-dfcd-405e-a4f6-9e59ffc8c580.png`
- `MRA_Logo.jpg`

## Script de nettoyage

```bash
cd public/lovable-uploads/

# Supprimer les fichiers orphelins
rm -f 3c50d8af-60ac-440c-8d0e-00a3fa82d43e.png
rm -f 51ece2ce-993f-4656-b73e-55303748f985.png
rm -f 56a2ede6-440b-4caf-8593-87bdc843a439.png
rm -f 5918566f-ff7c-4389-9910-1902eba8f5d6.png
rm -f 65b9282b-fcad-4d0b-8167-14248d2d69af.png
rm -f 674f1083-7ba3-4a76-aa68-3aa43ab71c6c.png
rm -f 81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png
rm -f 9620a4d7-67e8-42d0-b852-bee640f652f1.png
rm -f MRA_Logo.jpg
rm -f b44f7a09-71c3-4dcb-92b6-d93306719835.png
rm -f d506d5c2-ddc8-446e-84b9-f2254d23d35a.png
rm -f d5128689-bda3-4612-9ae8-6910ed21a8c8.png
rm -f d5128689-bda3-4612-9ae8-6910ed21a8c8-optimized.png
rm -f f137f21e-556a-46f4-affa-52a97b71a0b8.png
rm -f f3eee9aa-6ad2-4c1d-bda5-2dadff68a39d.png
rm -f ff7dd8f2-dfcd-405e-a4f6-9e59ffc8c580.png
rm -f logosabile.png
rm -f logosabilvoyages.png

echo "✅ 18 fichiers orphelins supprimés"
ls -lh | wc -l  # Devrait montrer 19 fichiers restants
```

## Optimisation des 12 logos PNG restants

Après suppression, convertir les 12 logos PNG en WebP :

```bash
cd public/lovable-uploads/

# Logos agences (12 PNG)
cwebp -q 80 logomedinvoyages.png -o logomedinvoyages.webp
cwebp -q 80 logoalsiratevoyage.png -o logoalsiratevoyage.webp
cwebp -q 80 logoomrasounnah.png -o logoomrasounnah.webp
cwebp -q 80 logoomrasounnah-favicon.png -o logoomrasounnah-favicon.webp
cwebp -q 80 logosabile-new.png -o logosabile-new.webp
cwebp -q 80 logoalmaqam.png -o logoalmaqam.webp
cwebp -q 80 logohayat.png -o logohayat.webp
cwebp -q 80 logoalbayt.png -o logoalbayt.webp
cwebp -q 80 logogatewaytravel.png -o logogatewaytravel.webp
cwebp -q 80 logoomradiscount.png -o logoomradiscount.webp
cwebp -q 80 logolabbayk.png -o logolabbayk.webp

# Headers catégories (4 PNG)
cwebp -q 80 297b56e8-a8c3-4e62-a5f2-6f6f13481412.png -o 297b56e8-a8c3-4e62-a5f2-6f6f13481412.webp
cwebp -q 80 2ca6155f-3ded-4f14-9525-569582b6e18b.png -o 2ca6155f-3ded-4f14-9525-569582b6e18b.webp
cwebp -q 80 2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.png -o 2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.webp
cwebp -q 80 81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png -o 81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.webp

# JPEG (1 fichier)
cwebp -q 80 logoomrapourtous.jpeg -o logoomrapourtous.webp

echo "✅ 16 logos convertis en WebP"
```

## Gains attendus

### Avant nettoyage :
- **37 fichiers** (~1700 KB)
- 18 fichiers inutilisés chargés potentiellement

### Après nettoyage :
- **19 fichiers** utilisés
- **15 logos WebP** (~300 KB lazy-loaded)
- **4 headers WebP** (~180 KB lazy-loaded)
- **Total** : ~480 KB (au lieu de 1700 KB)

### Réduction :
- ✅ **-1220 KB** (-72%)
- ✅ **-18 fichiers HTTP** inutiles
- ✅ Score PSI : Impact positif sur TBT et LCP

## Mise à jour du code

Après conversion WebP, mettre à jour `src/utils/agencyLogos.ts` pour utiliser les versions WebP.
