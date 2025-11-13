import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import { FAQSchema } from '@/components/SEO/FAQSchema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import ResponsiveLayout from '@/components/ResponsiveLayout';

const FAQ_DATA = [
  {
    question: "Qu'est-ce que Omra Bons Plans ?",
    answer: "Omra Bons Plans est le premier comparateur français dédié exclusivement aux séjours Omra et Hajj. Nous rassemblons les meilleures offres de toutes les agences agréées en France pour vous permettre de trouver le séjour idéal au meilleur prix."
  },
  {
    question: "Comment fonctionnent les comparaisons d'offres ?",
    answer: "Notre plateforme compare automatiquement les prix, les services inclus, la qualité des hôtels et la réputation des agences. Vous pouvez filtrer par prix, date de départ, ville de départ, type de formule et bien plus pour trouver l'offre qui vous correspond."
  },
  {
    question: "Les prix affichés sont-ils à jour ?",
    answer: "Oui, nos prix sont mis à jour quotidiennement grâce à notre système automatique. Cependant, nous vous recommandons de vérifier le prix final directement auprès de l'agence avant de réserver, car les disponibilités peuvent varier rapidement."
  },
  {
    question: "Puis-je réserver directement sur Omra Bons Plans ?",
    answer: "Non, Omra Bons Plans est un comparateur. Une fois que vous avez trouvé l'offre idéale, nous vous redirigeons vers le site de l'agence pour finaliser votre réservation en toute sécurité."
  },
  {
    question: "Quelles agences sont référencées ?",
    answer: "Nous travaillons avec les principales agences françaises agréées pour l'organisation de séjours Omra et Hajj, incluant Al Sirate Voyage, Al Bayt, Sabil Voyages, Hayat, Omra Sounnah, et bien d'autres agences certifiées."
  },
  {
    question: "Comment choisir entre une formule Essentiel et Confort ?",
    answer: "La formule Essentiel offre un hébergement 3-4 étoiles généralement situé à distance de marche du Haram. La formule Confort propose des hôtels 4-5 étoiles plus proches du Haram, avec plus de services et un confort supérieur."
  },
  {
    question: "Qu'est-ce qui est inclus dans le prix ?",
    answer: "Les éléments inclus varient selon les offres. Généralement, le prix comprend les vols aller-retour, l'hébergement, les transferts. Le visa, les repas et le guide peuvent être en option. Vérifiez toujours les détails de chaque offre."
  },
  {
    question: "Quelle est la meilleure période pour partir en Omra ?",
    answer: "Le Ramadan est la période la plus prisée mais aussi la plus chère. Pour des prix plus avantageux, privilégiez les mois hors Ramadan comme Rajab, Sha'ban, ou les mois après le Hajj. Évitez les périodes de forte chaleur (juin-août) si possible."
  },
  {
    question: "Combien de temps à l'avance dois-je réserver ?",
    answer: "Nous recommandons de réserver 2-3 mois à l'avance pour avoir le meilleur choix et les meilleurs prix. Pour le Ramadan, réservez 4-6 mois à l'avance minimum car les places partent très vite."
  },
  {
    question: "Les prix incluent-ils le visa saoudien ?",
    answer: "Cela dépend des offres. Certaines agences incluent le visa dans le prix total, d'autres le facturent en supplément (environ 300-400€). Vérifiez toujours les détails de l'offre avant de réserver."
  },
  {
    question: "Puis-je comparer les agences ?",
    answer: "Oui ! Notre outil de comparaison d'agences vous permet d'évaluer les notes Google, les points forts, les faiblesses et les spécialités de chaque agence pour faire le meilleur choix."
  },
  {
    question: "Comment savoir si une offre est de qualité ?",
    answer: "Vérifiez : 1) La note de l'agence sur Google, 2) La proximité des hôtels au Haram (distance à pied), 3) Les services inclus (vols, visa, guide, repas), 4) Les avis d'anciens voyageurs, 5) La réputation de l'agence."
  },
  {
    question: "Que faire si une offre est complète ?",
    answer: "Si une offre est marquée 'COMPLET', consultez d'autres offres similaires avec la même agence ou d'autres agences aux mêmes dates. Vous pouvez aussi activer les notifications pour être alerté des nouvelles offres."
  },
  {
    question: "Puis-je personnaliser mon séjour ?",
    answer: "La plupart des agences proposent des options personnalisables : extension de séjour, chambre individuelle, excursions supplémentaires, etc. Contactez directement l'agence pour discuter de vos besoins spécifiques."
  },
  {
    question: "Comment contacter une agence ?",
    answer: "Sur chaque fiche d'offre, vous trouverez un bouton 'Voir l'offre' qui vous redirige vers le site de l'agence. Vous y trouverez leurs coordonnées complètes (téléphone, email, WhatsApp) pour les contacter directement."
  }
];

const FAQ = () => {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <DynamicSEO
          title="FAQ - Questions fréquentes sur les séjours Omra & Hajj"
          description="Toutes vos questions sur l'organisation d'un séjour Omra : prix, agences, formules, visa, meilleure période. Réponses complètes et mises à jour."
          path="/faq"
          type="article"
        />
        
        <FAQSchema faqs={FAQ_DATA} />
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-lg text-muted-foreground">
            Retrouvez les réponses aux questions les plus fréquentes sur l'organisation de votre Omra ou Hajj.
          </p>
        </div>

        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Une autre question ?</h2>
          <p className="text-muted-foreground mb-4">
            N'hésitez pas à nous contacter si vous avez d'autres questions.
          </p>
          <a 
            href="/contact" 
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default FAQ;
