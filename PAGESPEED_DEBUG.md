# 🔍 Debug PageSpeed Insights - Score 0-49

## Problème observé
PageSpeed Insights affiche tous les scores en rouge (0-49) sur mobile, ce qui indique un blocage complet de l'analyse.

## ✅ Actions correctives effectuées

### 1. Service Worker désactivé temporairement
**Fichier:** `src/utils/serviceWorkerRegistration.ts`

- ⚠️ **Service Worker complètement désactivé** pour l'instant
- Permet à PageSpeed Insights d'analyser le site sans interférence
- À réactiver après validation des scores

**Comment réactiver:**
```typescript
// Dans src/utils/serviceWorkerRegistration.ts
// Enlever le return et décommenter le code
```

### 2. Hook Anti-Scraping amélioré
**Fichier:** `src/hooks/useAntiScraping.ts`

- ✅ **Whitelist des bots légitimes** ajoutée directement dans le hook
- Détection via `navigator.userAgent`: lighthouse, pagespeed, googlebot, chrome-lighthouse
- Le hook s'autodésactive si un bot légitime est détecté

### 3. Edge Functions déjà corrigées
- ✅ Whitelist dans `detect-scraping` et `check-scraping`
- ✅ Déployées automatiquement

## 🧪 Test recommandé

1. **Recharger le site** pour que les modifications prennent effet
2. **Vider le cache du navigateur** (Ctrl+Shift+Del)
3. **Désinstaller l'ancien Service Worker**:
   - Ouvrir DevTools > Application > Service Workers
   - Cliquer sur "Unregister"
4. **Relancer PageSpeed Insights**: https://pagespeed.web.dev/

## 📊 Résultats attendus

Sans le Service Worker qui interfère:
- **Performance Mobile**: 75-85+ ✅
- **Accessibilité**: 95+ ✅
- **Bonnes pratiques**: 90+ ✅
- **SEO**: 95+ ✅

## ⚠️ Note importante

Le Service Worker est désactivé **temporairement**. Une fois les scores validés:
1. Réactiver le SW dans `serviceWorkerRegistration.ts`
2. Améliorer la logique de détection des bots dans `sw.js`
3. Retester PageSpeed pour confirmer

## 🔧 Prochaines étapes

Si le problème persiste après ces changements:
1. Vérifier les requêtes réseau dans Chrome DevTools
2. Analyser les erreurs dans la console
3. Tester avec GTmetrix ou Lighthouse local
4. Vérifier que le site est bien accessible depuis l'extérieur (pas de firewall/IP blocking)
