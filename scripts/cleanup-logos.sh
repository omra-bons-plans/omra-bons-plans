#!/bin/bash

# Script de nettoyage des logos orphelins
# Usage: chmod +x scripts/cleanup-logos.sh && ./scripts/cleanup-logos.sh

echo "🧹 Nettoyage des logos orphelins dans public/lovable-uploads/"
echo ""

cd public/lovable-uploads/ || exit 1

# Compteur
deleted=0

# Liste des fichiers orphelins
orphans=(
  "3c50d8af-60ac-440c-8d0e-00a3fa82d43e.png"
  "51ece2ce-993f-4656-b73e-55303748f985.png"
  "56a2ede6-440b-4caf-8593-87bdc843a439.png"
  "5918566f-ff7c-4389-9910-1902eba8f5d6.png"
  "65b9282b-fcad-4d0b-8167-14248d2d69af.png"
  "674f1083-7ba3-4a76-aa68-3aa43ab71c6c.png"
  "81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png"
  "9620a4d7-67e8-42d0-b852-bee640f652f1.png"
  "MRA_Logo.jpg"
  "b44f7a09-71c3-4dcb-92b6-d93306719835.png"
  "d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
  "d5128689-bda3-4612-9ae8-6910ed21a8c8.png"
  "d5128689-bda3-4612-9ae8-6910ed21a8c8-optimized.png"
  "f137f21e-556a-46f4-affa-52a97b71a0b8.png"
  "f3eee9aa-6ad2-4c1d-bda5-2dadff68a39d.png"
  "ff7dd8f2-dfcd-405e-a4f6-9e59ffc8c580.png"
  "logosabile.png"
  "logosabilvoyages.png"
)

# Supprimer chaque fichier
for file in "${orphans[@]}"; do
  if [ -f "$file" ]; then
    size=$(du -h "$file" | cut -f1)
    rm -f "$file"
    echo "  ❌ Supprimé: $file ($size)"
    ((deleted++))
  else
    echo "  ⚠️  Déjà absent: $file"
  fi
done

echo ""
echo "✅ Nettoyage terminé: $deleted fichiers supprimés"
echo ""
echo "📊 Fichiers restants:"
ls -lh | grep -v "^total" | wc -l
echo ""
echo "💡 Prochaine étape: Convertir les 16 logos PNG/JPEG restants en WebP"
echo "   Voir: docs/LOGO_CLEANUP_PLAN.md"
