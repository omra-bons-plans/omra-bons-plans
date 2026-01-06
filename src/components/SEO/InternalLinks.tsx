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
    href: '/agences-liste', 
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
    href: '/comparatif-visuel', 
    label: 'Comparatif Visuel', 
    description: 'Comparez visuellement',
    icon: <Star className="w-4 h-4" />
  },
  { 
    href: '/blog', 
    label: 'Blog Omra & Hajj', 
    description: 'Conseils et guides',
    icon: <BookOpen className="w-4 h-4" />
  },
  { 
    href: '/prayer-times', 
    label: 'Horaires de Prière', 
    description: 'Heures de prière',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/islamic-calendar', 
    label: 'Calendrier Islamique', 
    description: 'Calendrier Hijri',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/ramadan-hajj-dates', 
    label: 'Dates Ramadan & Hajj 2026', 
    description: 'Dates 2026-2028',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/ramadan-hajj-dates', 
    label: 'Dates Ramadan & Hajj 2026', 
    description: 'Calendrier complet 2026-2028',
    icon: <Calendar className="w-4 h-4" />
  },
  { 
    href: '/discussions', 
    label: 'Forum Discussions', 
    description: 'Communauté de pèlerins',
    icon: <Users className="w-4 h-4" />
  },
  { 
    href: '/about', 
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
  { 
    href: '/search', 
    label: 'Recherche', 
    description: 'Rechercher des offres',
    icon: <Search className="w-4 h-4" />
  },
  { 
    href: '/favoris', 
    label: 'Mes Favoris', 
    description: 'Vos offres sauvegardées',
    icon: <Star className="w-4 h-4" />
  },
];

// Liens recommandés par page pour éviter le contenu dupliqué
const relatedLinksMap: Record<string, string[]> = {
  '/': ['/bons-plans', '/agences-liste', '/ramadan-hajj-dates', '/comparatif-agences'],
  '/bons-plans': ['/', '/agences-liste', '/ramadan-hajj-dates', '/blog'],
  '/agences-liste': ['/comparatif-agences', '/comparatif-visuel', '/', '/bons-plans'],
  '/comparatif-agences': ['/agences-liste', '/comparatif-visuel', '/', '/bons-plans'],
  '/comparatif-visuel': ['/agences-liste', '/comparatif-agences', '/', '/blog'],
  '/blog': ['/', '/discussions', '/prayer-times', '/islamic-calendar'],
  '/prayer-times': ['/islamic-calendar', '/ramadan-hajj-dates', '/blog', '/'],
  '/islamic-calendar': ['/prayer-times', '/ramadan-hajj-dates', '/blog', '/'],
  '/ramadan-hajj-dates': ['/islamic-calendar', '/prayer-times', '/blog', '/'],
  '/discussions': ['/blog', '/', '/about', '/contact'],
  '/about': ['/contact', '/', '/blog', '/discussions'],
  '/contact': ['/about', '/', '/blog', '/discussions'],
  '/favoris': ['/', '/bons-plans', '/agences-liste', '/blog'],
  '/search': ['/', '/bons-plans', '/agences-liste', '/favoris'],
  '/publish': ['/', '/bons-plans', '/about', '/contact'],
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
