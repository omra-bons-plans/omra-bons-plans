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
          "name": "Comment réserver une Omra 2026 ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour réserver une Omra 2026, utilisez notre comparateur pour comparer les offres de plus de 15 agences agréées. Sélectionnez votre ville de départ, vos dates et votre budget. Vous verrez instantanément les prix, hôtels à La Mecque et Médine, et avis clients. Réservez directement auprès de l'agence choisie."
          }
        },
        {
          "@type": "Question",
          "name": "Quel est le prix d'une Omra Ramadan 2026 ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le prix d'une Omra Ramadan 2026 varie entre 1800€ et 5000€ selon la formule (économique, confort ou luxe), la proximité des hôtels au Haram et si vous choisissez les 10 derniers jours du Ramadan. Les prix sont plus élevés pendant le Ramadan en raison de la forte demande spirituelle."
          }
        },
        {
          "@type": "Question",
          "name": "Comment participer aux 10 derniers jours du Ramadan à La Mecque ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les 10 derniers jours du Ramadan incluent la nuit du Destin (Laylat al-Qadr). Pour y participer, réservez une Omra spéciale '10 derniers jours' via notre comparateur. Ces séjours sont très demandés, réservez plusieurs mois à l'avance. Les prix varient de 2500€ à 6000€ selon la formule."
          }
        },
        {
          "@type": "Question",
          "name": "Combien coûte le Hajj 2026 ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le prix du Hajj 2026 depuis la France varie entre 6000€ et 15000€ selon la formule choisie. Ce prix inclut généralement le vol, l'hébergement à La Mecque, Médine et Mina, les repas, le visa Hajj et l'encadrement religieux. Les places sont limitées par quotas, réservez tôt."
          }
        },
        {
          "@type": "Question",
          "name": "Quelles sont les agences Omra agréées en France ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les agences Omra agréées en France doivent posséder une licence ATOUT France et une accréditation du Ministère saoudien du Hajj. Sur Omra Bons Plans, nous référençons uniquement des agences agréées comme Tawaf, Sabile, Al Maqam, Hayat Voyages, Omra Gate, et bien d'autres."
          }
        },
        {
          "@type": "Question",
          "name": "Quelle est la meilleure période pour faire la Omra 2026 ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La Omra peut être effectuée toute l'année 2026. Les périodes les plus prisées sont le Ramadan (février-mars 2026) pour sa spiritualité intense. Pour des prix plus avantageux, privilégiez janvier, septembre ou novembre 2026. Les vacances scolaires sont aussi populaires pour les familles."
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
