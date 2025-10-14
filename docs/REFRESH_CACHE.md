# Comment rafraîchir le cache de l'application

Si vous rencontrez l'erreur "Une erreur s'est produite" et que la page ne se rafraîchit pas :

## Solution 1 : Rafraîchissement forcé (Recommandé)
Sur mobile Chrome :
1. Appuyez sur les 3 points en haut à droite
2. Sélectionnez "Paramètres"
3. Allez dans "Confidentialité et sécurité"
4. Appuyez sur "Effacer les données de navigation"
5. Sélectionnez "Images et fichiers en cache"
6. Cliquez sur "Effacer les données"
7. Revenez à l'application et rafraîchissez

## Solution 2 : Hard Refresh
Sur ordinateur :
- **Windows/Linux** : Ctrl + Shift + R ou Ctrl + F5
- **Mac** : Cmd + Shift + R

## Solution 3 : Désinstaller le Service Worker
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Application"
3. Cliquez sur "Service Workers" dans le menu de gauche
4. Cliquez sur "Unregister" pour le service worker actif
5. Rafraîchissez la page

## Pourquoi cette erreur ?

L'application utilise un Service Worker pour mettre en cache les ressources et améliorer les performances. Après une mise à jour majeure du code, l'ancienne version en cache peut entrer en conflit avec la nouvelle version.

Le Service Worker a été mis à jour automatiquement pour gérer ces situations à l'avenir.
