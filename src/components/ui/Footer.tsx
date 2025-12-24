import { Link } from 'react-router-dom';
import { Search, Star, Users, BookOpen, Calendar, Clock, MessageCircle, Mail, Info, BarChart3, Heart } from 'lucide-react';

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
              <Link to="/blog/general/les-10-derniers-jours-du-ramadan-2026" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                10 Derniers Jours Ramadan 2026
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
