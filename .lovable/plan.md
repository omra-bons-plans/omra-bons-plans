
# Plan de Correction des Problèmes d'Indexation Google Search Console

## Analyse des Problèmes

D'après la capture d'écran de Google Search Console, les problèmes d'indexation suivants ont été identifiés :

| Probleme | Cause Identifiée |
|----------|------------------|
| **Page avec redirection** | Les anciennes URLs (`/a-propos`, `/calendrier-islamique`, etc.) sont encore découvertes par Google malgré les redirections 301 |
| **Page en double sans URL canonique sélectionnée** | Les routes `/`, `/omra` et `/hajj` pointent vers le même composant `ComparateurOmra` sans canoniques distinctes |
| **Soft 404** | Le fichier `public/404.html` redirige automatiquement vers l'accueil après 3 secondes - Google le considère comme un "soft 404" |
| **Bloquée par robots.txt** | URLs bloquées dans robots.txt encore explorées par Google |
| **Exclue par noindex** | Pages avec `noindex` correctement exclues (comportement attendu) |
| **Page en double : Google n'a pas choisi la même URL canonique** | Conflits entre `/`, `/omra` et `/hajj` qui servent le même contenu |

---

## Section Technique - Corrections à Appliquer

### 1. Résoudre le problème des pages dupliquées (/, /omra, /hajj)

**Problème** : Les routes `/`, `/omra` et `/hajj` utilisent le même composant mais génèrent des URLs canoniques différentes.

**Solution** :
- `/` doit rediriger vers `/omra` (301)
- `/omra` devient l'URL canonique principale pour les offres Omra
- `/hajj` reste l'URL canonique pour les offres Hajj
- Mettre à jour `index.html` pour pointer vers `/omra` au lieu de `/`

**Fichiers à modifier** :
- `src/App.tsx` : Changer `<Route path="/" element={<ComparateurOmra />} />` en `<Navigate to="/omra" replace />`
- `index.html` : Mettre à jour l'URL canonique de `/` vers `/omra`
- `public/_redirects` : Ajouter redirection `/` vers `/omra`

### 2. Corriger le Soft 404

**Problème** : Le fichier `public/404.html` contient un script de redirection automatique vers l'accueil après 3 secondes, ce que Google interprète comme un "soft 404".

**Solution** : Supprimer le script de redirection automatique et garder uniquement la page 404 statique avec un lien manuel.

**Fichier à modifier** :
- `public/404.html` : Supprimer le `setTimeout` de redirection automatique

### 3. Nettoyer les redirections obsolètes dans robots.txt

**Problème** : Les URLs bloquées sont encore découvertes car elles existent dans le sitemap ou des liens internes.

**Solution** :
- Supprimer les lignes `Disallow` pour les URLs qui redirigent déjà (double blocage inutile)
- Google recommande de laisser les redirections 301 faire leur travail sans bloquer en plus

**Fichier à modifier** :
- `public/robots.txt` : Nettoyer les lignes de blocage des URLs redirigées

### 4. Mettre à jour le sitemap dynamique

**Problème** : Le sitemap inclut `/` comme route principale alors qu'elle devrait rediriger.

**Solution** : Remplacer `/` par `/omra` dans le sitemap.

**Fichier à modifier** :
- `supabase/functions/generate-sitemap/index.ts` : Remplacer `{ loc: '/' }` par redirection logique

### 5. Harmoniser les URLs canoniques dans les composants SEO

**Fichiers à vérifier/modifier** :
- `src/components/SEO/SEOHead.tsx` : Mettre à jour la config `home` avec `/omra`
- `src/pages/ComparateurOmra.tsx` : S'assurer que la canonique utilise `/omra` ou `/hajj` selon le type

---

## Résumé des Fichiers à Modifier

| Fichier | Modification |
|---------|--------------|
| `src/App.tsx` | Redirection `/` vers `/omra` |
| `index.html` | Canonique et og:url vers `/omra` |
| `public/_redirects` | Ajouter `/ /omra 301` |
| `public/404.html` | Supprimer la redirection auto |
| `public/robots.txt` | Nettoyer les Disallow inutiles |
| `supabase/functions/generate-sitemap/index.ts` | Corriger la route racine |
| `src/components/SEO/SEOHead.tsx` | Mettre à jour seoConfig.home |

---

## Impact Attendu

- **Pages en double** : Résolu par la canonicalisation claire `/omra` vs `/hajj`
- **Soft 404** : Résolu en supprimant la redirection automatique
- **Pages bloquées** : Réduction des signaux contradictoires pour Google
- **Meilleure indexation** : Une seule version canonique par contenu

