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
  '/a-propos': 'À Propos',
  '/contact': 'Contact',
  '/blog': 'Blog',
  '/horaires-prieres': 'Heures de Prière',
  '/calendrier-islamique': 'Calendrier Islamique',
  '/dates-ramadan-hajj': 'Dates Ramadan & Hajj',
  '/services': 'Services',
  '/sejour': 'Séjours Omra',
  '/vol': 'Vols',
  '/hebergement': 'Hébergements',
  '/guide': 'Guides',
  '/chauffeur': 'Transport',
  '/babysitting': 'Garde d\'enfants',
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