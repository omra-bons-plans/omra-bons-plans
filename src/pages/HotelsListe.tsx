import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { hotelsData, HotelData, getHotelImage } from '@/utils/hotelsData';

const STAR_COLORS: Record<number, string> = {
  5: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  4: 'bg-blue-100 text-blue-800 border-blue-300',
  3: 'bg-green-100 text-green-800 border-green-300',
  2: 'bg-gray-100 text-gray-700 border-gray-300',
  1: 'bg-gray-100 text-gray-600 border-gray-200',
};

function StarRating({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </span>
  );
}

function HotelCard({ hotel }: { hotel: HotelData }) {
  const navigate = useNavigate();
  const distanceLabel =
    hotel.distanceHaramM < 1000
      ? `${hotel.distanceHaramM} m`
      : `${(hotel.distanceHaramM / 1000).toFixed(1)} km`;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border hover:border-primary/30 overflow-hidden"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
    >
      {/* Image */}
      <div className="h-40 overflow-hidden relative">
        <img
          src={getHotelImage(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset.fallback) {
              img.dataset.fallback = '1';
              img.src = hotel.ville === 'La Mecque'
                ? 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=75'
                : 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=600&q=75';
            }
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={`text-xs ${STAR_COLORS[hotel.stars] || STAR_COLORS[3]} backdrop-blur-sm`}>
            {hotel.stars}★
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-base leading-tight truncate">{hotel.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{hotel.quartier}</p>
        </div>

        {/* Stars visual */}
        <StarRating count={hotel.stars} />

        {/* Distance */}
        <div className="flex items-center gap-1.5 mt-2.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{distanceLabel} de la Mosquée</span>
        </div>

        {/* Booking rating */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              {hotel.bookingRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              Booking.com · {hotel.bookingReviews.toLocaleString('fr-FR')} avis
            </span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {hotel.prixMoyenNuit}€<span className="text-xs font-normal text-muted-foreground">/nuit</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HotelsListe() {
  const [search, setSearch] = useState('');
  const [filterVille, setFilterVille] = useState<'all' | 'La Mecque' | 'Médine'>('all');
  const [filterStars, setFilterStars] = useState<number | null>(null);

  const filtered = hotelsData.filter(h => {
    if (filterVille !== 'all' && h.ville !== filterVille) return false;
    if (filterStars !== null && h.stars !== filterStars) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.quartier.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const mecca = filtered.filter(h => h.ville === 'La Mecque').sort((a, b) => a.distanceHaramM - b.distanceHaramM);
  const medina = filtered.filter(h => h.ville === 'Médine').sort((a, b) => a.distanceHaramM - b.distanceHaramM);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Hôtels Omra 2026 : La Mecque & Médine — Guide Complet"
        description="Tous les hôtels pour votre Omra 2026 : La Mecque et Médine. Distance au Haram, note Booking, prix par nuit, points forts et faibles. Comparez et choisissez."
        canonical="https://omrabonsplans.fr/les-hotels"
        keywords="hôtels omra la mecque, hôtels médine, hébergement omra 2026, hotel haram, hotel masjid nabawi"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <SEOBreadcrumb
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Les Hôtels Omra', url: '/les-hotels' },
          ]}
        />

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hôtels Omra 2026 — La Mecque & Médine
          </h1>
          <p className="text-muted-foreground text-lg">
            {hotelsData.length} hôtels référencés · Distance au Haram, note Booking, prix et avis
          </p>
        </header>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un hôtel…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'La Mecque', 'Médine'] as const).map(v => (
              <Button
                key={v}
                variant={filterVille === v ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterVille(v)}
              >
                {v === 'all' ? 'Toutes les villes' : v}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {[5, 4, 3].map(s => (
              <Button
                key={s}
                variant={filterStars === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStars(filterStars === s ? null : s)}
              >
                {s}★
              </Button>
            ))}
          </div>
        </div>

        {/* La Mecque */}
        {(filterVille === 'all' || filterVille === 'La Mecque') && mecca.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">🕋 La Mecque</h2>
              <Badge variant="secondary">{mecca.length} hôtels</Badge>
              <span className="text-sm text-muted-foreground">Triés par distance au Masjid al-Haram</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mecca.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </section>
        )}

        {/* Médine */}
        {(filterVille === 'all' || filterVille === 'Médine') && medina.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">🕌 Médine</h2>
              <Badge variant="secondary">{medina.length} hôtels</Badge>
              <span className="text-sm text-muted-foreground">Triés par distance au Masjid Nabawi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {medina.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Aucun hôtel ne correspond à votre recherche.</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setFilterVille('all'); setFilterStars(null); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
