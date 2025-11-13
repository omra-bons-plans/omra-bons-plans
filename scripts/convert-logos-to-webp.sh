#!/bin/bash

# Script pour convertir tous les logos PNG en WebP
# Nécessite: cwebp (installer via: brew install webp ou apt-get install webp)

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Conversion des logos PNG en WebP...${NC}\n"

# Répertoire des logos
LOGO_DIR="public/lovable-uploads"

# Logos à convertir
logos=(
  "logoalbayt"
  "logohayat"
  "logosabile-new"
  "logoalsiratevoyage"
  "logoomrasounnah-favicon"
)

# Vérifier si cwebp est installé
if ! command -v cwebp &> /dev/null; then
    echo -e "${YELLOW}❌ cwebp n'est pas installé${NC}"
    echo "Installation:"
    echo "  Mac: brew install webp"
    echo "  Linux: apt-get install webp"
    echo "  Ou utilisez Squoosh: https://squoosh.app/"
    exit 1
fi

# Convertir chaque logo
for logo in "${logos[@]}"; do
    input="${LOGO_DIR}/${logo}.png"
    output="${LOGO_DIR}/${logo}.webp"
    
    if [ -f "$input" ]; then
        echo -e "🔄 Conversion: ${logo}.png → ${logo}.webp"
        cwebp -q 85 "$input" -o "$output" -quiet
        
        # Comparer les tailles
        input_size=$(du -h "$input" | cut -f1)
        output_size=$(du -h "$output" | cut -f1)
        
        echo -e "${GREEN}✅ Terminé: $input_size → $output_size${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Fichier non trouvé: $input${NC}\n"
    fi
done

echo -e "${GREEN}🎉 Conversion terminée!${NC}"
echo -e "\n${YELLOW}📝 Prochaines étapes:${NC}"
echo "1. Vérifier les logos convertis dans $LOGO_DIR"
echo "2. Mettre à jour les références dans:"
echo "   - src/utils/agencyLogos.ts"
echo "   - src/pages/ComparateurOmra.tsx"
echo "   - src/pages/Favoris.tsx"
echo "3. Supprimer les anciens PNG (optionnel)"
echo "4. Tester sur PageSpeed Insights"
