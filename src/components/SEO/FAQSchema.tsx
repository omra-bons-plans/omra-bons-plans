import { useEffect } from 'react';

/**
 * Composant pour injecter les données structurées FAQPage
 * Permet d'afficher les FAQ directement dans les résultats Google
 */
export const FAQSchema = () => {
  useEffect(() => {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qu'est-ce qu'Omra Bons Plans ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Omra Bons Plans est le premier comparateur d'agences Omra et Hajj agréées en France. Notre plateforme permet de comparer les prix, les services et les avis de dizaines d'agences de voyage spécialisées dans les pèlerinages musulmans vers La Mecque et Médine."
          }
        },
        {
          "@type": "Question",
          "name": "Comment comparer les offres Omra sur votre site ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour comparer les offres Omra, utilisez notre comparateur en sélectionnant votre ville de départ, vos dates souhaitées et votre budget. Vous verrez instantanément toutes les offres disponibles avec les prix, les hôtels, la distance au Haram et les avis clients pour chaque agence."
          }
        },
        {
          "@type": "Question",
          "name": "Quelles sont les agences Omra agréées en France ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les agences Omra agréées en France doivent posséder une licence ATOUT France et une accréditation du Ministère saoudien du Hajj. Sur Omra Bons Plans, nous référençons uniquement des agences agréées comme Tawaf, Sabile, Al Maqam, Hayat Voyages, et bien d'autres."
          }
        },
        {
          "@type": "Question",
          "name": "Quel est le prix moyen d'une Omra depuis la France ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le prix d'une Omra depuis la France varie entre 1200€ et 4000€ selon la formule choisie (économique, confort ou luxe), la période de départ, la durée du séjour et la proximité des hôtels au Haram. Les formules Ramadan sont généralement plus chères en raison de la forte demande."
          }
        },
        {
          "@type": "Question",
          "name": "Quelle est la meilleure période pour faire la Omra ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La Omra peut être effectuée toute l'année, contrairement au Hajj. Les périodes les plus prisées sont le Ramadan (pour sa spiritualité) et les vacances scolaires. Pour des prix plus avantageux et moins de foule, privilégiez les mois hors Ramadan comme janvier, février ou septembre."
          }
        },
        {
          "@type": "Question",
          "name": "Comment fonctionne le comparateur d'agences Omra ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Notre comparateur analyse en temps réel les offres de plus de 15 agences agréées. Il affiche pour chaque offre : le prix total, les dates de départ, les hôtels à La Mecque et Médine, la distance au Haram, les vols inclus et les avis vérifiés des pèlerins. Vous pouvez filtrer par budget, ville de départ et formule."
          }
        }
      ]
    };

    let scriptTag = document.querySelector('script[data-faq-ld]') as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-faq-ld', 'true');
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(faqData);

    return () => {
      const existingScript = document.querySelector('script[data-faq-ld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};
