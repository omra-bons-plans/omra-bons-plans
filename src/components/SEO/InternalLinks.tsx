import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, BookOpen, MapPin, Search, Star } from 'lucide-react';

interface InternalLink {
  href: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface InternalLinksProps {
  currentPage?: string;
  variant?: 'footer' | 'sidebar' | 'inline' | 'related';
  className?: string;
  maxLinks?: number;
}

// Définition de toutes les pages principales du site avec leurs liens
const allInternalLinks: InternalLink[] = [
  { 
    href: '/', 
    label: 'Comparateur Omra', 
    description: 'Comparez les offres Omra',
    icon: <Search className="w-4 h-4" />
  },
  { 
    href: '/bons-plans', 
    label: 'Bons Plans Omra', 
    description: 'Offres et services',
    icon: <Star className="w-4 h-4" />
  },
  { 
    href: '/agences', 
    label: 'Liste des Agences', 
    description: 'Agences Omra agréées',
    icon: <Users className="w-4 h-4" />
  },
  { 
    href: '/comparatif-agences', 
    label: 'Comparatif Agences', 
    description: 'Comparez les agences',
    icon: <Star className="w-4 h-4" />
  },
  { 
    href: '/blog', 
    label: 'Blog Omra & Hajj', 
    description: 'Conseils et guides',
    icon: <BookOpen className="w-4 h-4" />
  },
  { 
    href: '/horaires-prieres', 
    label: 'Horaires de Prière', 
    description: 'Heures de prière',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/calendrier-islamique', 
    label: 'Calendrier Islamique', 
    description: 'Calendrier Hijri',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/dates-ramadan-hajj', 
    label: 'Dates Ramadan & Hajj', 
    description: 'Dates 2025-2028',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/discussions', 
    label: 'Forum Discussions', 
    description: 'Communauté de pèlerins',
    icon: <Users className="w-4 h-4" />
  },
  { 
    href: '/a-propos', 
    label: 'À Propos', 
    description: 'Notre mission',
    icon: <Users className="w-4 h-4" />
  },
  { 
    href: '/contact', 
    label: 'Contact', 
    description: 'Nous contacter',
    icon: <MapPin className="w-4 h-4" />
  },
];

// Liens recommandés par page pour éviter le contenu dupliqué
const relatedLinksMap: Record<string, string[]> = {
  '/': ['/bons-plans', '/agences', '/blog', '/comparatif-agences'],
  '/bons-plans': ['/', '/agences', '/comparatif-agences', '/blog'],
  '/agences': ['/comparatif-agences', '/', '/bons-plans', '/blog'],
  '/comparatif-agences': ['/agences', '/', '/bons-plans', '/blog'],
  '/blog': ['/', '/discussions', '/horaires-prieres', '/calendrier-islamique'],
  '/horaires-prieres': ['/calendrier-islamique', '/dates-ramadan-hajj', '/blog', '/'],
  '/calendrier-islamique': ['/horaires-prieres', '/dates-ramadan-hajj', '/blog', '/'],
  '/dates-ramadan-hajj': ['/calendrier-islamique', '/horaires-prieres', '/blog', '/'],
  '/discussions': ['/blog', '/', '/a-propos', '/contact'],
  '/a-propos': ['/contact', '/', '/blog', '/discussions'],
  '/contact': ['/a-propos', '/', '/blog', '/discussions'],
  '/favoris': ['/', '/bons-plans', '/agences', '/blog'],
  '/publish': ['/', '/bons-plans', '/a-propos', '/contact'],
};

export const InternalLinks: React.FC<InternalLinksProps> = ({
  currentPage = '/',
  variant = 'related',
  className = '',
  maxLinks = 4
}) => {
  // Obtenir les liens recommandés pour la page courante
  const getRelevantLinks = (): InternalLink[] => {
    const recommendedPaths = relatedLinksMap[currentPage] || ['/bons-plans', '/agences', '/blog', '/'];
    
    return recommendedPaths
      .filter(path => path !== currentPage)
      .slice(0, maxLinks)
      .map(path => allInternalLinks.find(link => link.href === path))
      .filter((link): link is InternalLink => link !== undefined);
  };

  const links = getRelevantLinks();

  if (links.length === 0) return null;

  if (variant === 'inline') {
    return (
      <nav className={`flex flex-wrap gap-2 ${className}`} aria-label="Liens internes">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-primary hover:text-primary/80 underline underline-offset-2 text-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  if (variant === 'footer') {
    return (
      <nav className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`} aria-label="Liens internes">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  if (variant === 'sidebar') {
    return (
      <nav className={`space-y-2 ${className}`} aria-label="Pages connexes">
        <h3 className="font-semibold text-foreground mb-3">Pages connexes</h3>
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm py-1"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  // Default: related variant
  return (
    <nav className={`mt-8 p-6 bg-muted/50 rounded-xl ${className}`} aria-label="Articles et pages connexes">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <ArrowRight className="w-4 h-4" />
        À découvrir également
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-accent transition-colors group"
          >
            <span className="text-primary group-hover:text-primary/80">
              {link.icon}
            </span>
            <div>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {link.label}
              </span>
              {link.description && (
                <p className="text-xs text-muted-foreground">{link.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default InternalLinks;
