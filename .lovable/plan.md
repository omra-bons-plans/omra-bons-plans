

## Probleme identifie

Dans `DesktopSidebar.tsx` (ligne 63), la detection de la page Comparateur verifie les chemins `/` et `/comparateur-omra`, mais l'utilisateur est redirige vers `/omra`. Le bouton dynamique ne bascule donc jamais correctement.

## Plan de correction

**Fichier : `src/components/desktop/DesktopSidebar.tsx`**

1. **Corriger la detection de la route Comparateur** (ligne 63) : ajouter `/omra` et `/hajj` aux chemins reconnus comme "Comparateur"

```typescript
const isOnComparateur = location.pathname === '/' 
  || location.pathname === '/omra' 
  || location.pathname === '/hajj' 
  || location.pathname === '/comparateur-omra';
```

Cela garantit que :
- Sur `/omra` (Comparateur) → le bouton affiche **"Bons Plans"** et pointe vers `/bons-plans`
- Sur `/bons-plans` (ou toute autre page) → le bouton affiche **"Comparateur"** et pointe vers `/omra`

Aucun autre fichier a modifier.

