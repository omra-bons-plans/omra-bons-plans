

# Ajout de liens internes dans les articles de blog

## Objectif
Ajouter automatiquement des liens internes vers `/omra`, `/hajj` et d'autres articles dans chaque page de blog, afin de renforcer le maillage interne et signaler a Google l'importance de ces pages.

## Modifications

### 1. Mettre a jour InternalLinks.tsx
- Remplacer le lien `href: '/'` par `href: '/omra'` avec le label "Comparateur Omra"
- Ajouter un lien vers `/hajj` (Comparateur Hajj)
- Ajouter une entree dans `relatedLinksMap` pour les pages de blog (`/blog/*`) pointant vers `/omra`, `/hajj`, `/agences-liste` et `/ramadan-hajj-dates`

### 2. Integrer InternalLinks dans BlogPost.tsx
- Ajouter le composant `<InternalLinks>` en bas de chaque article (apres les articles similaires, avant le bloc WhatsApp)
- Utiliser le variant `related` avec `currentPage` dynamique base sur la route actuelle
- Afficher 4-6 liens vers les pages strategiques du site

## Section technique

**Fichier `src/components/SEO/InternalLinks.tsx`** :
- Ligne 28-32 : changer `href: '/'` en `href: '/omra'`
- Ajouter apres la ligne 31 un nouveau lien pour `/hajj`
- Dans `relatedLinksMap` : ajouter une cle generique pour les blogs qui pointe vers `/omra`, `/hajj`, `/agences-liste`, `/ramadan-hajj-dates`
- Mettre a jour les references a `/` dans `relatedLinksMap` pour pointer vers `/omra`

**Fichier `src/pages/BlogPost.tsx`** :
- Importer `InternalLinks` depuis `@/components/SEO/InternalLinks`
- Inserer `<InternalLinks currentPage={/blog/${category}/${slug}} variant="related" maxLinks={6} />` entre la section "Articles similaires" et le bloc WhatsApp (vers la ligne 518)

## Impact attendu
- Chaque article de blog enverra des signaux de lien interne vers `/omra` et `/hajj`
- Google considerera ces pages cibles comme plus importantes
- Resolution du probleme "Aucune page d'origine detectee" pour certaines URLs

