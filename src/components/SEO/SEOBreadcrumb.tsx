import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import Home from 'lucide-react/dist/esm/icons/home';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface SEOBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeMap: Record<string, string> = {
  '/': 'Accueil',
  // Sections principales
  '/bons-plans': 'Bons Plans',
  '/hajj': 'Hajj',
  '/hajj-2026': 'Hajj 2026',
  '/hajj-2027': 'Hajj 2027',
  '/coran': 'Le Coran',
  '/horaires-priere': 'Horaires de Prière',
  '/comparateur-omra-france': 'Comparateur Omra',
  '/agences-liste': 'Agences Omra',
  '/comparatif-agences': 'Comparatif Agences',
  '/les-hotels': 'Hôtels La Mecque & Médine',
  '/ramadan-hajj-dates': 'Dates Ramadan & Hajj',
  // Guides
  '/meilleure-agence-omra': 'Meilleure Agence Omra',
  '/prix-omra-2026': 'Prix Omra 2026',
  '/omra-tout-compris': 'Omra Tout Compris',
  '/omra-femme-seule': 'Omra Femme Seule',
  '/omra-ramadan-2026': 'Omra Ramadan 2026',
  '/omra-en-janvier-2027': 'Omra en Janvier 2027',
  '/omra-en-decembre-2026': 'Omra en Décembre 2026',
  '/omra-en-novembre-2026': 'Omra en Novembre 2026',
  '/omra-en-octobre-2026': 'Omra en Octobre 2026',
  '/visa-omra-france': 'Visa Omra France',
  '/definition-omra': "Définition de l'Omra",
  '/rites-omra': "Rites de l'Omra",
  '/omra-debutant': 'Omra pour Débutants',
  '/omra-famille': 'Omra en Famille',
  '/omra-seniors': 'Omra Seniors',
  '/omra-enfants': 'Omra avec Enfants',
  '/omra-badal': 'Omra Badal',
  '/guide-hajj-4-ecoles': 'Guide Hajj — 4 Écoles',
  '/liste-bagages-omra': 'Liste Bagages Omra',
  '/guide-omra-pas-chere': 'Guide Omra Pas Chère',
  '/10-derniers-jours-ramadan': '10 Derniers Jours du Ramadan',
  // Omra depuis les villes
  '/omra-depuis-paris': 'Omra depuis Paris',
  '/omra-depuis-lyon': 'Omra depuis Lyon',
  '/omra-depuis-marseille': 'Omra depuis Marseille',
  '/omra-depuis-toulouse': 'Omra depuis Toulouse',
  '/omra-depuis-nice': 'Omra depuis Nice',
  '/omra-depuis-bordeaux': 'Omra depuis Bordeaux',
  '/omra-depuis-strasbourg': 'Omra depuis Strasbourg',
  '/omra-depuis-lille': 'Omra depuis Lille',
  '/omra-depuis-nantes': 'Omra depuis Nantes',
  '/omra-depuis-rennes': 'Omra depuis Rennes',
  '/omra-depuis-montpellier': 'Omra depuis Montpellier',
  '/omra-depuis-grenoble': 'Omra depuis Grenoble',
  '/omra-depuis-metz': 'Omra depuis Metz',
  '/omra-depuis-clermont-ferrand': 'Omra depuis Clermont-Ferrand',
  // Routes existantes
  '/a-propos': 'À Propos',
  '/contact': 'Contact',
  '/blog': 'Blog',
  '/calendrier-islamique': 'Calendrier Islamique',
  '/dates-ramadan-hajj': 'Dates Ramadan & Hajj',
  '/services': 'Services',
  '/sejour': 'Séjours Omra',
  '/vol': 'Vols',
  '/hebergement': 'Hébergements',
  '/guide': 'Guides',
  '/chauffeur': 'Transport',
  '/babysitting': "Garde d'enfants",
  '/profile': 'Profil',
  '/my-ads': 'Mes Annonces',
  '/notifications': 'Notifications',
  '/settings': 'Paramètres',
};

export const SEOBreadcrumb = ({ items, className }: SEOBreadcrumbProps) => {
  const location = useLocation();

  // Generate breadcrumb items from current path if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname);

  // Generate structured data for SEO — stable JSON string to avoid re-running effect on every render
  const structuredDataJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `https://omrabonsplans.fr${item.url}` : undefined
    }))
  });

  // Inject structured data into head
  useEffect(() => {
    let scriptTag = document.querySelector('script[data-breadcrumb-ld]') as HTMLScriptElement;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-breadcrumb-ld', 'true');
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = structuredDataJson;

    return () => {
      const existingScript = document.querySelector('script[data-breadcrumb-ld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [structuredDataJson]);

  // Don't show visual breadcrumb on homepage, but still inject structured data
  if (location.pathname === '/') {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://omrabonsplans.fr/"
              }
            ]
          })
        }}
      />
    );
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.slice(1).map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.url && index < breadcrumbItems.length - 2 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.url}>{item.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: 'Accueil', url: '/' }];

  let currentPath = '';
  for (const path of paths) {
    currentPath += `/${path}`;
    const name = routeMap[currentPath] || path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    items.push({ name, url: currentPath });
  }

  return items;
}