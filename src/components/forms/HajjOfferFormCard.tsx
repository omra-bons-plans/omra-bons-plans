import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import Plane from 'lucide-react/dist/esm/icons/plane';
import Home from 'lucide-react/dist/esm/icons/home';
import Tent from 'lucide-react/dist/esm/icons/tent';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';
import Check from 'lucide-react/dist/esm/icons/check';
import Save from 'lucide-react/dist/esm/icons/save';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useHotelPresets } from '@/hooks/useHotelPresets';
import { cn } from '@/lib/utils';

const PACKAGE_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'premium_shifting', label: 'Premium Shifting' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'luxury_shifting', label: 'Luxury Shifting' },
];

const MINA_CAMPS = [
  { value: 'mouassim', label: 'Camp Mouassim' },
  { value: 'majar_al_kabsh', label: 'Camp Majar Al Kabsh' },
];

const DEPARTURE_CITIES = [
  { value: 'allemagne', label: 'Allemagne' },
  { value: 'amsterdam', label: 'Amsterdam' },
  { value: 'belgique', label: 'Belgique' },
  { value: 'bruxelles', label: 'Bruxelles' },
  { value: 'frankfurt', label: 'Frankfurt' },
  { value: 'geneve', label: 'Genève' },
  { value: 'londres', label: 'Londres' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'montreal', label: 'Montréal' },
  { value: 'paris', label: 'Paris' },
];

const ACCOMMODATION_ZONES = [
  { value: 'A', label: 'A — Proche Haram' },
  { value: 'M', label: 'M — Azizya' },
  { value: 'C', label: 'C — Accessible' },
];

const AIRLINES = [
  { value: 'sans_vol', label: 'Sans vol' },
  { value: 'ajet', label: 'AJET' },
  { value: 'saudia', label: 'Saudia Airlines' },
  { value: 'qatar_airways', label: 'Qatar Airways' },
  { value: 'egyptair', label: 'EgyptAir' },
  { value: 'royal_jordanian', label: 'Royal Jordanian' },
  { value: 'etihad', label: 'Etihad' },
  { value: 'flynas', label: 'Flynas' },
  { value: 'transavia', label: 'Transavia' },
  { value: 'kuwait_airways', label: 'Kuwait Airways' },
  { value: 'iat', label: 'IAT' },
];

interface HajjOfferFormCardProps {
  index: number;
  initialData: {
    agency_name: string;
    offer_url: string;
  };
  logoPreview: string | null;
  onRemove: () => void;
  onSave: () => void;
}

export const HajjOfferFormCard = ({
  index,
  initialData,
  logoPreview,
  onRemove,
  onSave
}: HajjOfferFormCardProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [openMakkahHotel, setOpenMakkahHotel] = useState(false);
  const [openMedinaHotel, setOpenMedinaHotel] = useState(false);

  const { hotels: makkahHotels, saveHotel: saveMakkahHotel } = useHotelPresets('makkah');
  const { hotels: medinaHotels, saveHotel: saveMedinaHotel } = useHotelPresets('medina');

  const [formData, setFormData] = useState({
    agency_name: initialData.agency_name,
    offer_url: initialData.offer_url,
    departure_date: '',
    return_date: '',
    duration_nights: 0,
    price_quad_eur: 0,
    package_type: 'standard',
    hotel_makkah: '',
    hotel_makkah_stars: 4,
    hotel_medina: '',
    hotel_medina_stars: 4,
    nusuk_code: '',
    camp_mina: [] as string[],
    half_board: false,
    departure_cities: [] as string[],
    accommodation_zone: 'A',
    airline: 'saudia',
    is_recommended: false,
  });

  useEffect(() => {
    if (dateRange?.from) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      setFormData(prev => ({ ...prev, departure_date: startDate }));

      if (dateRange.to) {
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        setFormData(prev => ({ ...prev, return_date: endDate }));

        const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, duration_nights: nights }));
      }
    }
  }, [dateRange]);

  const handleCityToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      departure_cities: prev.departure_cities.includes(city)
        ? prev.departure_cities.filter(c => c !== city)
        : [...prev.departure_cities, city]
    }));
  };

  const handleCampToggle = (camp: string) => {
    setFormData(prev => ({
      ...prev,
      camp_mina: prev.camp_mina.includes(camp)
        ? prev.camp_mina.filter(c => c !== camp)
        : [...prev.camp_mina, camp]
    }));
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departure_date || !formData.return_date || !formData.price_quad_eur) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir les dates et le prix",
        variant: "destructive"
      });
      return;
    }

    if (formData.departure_cities.length === 0) {
      toast({
        title: "Villes de départ requises",
        description: "Veuillez sélectionner au moins une ville de départ",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const agencyUrl = `https://${formData.agency_name.toLowerCase().replace(/\s+/g, '')}.com`;

      const offerData = {
        agency_name: formData.agency_name,
        agency_url: agencyUrl,
        offer_url: normalizeUrl(formData.offer_url),
        departure_date: formData.departure_date,
        return_date: formData.return_date,
        duration_nights: formData.duration_nights || null,
        price_quad_eur: formData.price_quad_eur,
        package_type: formData.package_type,
        hotel_makkah: formData.hotel_makkah,
        hotel_medina: formData.hotel_medina,
        camp_mina: formData.camp_mina.length > 0 ? formData.camp_mina.join(', ') : null,
        half_board: formData.half_board,
        departure_cities: formData.departure_cities,
        accommodation_zone: formData.accommodation_zone,
        airline: AIRLINES.find(a => a.value === formData.airline)?.label || formData.airline,
        is_recommended: formData.is_recommended,
        nusuk_code: formData.nusuk_code || null,
        status: 'active',
      };

      const { error } = await (supabase as any)
        .from('hajj_offers')
        .insert([offerData]);

      if (error) throw error;

      if (formData.hotel_makkah) {
        await saveMakkahHotel(formData.hotel_makkah, formData.hotel_makkah_stars);
      }
      if (formData.hotel_medina) {
        await saveMedinaHotel(formData.hotel_medina, formData.hotel_medina_stars);
      }

      toast({
        title: "✅ Offre Hajj ajoutée",
        description: `L'offre #${index + 1} a été enregistrée avec succès`,
      });

      onSave();
      onRemove();
    } catch (error: any) {
      console.error('Error saving Hajj offer:', error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible d'enregistrer l'offre",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border-t-4 border-primary/20 pt-6 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offre Hajj #{index + 1}</h2>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </Button>
      </div>

      {/* Agence info */}
      {logoPreview && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <img
                src={logoPreview}
                alt="Logo agence"
                className="w-20 h-20 object-contain p-2 border rounded-lg bg-white"
              />
              <div>
                <p className="font-semibold">{formData.agency_name}</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{formData.offer_url}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dates & Prix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Dates & Prix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dates aller / retour *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd MMM', { locale: fr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
                        </>
                      ) : (
                        format(dateRange.from, 'dd MMM yyyy', { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formData.duration_nights > 0 && (
                <p className="text-sm text-muted-foreground">{formData.duration_nights} nuits</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Prix chambre quad (EUR) *</Label>
              <Input
                type="number"
                value={formData.price_quad_eur || ''}
                onChange={(e) => setFormData({ ...formData, price_quad_eur: parseFloat(e.target.value) || 0 })}
                placeholder="5500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package & Hébergement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Package & Hébergement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de package</Label>
              <Select
                value={formData.package_type}
                onValueChange={(value) => setFormData({ ...formData, package_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zone d'hébergement</Label>
              <Select
                value={formData.accommodation_zone}
                onValueChange={(value) => setFormData({ ...formData, accommodation_zone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_ZONES.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hotels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hôtel Makkah</Label>
              <Popover open={openMakkahHotel} onOpenChange={setOpenMakkahHotel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.hotel_makkah || "Sélectionner"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher..."
                      value={formData.hotel_makkah}
                      onValueChange={(value) => setFormData({ ...formData, hotel_makkah: value })}
                    />
                    <CommandEmpty>
                      <Button variant="ghost" className="w-full" onClick={() => setOpenMakkahHotel(false)}>
                        Utiliser "{formData.hotel_makkah}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {makkahHotels.map((hotel) => (
                        <CommandItem
                          key={hotel.hotel_name}
                          value={hotel.hotel_name}
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              hotel_makkah: hotel.hotel_name,
                              hotel_makkah_stars: hotel.stars || 4
                            });
                            setOpenMakkahHotel(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", formData.hotel_makkah === hotel.hotel_name ? "opacity-100" : "opacity-0")} />
                          {hotel.hotel_name} ({hotel.stars}⭐)
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Select
                value={String(formData.hotel_makkah_stars)}
                onValueChange={(v) => setFormData({ ...formData, hotel_makkah_stars: parseInt(v) })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}⭐</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hôtel Médine</Label>
              <Popover open={openMedinaHotel} onOpenChange={setOpenMedinaHotel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.hotel_medina || "Sélectionner"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher..."
                      value={formData.hotel_medina}
                      onValueChange={(value) => setFormData({ ...formData, hotel_medina: value })}
                    />
                    <CommandEmpty>
                      <Button variant="ghost" className="w-full" onClick={() => setOpenMedinaHotel(false)}>
                        Utiliser "{formData.hotel_medina}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {medinaHotels.map((hotel) => (
                        <CommandItem
                          key={hotel.hotel_name}
                          value={hotel.hotel_name}
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              hotel_medina: hotel.hotel_name,
                              hotel_medina_stars: hotel.stars || 4
                            });
                            setOpenMedinaHotel(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", formData.hotel_medina === hotel.hotel_name ? "opacity-100" : "opacity-0")} />
                          {hotel.hotel_name} ({hotel.stars}⭐)
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Select
                value={String(formData.hotel_medina_stars)}
                onValueChange={(v) => setFormData({ ...formData, hotel_medina_stars: parseInt(v) })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}⭐</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camp Mina & Transport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tent className="h-5 w-5" />
            Camp & Transport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Camp Mina (sélection multiple)</Label>
              <div className="flex flex-wrap gap-2">
                {MINA_CAMPS.map((camp) => {
                  const isSelected = formData.camp_mina.includes(camp.value);
                  return (
                    <Badge
                      key={camp.value}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleCampToggle(camp.value)}
                    >
                      {camp.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Compagnie aérienne</Label>
              <Select
                value={formData.airline}
                onValueChange={(value) => setFormData({ ...formData, airline: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AIRLINES.map((airline) => (
                    <SelectItem key={airline.value} value={airline.value}>{airline.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Code Nusuk</Label>
            <Input
              value={formData.nusuk_code}
              onChange={(e) => setFormData({ ...formData, nusuk_code: e.target.value })}
              placeholder="Ex: HAJJ2025-XXX"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`half_board_${index}`}
              checked={formData.half_board}
              onCheckedChange={(checked) => setFormData({ ...formData, half_board: checked as boolean })}
            />
            <Label htmlFor={`half_board_${index}`}>Demi-pension incluse</Label>
          </div>
        </CardContent>
      </Card>

      {/* Villes de départ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Villes de départ *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DEPARTURE_CITIES.map((city) => (
              <Badge
                key={city.value}
                variant={formData.departure_cities.includes(city.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCityToggle(city.value)}
              >
                {city.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandé */}
      <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <Checkbox
          id={`recommended_${index}`}
          checked={formData.is_recommended}
          onCheckedChange={(checked) => setFormData({ ...formData, is_recommended: checked as boolean })}
        />
        <Label htmlFor={`recommended_${index}`} className="cursor-pointer flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span>Offre recommandée</span>
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onRemove}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default HajjOfferFormCard;
