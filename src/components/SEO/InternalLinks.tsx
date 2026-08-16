import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Users from 'lucide-react/dist/esm/icons/users';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import Star from 'lucide-react/dist/esm/icons/star';

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
  links?: InternalLink[];
}

const allInternalLinks: InternalLink[] = [
  { href: '/', label: 'Comparateur Omra', description: 'Comparez les offres Omra', icon: <Search className="w-4 h-4" /> },
  { href: '/hajj', label: 'Comparateur Hajj', description: 'Comparez les offres Hajj', icon: <Search className="w-4 h-4" /> },
  { href: '/meilleure-agence-omra', label: 'Meilleure Agence Omra', description: 'Guide pour choisir son agence', icon: <Star className="w-4 h-4" /> },
  { href: '/prix-omra-2026', label: 'Prix Omra 2026', description: 'Tous les tarifs par mois', icon: <Search className="w-4 h-4" /> },
  { href: '/conditions-omra', label: 'Conditions Omra', description: 'Qui peut partir en Omra ?', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/quand-partir-omra', label: 'Quand Partir en Omra', description: 'Meilleures périodes', icon: <Calendar className="w-4 h-4" /> },
  { href: '/omra-femme-seule', label: 'Omra Femme Seule', description: 'Guide complet', icon: <Users className="w-4 h-4" /> },
  { href: '/omra-tout-compris', label: 'Omra Tout Compris', description: 'Forfaits clé en main', icon: <Star className="w-4 h-4" /> },
  { href: '/definition-omra', label: "Définition de l'Omra", description: 'Signification et rites', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/omra-debutant', label: 'Omra pour Débutant', description: 'Guide première Omra', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/visa-omra-france', label: 'Visa Omra France', description: 'Obtenir son visa', icon: <MapPin className="w-4 h-4" /> },
  { href: '/guide-omra-pas-chere', label: 'Omra Pas Chère', description: 'Astuces pour économiser', icon: <Search className="w-4 h-4" /> },
  { href: '/rites-omra', label: 'Rites de l\'Omra', description: 'Les 4 étapes des rites', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/omra-ramadan-2026', label: 'Omra Ramadan 2027', description: 'Partir pendant le Ramadan', icon: <Calendar className="w-4 h-4" /> },
  { href: '/omra-famille', label: 'Omra en Famille', description: 'Partir avec ses enfants', icon: <Users className="w-4 h-4" /> },
  { href: '/omra-seniors', label: 'Omra Seniors', description: 'Conseils pour les seniors', icon: <Users className="w-4 h-4" /> },
  { href: '/omra-enfants', label: 'Omra avec Enfants', description: 'Guide pratique', icon: <Users className="w-4 h-4" /> },
  { href: '/omra-badal', label: 'Omra Badal', description: 'Omra par procuration', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/hajj-2027', label: 'Hajj 2027', description: 'Guide pèlerinage 2027', icon: <Calendar className="w-4 h-4" /> },
  { href: '/guide-hajj-4-ecoles', label: 'Guide Hajj 4 Écoles', description: 'Rites selon Hanafi, Maliki, Shafi\'i, Hanbali', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/liste-bagages-omra', label: 'Liste Bagages Omra', description: 'Quoi emporter', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/10-derniers-jours-ramadan', label: '10 Derniers Jours Ramadan', description: 'Laylat al-Qadr à La Mecque', icon: <Calendar className="w-4 h-4" /> },
  { href: '/agences-liste', label: 'Liste des Agences', description: 'Agences Omra agréées', icon: <Users className="w-4 h-4" /> },
  { href: '/comparatif-agences', label: 'Comparatif Agences', description: 'Comparez les agences', icon: <Star className="w-4 h-4" /> },
  { href: '/comparatif-visuel', label: 'Comparatif Visuel', description: 'Comparez visuellement', icon: <Star className="w-4 h-4" /> },
  { href: '/blog', label: 'Blog Omra & Hajj', description: 'Conseils et guides', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/prayer-times', label: 'Horaires de Prière', description: 'Heures de prière', icon: <Calendar className="w-4 h-4" /> },
  { href: '/islamic-calendar', label: 'Calendrier Islamique', description: 'Calendrier Hijri', icon: <Calendar className="w-4 h-4" /> },
  { href: '/ramadan-hajj-dates', label: 'Dates Ramadan & Hajj 2027', description: 'Dates 2026-2028', icon: <Calendar className="w-4 h-4" /> },
  { href: '/discussions', label: 'Forum Discussions', description: 'Communauté de pèlerins', icon: <Users className="w-4 h-4" /> },
  { href: '/about', label: 'À Propos', description: 'Notre mission', icon: <Users className="w-4 h-4" /> },
  { href: '/contact', label: 'Contact', description: 'Nous contacter', icon: <MapPin className="w-4 h-4" /> },
];

const relatedLinksMap: Record<string, string[]> = {
  '/': ['/meilleure-agence-omra', '/prix-omra-2026', '/conditions-omra', '/quand-partir-omra'],
  '/hajj': ['/hajj-2027', '/guide-hajj-4-ecoles', '/meilleure-agence-omra', '/ramadan-hajj-dates'],
  '/hajj-2027': ['/guide-hajj-4-ecoles', '/hajj', '/ramadan-hajj-dates', '/meilleure-agence-omra'],
  '/guide-hajj-4-ecoles': ['/hajj-2027', '/hajj', '/ramadan-hajj-dates', '/rites-omra'],
  '/meilleure-agence-omra': ['/comparatif-agences', '/agences-liste', '/prix-omra-2026', '/omra-tout-compris'],
  '/prix-omra-2026': ['/omra-tout-compris', '/meilleure-agence-omra', '/quand-partir-omra', '/comparatif-agences'],
  '/conditions-omra': ['/visa-omra-france', '/omra-femme-seule', '/quand-partir-omra', '/omra-debutant'],
  '/quand-partir-omra': ['/prix-omra-2026', '/omra-ramadan-2026', '/conditions-omra', '/omra-tout-compris'],
  '/omra-femme-seule': ['/conditions-omra', '/omra-tout-compris', '/meilleure-agence-omra', '/prix-omra-2026'],
  '/definition-omra': ['/conditions-omra', '/rites-omra', '/omra-debutant', '/quand-partir-omra'],
  '/omra-tout-compris': ['/prix-omra-2026', '/meilleure-agence-omra', '/comparatif-agences', '/agences-liste'],
  '/omra-debutant': ['/definition-omra', '/conditions-omra', '/rites-omra', '/visa-omra-france'],
  '/visa-omra-france': ['/conditions-omra', '/omra-debutant', '/guide-omra-pas-chere', '/quand-partir-omra'],
  '/guide-omra-pas-chere': ['/prix-omra-2026', '/quand-partir-omra', '/omra-tout-compris', '/meilleure-agence-omra'],
  '/rites-omra': ['/definition-omra', '/conditions-omra', '/omra-debutant', '/liste-bagages-omra'],
  '/omra-ramadan-2026': ['/10-derniers-jours-ramadan', '/quand-partir-omra', '/prix-omra-2026', '/omra-tout-compris'],
  '/10-derniers-jours-ramadan': ['/omra-ramadan-2026', '/quand-partir-omra', '/prix-omra-2026', '/omra-tout-compris'],
  '/omra-famille': ['/omra-enfants', '/omra-tout-compris', '/prix-omra-2026', '/meilleure-agence-omra'],
  '/omra-seniors': ['/conditions-omra', '/omra-tout-compris', '/prix-omra-2026', '/meilleure-agence-omra'],
  '/omra-enfants': ['/omra-famille', '/conditions-omra', '/omra-tout-compris', '/prix-omra-2026'],
  '/omra-badal': ['/definition-omra', '/conditions-omra', '/rites-omra', '/meilleure-agence-omra'],
  '/liste-bagages-omra': ['/conditions-omra', '/omra-debutant', '/rites-omra', '/omra-tout-compris'],
  '/agences-liste': ['/comparatif-agences', '/comparatif-visuel', '/', '/hajj'],
  '/comparatif-agences': ['/agences-liste', '/comparatif-visuel', '/', '/hajj'],
  '/comparatif-visuel': ['/agences-liste', '/comparatif-agences', '/', '/blog'],
  '/blog': ['/', '/hajj', '/discussions', '/prayer-times'],
  '/prayer-times': ['/islamic-calendar', '/ramadan-hajj-dates', '/blog', '/'],
  '/islamic-calendar': ['/prayer-times', '/ramadan-hajj-dates', '/blog', '/'],
  '/ramadan-hajj-dates': ['/islamic-calendar', '/prayer-times', '/blog', '/hajj'],
  '/discussions': ['/blog', '/', '/hajj', '/about'],
  '/about': ['/contact', '/', '/blog', '/discussions'],
  '/contact': ['/about', '/', '/blog', '/discussions'],
  '/search': ['/', '/hajj', '/agences-liste', '/blog'],
};

export const InternalLinks: React.FC<InternalLinksProps> = ({
  currentPage = '/',
  variant = 'related',
  className = '',
  maxLinks = 4,
  links: customLinks
}) => {
  const getRelevantLinks = (): InternalLink[] => {
    if (customLinks?.length) {
      return customLinks
        .filter(link => link.href !== currentPage)
        .slice(0, maxLinks);
    }

    let recommendedPaths = relatedLinksMap[currentPage];
    if (!recommendedPaths && currentPage.startsWith('/blog/')) {
      recommendedPaths = ['/', '/hajj', '/agences-liste', '/ramadan-hajj-dates', '/blog', '/comparatif-agences'];
    }
    if (!recommendedPaths) {
      recommendedPaths = ['/', '/hajj', '/blog', '/agences-liste'];
    }

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
