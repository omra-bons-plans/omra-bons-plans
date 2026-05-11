import { Link } from 'react-router-dom';
// ⚡ PERFORMANCE: Individual icon imports to reduce bundle size
import Search from 'lucide-react/dist/esm/icons/search';
import Star from 'lucide-react/dist/esm/icons/star';
import Users from 'lucide-react/dist/esm/icons/users';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Clock from 'lucide-react/dist/esm/icons/clock';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Info from 'lucide-react/dist/esm/icons/info';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Heart from 'lucide-react/dist/esm/icons/heart';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 border-t bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Comparateur */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Comparateur
            </h3>
            <nav className="space-y-2" aria-label="Navigation Comparateur">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comparateur Omra
              </Link>
              <Link to="/bons-plans" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Bons Plans
              </Link>
              <Link to="/favoris" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mes Favoris
              </Link>
              <Link to="/search" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recherche
              </Link>
            </nav>
          </div>
          
          {/* Agences */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Agences
            </h3>
            <nav className="space-y-2" aria-label="Navigation Agences">
              <Link to="/agences-liste" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Liste des Agences
              </Link>
              <Link to="/comparatif-agences" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comparatif Détaillé
              </Link>
              <Link to="/comparatif-visuel" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comparatif Visuel
              </Link>
            </nav>
          </div>
          
          {/* Outils Islamiques */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Outils Islamiques
            </h3>
            <nav className="space-y-2" aria-label="Navigation Outils Islamiques">
              <Link to="/prayer-times" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Horaires de Prière
              </Link>
              <Link to="/islamic-calendar" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Calendrier Islamique
              </Link>
              <Link to="/ramadan-hajj-dates" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dates Ramadan & Hajj
              </Link>
            </nav>
          </div>
          
          {/* Informations */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Informations
            </h3>
            <nav className="space-y-2" aria-label="Navigation Informations">
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/discussions" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discussions
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                À Propos
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Départ par ville */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            Omra par ville de départ
          </h3>
          <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Omra par ville">
            {[
              { slug: 'paris', nom: 'Paris' },
              { slug: 'lyon', nom: 'Lyon' },
              { slug: 'marseille', nom: 'Marseille' },
              { slug: 'toulouse', nom: 'Toulouse' },
              { slug: 'lille', nom: 'Lille' },
              { slug: 'bordeaux', nom: 'Bordeaux' },
              { slug: 'nice', nom: 'Nice' },
              { slug: 'strasbourg', nom: 'Strasbourg' },
              { slug: 'nantes', nom: 'Nantes' },
              { slug: 'rennes', nom: 'Rennes' },
              { slug: 'montpellier', nom: 'Montpellier' },
              { slug: 'grenoble', nom: 'Grenoble' },
              { slug: 'metz', nom: 'Metz' },
              { slug: 'clermont-ferrand', nom: 'Clermont-Ferrand' },
            ].map(({ slug, nom }) => (
              <Link
                key={slug}
                to={`/omra-depuis-${slug}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Omra depuis {nom}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 Omra Bons Plans - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
