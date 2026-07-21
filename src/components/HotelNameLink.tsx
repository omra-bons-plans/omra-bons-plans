import { ExternalLink } from 'lucide-react';
import { useHotelUrlMap, type HotelCity } from '@/hooks/useHotelUrlMap';

interface HotelNameLinkProps {
  name: string;
  city: HotelCity;
  className?: string;
}

/**
 * Affiche le nom de l'hôtel suivi d'un petit bouton "site officiel"
 * si un lien a été enregistré dans l'admin (hotel_presets.website_url).
 */
const HotelNameLink = ({ name, city, className = '' }: HotelNameLinkProps) => {
  const { getUrl } = useHotelUrlMap();
  const url = getUrl(name, city);

  if (!url) {
    return <span className={className}>{name}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      <span>{name}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-medium leading-none transition-colors border border-primary/20"
        title={`Voir le site officiel de ${name}`}
        aria-label={`Site officiel de ${name}`}
      >
        <ExternalLink className="h-3 w-3" />
        <span>Site</span>
      </a>
    </span>
  );
};

export default HotelNameLink;
