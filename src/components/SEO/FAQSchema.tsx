import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * Composant pour injecter les données structurées FAQ
 * Permet d'apparaître dans les featured snippets Google
 */
export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    let scriptTag = document.querySelector('script[data-faq-schema]') as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-faq-schema', 'true');
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.querySelector('script[data-faq-schema]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [faqs]);

  return null;
};
