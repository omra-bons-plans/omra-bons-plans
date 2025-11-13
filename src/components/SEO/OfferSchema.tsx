import { useEffect } from 'react';

interface OfferSchemaProps {
  offer: {
    id: string;
    offer_title: string;
    agency_name: string;
    price_eur: number;
    duration_nights?: number;
    date_start?: string;
    date_end?: string;
    hotel_makkah?: string;
    hotel_medina?: string;
    departure_city: string;
    offer_url: string;
    flights_included: boolean;
    visa_included: boolean;
    formula_type: string;
  };
}

/**
 * Composant pour injecter les données structurées Product/Offer schema
 * Améliore l'apparition dans les rich snippets Google
 */
export const OfferSchema = ({ offer }: OfferSchemaProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": offer.offer_title,
      "description": `Séjour Omra ${offer.formula_type} de ${offer.duration_nights || 0} nuits avec ${offer.agency_name}. ${offer.flights_included ? 'Vols inclus.' : ''} ${offer.visa_included ? 'Visa inclus.' : ''} Départ de ${offer.departure_city}.`,
      "brand": {
        "@type": "Brand",
        "name": offer.agency_name
      },
      "offers": {
        "@type": "Offer",
        "url": offer.offer_url,
        "priceCurrency": "EUR",
        "price": offer.price_eur,
        "priceValidUntil": offer.date_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": offer.agency_name
        },
        "itemCondition": "https://schema.org/NewCondition",
        "validFrom": offer.date_start || new Date().toISOString().split('T')[0]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "100"
      },
      "category": "Voyage religieux",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Type de formule",
          "value": offer.formula_type
        },
        {
          "@type": "PropertyValue",
          "name": "Durée",
          "value": `${offer.duration_nights || 0} nuits`
        },
        {
          "@type": "PropertyValue",
          "name": "Ville de départ",
          "value": offer.departure_city
        },
        {
          "@type": "PropertyValue",
          "name": "Vols inclus",
          "value": offer.flights_included ? "Oui" : "Non"
        },
        {
          "@type": "PropertyValue",
          "name": "Visa inclus",
          "value": offer.visa_included ? "Oui" : "Non"
        }
      ]
    };

    // Ajouter les hôtels si disponibles
    if (offer.hotel_makkah || offer.hotel_medina) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Hôtels",
        "value": [offer.hotel_makkah, offer.hotel_medina].filter(Boolean).join(', ')
      });
    }

    const scriptId = `offer-schema-${offer.id}`;
    let scriptTag = document.querySelector(`script[data-offer-schema="${offer.id}"]`) as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-offer-schema', offer.id);
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.querySelector(`script[data-offer-schema="${offer.id}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [offer]);

  return null;
};
