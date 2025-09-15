# Configuration Google Analytics

## Étapes pour configurer Google Analytics sur votre site

### 1. Créer un compte Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Cliquez sur "Commencer" si vous n'avez pas de compte
3. Configurez votre compte :
   - Nom du compte : "Omra Bons Plans" (ou le nom de votre choix)
   - Nom de la propriété : votre nom de domaine
   - Secteur d'activité : "Voyage et tourisme"
   - Objectifs commerciaux : "Générer des prospects"

### 2. Obtenir votre ID de mesure

1. Dans Google Analytics, allez dans **Admin** (roue dentée en bas à gauche)
2. Dans la colonne **Propriété**, cliquez sur **Flux de données**
3. Sélectionnez votre flux de données Web
4. Copiez l'**ID DE MESURE** (format : G-XXXXXXXXXX)

### 3. Configurer l'ID dans votre application

1. Ouvrez le fichier `src/App.tsx`
2. Trouvez la ligne :
   ```javascript
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Remplacer par votre ID Google Analytics
   ```
3. Remplacez `'G-XXXXXXXXXX'` par votre vrai ID de mesure

### 4. Fonctionnalités disponibles

Le système de tracking inclut automatiquement :

#### 📊 Tracking automatique
- **Pages vues** : Toutes les pages visitées
- **Temps de session** : Durée des visites
- **Taux de rebond** : Utilisateurs qui quittent rapidement
- **Démographie** : Âge, sexe, centres d'intérêt (si autorisé)

#### 🎯 Événements personnalisés
- **Clics sur annonces** : Suivi des interactions avec les services
- **Recherches** : Termes de recherche utilisés
- **Conversions** : Actions importantes (contact, réservation)

### 5. Utilisation dans vos composants

```javascript
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

function MonComposant() {
  const { trackEvent, trackSearch, trackAdClick } = useGoogleAnalytics();
  
  const handleClick = () => {
    trackEvent('button_click', {
      event_category: 'engagement',
      event_label: 'header_cta'
    });
  };
  
  const handleSearch = (term) => {
    trackSearch(term, 'omra_services');
  };
  
  const handleAdClick = (adId, title, category) => {
    trackAdClick(adId, title, category);
  };
}
```

### 6. Métriques importantes à surveiller

#### 📈 Trafic
- **Utilisateurs** : Nombre de visiteurs uniques
- **Sessions** : Nombre de visites
- **Pages vues** : Nombre total de pages consultées
- **Durée moyenne des sessions**

#### 🎯 Engagement
- **Taux de rebond** : % d'utilisateurs qui partent rapidement
- **Pages par session** : Nombre moyen de pages vues par visite
- **Événements** : Interactions avec votre contenu

#### 💰 Conversions
- **Objectifs** : Actions importantes accomplies
- **Entonnoir de conversion** : Étapes vers la conversion
- **Valeur des conversions**

### 7. Rapports utiles

1. **Temps réel** : Voir l'activité en cours
2. **Acquisition** : D'où viennent vos visiteurs
3. **Engagement** : Comment ils interagissent avec votre site
4. **Monétisation** : Revenus et conversions
5. **Rétention** : Fidélité des utilisateurs

### 8. Respect du RGPD

Le code inclut des bonnes pratiques pour le RGPD :
- Pas de cookies personnels stockés
- Données anonymisées
- Possibilité d'ajouter un banner de consentement si nécessaire

### 9. Conseils d'optimisation

1. **Définissez des objectifs** dans GA4 pour vos actions importantes
2. **Créez des audiences** pour segmenter vos utilisateurs
3. **Utilisez les rapports d'attribution** pour comprendre le parcours client
4. **Surveillez les pages les plus populaires** pour optimiser le contenu
5. **Analysez les sources de trafic** pour concentrer vos efforts marketing

### 10. Dépannage

Si Google Analytics ne fonctionne pas :

1. Vérifiez que l'ID de mesure est correct
2. Attendez 24-48h pour voir les premières données
3. Utilisez l'extension Chrome "Google Analytics Debugger"
4. Vérifiez la console du navigateur pour les erreurs

---

🎉 **Félicitations !** Votre site est maintenant équipé d'un système de suivi avancé pour optimiser votre trafic et améliorer l'expérience utilisateur.