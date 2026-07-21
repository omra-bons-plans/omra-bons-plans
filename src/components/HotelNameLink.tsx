import { ExternalLink } from 'lucide-react';
import { useHotelUrlMap, type HotelCity } from '@/hooks/useHotelUrlMap';

interface HotelNameLinkProps {
  name: string;
  city: HotelCity;
  className?: string;
}

/**
 * Affiche le nom de l'hôtel. Si un lien vers le site officiel a été enregistré
 * dans l'admin (hotel_presets.website_url), il est rendu cliquable.
 */
const HotelNameLink = ({ name, city, className = '' }: HotelNameLinkProps) => {
  const { getUrl } = useHotelUrlMap();
  const url = getUrl(name, city);

  if (!url) {
    return <span className={className}>{name}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 text-primary hover:underline ${className}`}
      title={`Voir le site officiel de ${name}`}
    >
      <span>{name}</span>
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
};

export default HotelNameLink;
