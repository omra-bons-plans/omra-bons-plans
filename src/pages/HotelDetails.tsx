import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Euro from 'lucide-react/dist/esm/icons/euro';
import Wifi from 'lucide-react/dist/esm/icons/wifi';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { hotelsData, getHotelImage } from '@/utils/hotelsData';

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </span>
  );
}

function BookingScore({ score }: { score: number }) {
  const color = score >= 9 ? 'bg-green-600' : score >= 8 ? 'bg-blue-600' : score >= 7 ? 'bg-yellow-600' : 'bg-orange-600';
  const label = score >= 9 ? 'Exceptionnel' : score >= 8.5 ? 'Superbe' : score >= 8 ? 'Très bien' : score >= 7 ? 'Bien' : 'Correct';
  return (
    <div className="flex items-center gap-3">
      <span className={`${color} text-white text-2xl font-bold px-3 py-1.5 rounded-lg`}>
        {score.toFixed(1)}
      </span>
      <div>
        <p className="font-semibold text-base">{label}</p>
        <p className="text-xs text-muted-foreground">Note Booking.com</p>
      </div>
    </div>
  );
}

function DistanceBadge({ metres, ville }: { metres: number; ville: string }) {
  const mosque = ville === 'La Mecque' ? 'Masjid al-Haram' : 'Masjid Nabawi';
  const label = metres < 1000 ? `${metres} m` : `${(metres / 1000).toFixed(1)} km`;
  const color = metres <= 300 ? 'bg-green-100 text-green-800 border-green-300' :
                metres <= 800 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                metres <= 2000 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                'bg-orange-100 text-orange-800 border-orange-300';
  const note = metres <= 300 ? 'Très proche' : metres <= 800 ? 'Proche' : metres <= 2000 ? 'Accessible' : 'Éloigné';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${color}`}>
      <MapPin className="h-4 w-4" />
      <span>{label} du {mosque}</span>
      <span className="opacity-70">· {note}</span>
    </div>
  );
}

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const hotel = hotelsData.find(h => h.id === hotelId);

  if (!hotel) {
    navigate('/les-hotels', { replace: true });
    return null;
  }

  const mosqueeLabel = hotel.ville === 'La Mecque' ? 'Masjid al-Haram (La Mecque)' : 'Masjid Nabawi (Médine)';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${hotel.name} ${hotel.ville} — Avis, Distance, Prix 2026 | Omra Bons Plans`}
        description={`${hotel.name} (${hotel.stars}★) à ${hotel.ville} : ${hotel.distanceHaramM < 1000 ? hotel.distanceHaramM + 'm' : (hotel.distanceHaramM / 1000).toFixed(1) + 'km'} du Haram · Note Booking ${hotel.bookingRating}/10 · Prix dès ${hotel.prixMoyenNuit}€/nuit. Points forts, points faibles et conseils.`}
        canonical={`https://omrabonsplans.fr/hotel/${hotel.id}`}
        keywords={`${hotel.name.toLowerCase()}, hôtel ${hotel.ville.toLowerCase()} omra, ${hotel.quartier.toLowerCase()} makkah, hébergement omra 2026`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": hotel.name,
          "url": hotel.url,
          "starRating": { "@type": "Rating", "ratingValue": hotel.stars },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": hotel.bookingRating,
            "reviewCount": hotel.bookingReviews,
            "bestRating": "10",
            "worstRating": "1"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": hotel.ville,
            "addressCountry": "SA"
          },
          "description": hotel.description,
          "priceRange": `€${hotel.prixMoyenNuit}+`
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <SEOBreadcrumb
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Les Hôtels', url: '/les-hotels' },
            { name: hotel.name, url: `/hotel/${hotel.id}` },
          ]}
        />

        <Button variant="ghost" onClick={() => navigate('/les-hotels')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des hôtels
        </Button>

        {/* Hero image */}
        <div className="mb-6 rounded-xl overflow-hidden h-64 sm:h-80 relative">
          <img
            src={getHotelImage(hotel)}
            alt={`${hotel.name} — hôtel Omra ${hotel.ville}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1';
                img.src = hotel.ville === 'La Mecque'
                  ? 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80'
                  : 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge className="bg-black/60 text-white border-0 text-sm px-3 py-1 backdrop-blur-sm">
              {hotel.ville === 'La Mecque' ? '🕋' : '🕌'} {hotel.ville}
            </Badge>
            <Badge className="bg-black/60 text-white border-0 text-sm px-3 py-1 backdrop-blur-sm">{hotel.quartier}</Badge>
          </div>
        </div>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{hotel.name}</h1>
          <StarRow count={hotel.stars} />
          <p className="text-muted-foreground mt-3 text-base max-w-2xl">{hotel.description}</p>
        </header>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {hotel.distanceHaramM < 1000
                  ? `${hotel.distanceHaramM} m`
                  : `${(hotel.distanceHaramM / 1000).toFixed(1)} km`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Distance à la Mosquée</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="flex justify-center mb-2">
                <span className="bg-blue-600 text-white text-2xl font-bold px-3 py-0.5 rounded">
                  {hotel.bookingRating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{hotel.bookingReviews.toLocaleString('fr-FR')} avis Booking.com</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <Euro className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{hotel.prixMoyenNuit}€</p>
              <p className="text-xs text-muted-foreground mt-1">Prix moyen / nuit (hors Ramadan)</p>
            </CardContent>
          </Card>
        </div>

        {/* Distance visuelle */}
        <div className="mb-8">
          <DistanceBadge metres={hotel.distanceHaramM} ville={hotel.ville} />
          <p className="text-sm text-muted-foreground mt-2">
            Distance à pied jusqu'au {mosqueeLabel}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Points forts */}
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                Points Forts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {hotel.pointsForts.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Points faibles */}
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <TrendingDown className="h-5 w-5" />
                Points d'Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {hotel.pointsFaibles.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold mt-0.5">⚠</span>
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Équipements */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Équipements & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map(a => (
                  <Badge key={a} variant="secondary" className="text-sm">{a}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Note Booking détaillée */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Note Booking.com</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingScore score={hotel.bookingRating} />
            <p className="text-sm text-muted-foreground mt-3">
              Basée sur {hotel.bookingReviews.toLocaleString('fr-FR')} avis de voyageurs vérifiés.
              La note tient compte de la propreté, la localisation, le personnel, les commodités et le rapport qualité-prix.
            </p>
          </CardContent>
        </Card>

        {/* Prix & réservation */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle>Tarifs 2026</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Basse saison (Été islamique)</span>
              <span className="font-semibold">{hotel.prixMoyenNuit}€ / nuit</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Haute saison (Hiver / vacances)</span>
              <span className="font-semibold">{Math.round(hotel.prixMoyenNuit * 1.5)}€ / nuit</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Ramadan (10 derniers jours)</span>
              <span className="font-semibold text-orange-600">{Math.round(hotel.prixMoyenNuit * 2.5)}€ / nuit</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              * Prix indicatifs par chambre et par nuit. Les tarifs varient selon la disponibilité et la période.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hotel.url && (
            <Button asChild className="flex-1">
              <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir le site officiel
              </a>
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={() => navigate('/les-hotels')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tous les hôtels
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/comparateur-omra-france')}>
            Comparer les offres Omra
          </Button>
        </div>
      </div>
    </div>
  );
}
