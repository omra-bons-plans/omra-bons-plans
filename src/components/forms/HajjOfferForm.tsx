import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Plane from 'lucide-react/dist/esm/icons/plane';
import Home from 'lucide-react/dist/esm/icons/home';
import Tent from 'lucide-react/dist/esm/icons/tent';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';
import Check from 'lucide-react/dist/esm/icons/check';
import Save from 'lucide-react/dist/esm/icons/save';
import X from 'lucide-react/dist/esm/icons/x';
import Upload from 'lucide-react/dist/esm/icons/upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getAgencyLogo, getAgencyNames } from '@/utils/agencyLogos';
import { useHotelPresets } from '@/hooks/useHotelPresets';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';

// Constants for Hajj form
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
  { value: 'egyptair', label: 'EgyptAir' },
  { value: 'royal_jordanian', label: 'Royal Jordanian' },
  { value: 'etihad', label: 'Etihad' },
  { value: 'flynas', label: 'Flynas' },
  { value: 'transavia', label: 'Transavia' },
  { value: 'kuwait_airways', label: 'Kuwait Airways' },
  { value: 'iat', label: 'IAT' },
];

interface HajjOfferFormData {
  agency_name: string;
  offer_url: string;
  departure_date: string;
  return_date: string;
  duration_nights: number;
  price_quad_eur: number;
  package_type: string;
  hotel_makkah: string;
  hotel_makkah_stars: number;
  hotel_medina: string;
  hotel_medina_stars: number;
  nusuk_code: string;
  camp_mina: string;
  half_board: boolean;
  departure_cities: string[];
  accommodation_zone: string;
  airline: string;
  is_recommended: boolean;
}

interface HajjOfferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const HajjOfferForm = ({ onSuccess, onCancel }: HajjOfferFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [openMakkahHotel, setOpenMakkahHotel] = useState(false);
  const [openMedinaHotel, setOpenMedinaHotel] = useState(false);

  const { hotels: makkahHotels, saveHotel: saveMakkahHotel } = useHotelPresets('makkah');
  const { hotels: medinaHotels, saveHotel: saveMedinaHotel } = useHotelPresets('medina');
  const { uploadImage, uploading } = useImageUpload('ad-images');

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le logo ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const [formData, setFormData] = useState<HajjOfferFormData>({
    agency_name: '',
    offer_url: '',
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
    camp_mina: '',
    half_board: false,
    departure_cities: [],
    accommodation_zone: 'A',
    airline: 'saudia',
    is_recommended: false,
  });

  // Auto-calculate nights when dates change
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

  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.agency_name || !formData.offer_url || !formData.departure_date || !formData.return_date) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
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

    if (!formData.hotel_makkah || !formData.hotel_medina) {
      toast({
        title: "Hôtels requis",
        description: "Veuillez renseigner les hôtels à Makkah et Médine",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const agencyUrl = getAgencyLogo(formData.agency_name) 
        ? `https://${formData.agency_name.toLowerCase().replace(/\s+/g, '')}.com`
        : normalizeUrl(formData.offer_url).split('/').slice(0, 3).join('/');

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
        camp_mina: formData.camp_mina || null,
        half_board: formData.half_board,
        departure_cities: formData.departure_cities,
        accommodation_zone: formData.accommodation_zone,
        airline: AIRLINES.find(a => a.value === formData.airline)?.label || formData.airline,
        is_recommended: formData.is_recommended,
        nusuk_code: formData.nusuk_code || null,
        status: 'active',
      };

      // Cast to any to handle new table before types are regenerated
      const { error } = await (supabase as any)
        .from('hajj_offers')
        .insert([offerData]);

      if (error) throw error;

      // Save hotel presets with the selected star ratings
      if (formData.hotel_makkah) {
        await saveMakkahHotel(formData.hotel_makkah, formData.hotel_makkah_stars);
      }
      if (formData.hotel_medina) {
        await saveMedinaHotel(formData.hotel_medina, formData.hotel_medina_stars);
      }

      toast({
        title: "✅ Offre Hajj ajoutée",
        description: "L'offre a été enregistrée avec succès",
      });

      // Reset form
      setFormData({
        agency_name: formData.agency_name,
        offer_url: '',
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
        camp_mina: '',
        half_board: false,
        departure_cities: [],
        accommodation_zone: 'A',
        airline: 'saudia',
        is_recommended: false,
      });
      setDateRange(undefined);

      onSuccess?.();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1️⃣ Informations agence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations de l'agence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agency_name">Nom de l'agence *</Label>
            <Select
              value={formData.agency_name}
              onValueChange={(value) => {
                setFormData({ ...formData, agency_name: value });
                const logo = getAgencyLogo(value);
                if (logo) setLogoPreview(logo);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une agence" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {getAgencyNames().map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer_url">Lien du site ou de la page de l'offre *</Label>
            <Input
              id="offer_url"
              type="text"
              value={formData.offer_url}
              onChange={(e) => setFormData({ ...formData, offer_url: e.target.value })}
              placeholder="exemple.com/offre-hajj"
            />
            <p className="text-xs text-muted-foreground">https:// sera ajouté automatiquement si nécessaire</p>
          </div>

          <div className="space-y-2">
            <Label>Logo de l'agence</Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-white">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center px-2">Ajouter logo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoSelect}
                  />
                </label>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2️⃣ Dates & durée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Dates & durée
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
                          {format(dateRange.from, 'dd MMM yyyy', { locale: fr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
                        </>
                      ) : (
                        format(dateRange.from, 'dd MMM yyyy', { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner les dates</span>
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_nights">Nombre de nuits total</Label>
              <Input
                id="duration_nights"
                type="number"
                min="1"
                value={formData.duration_nights || ''}
                onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || 0 })}
                placeholder="Calculé automatiquement"
              />
              <p className="text-xs text-muted-foreground">Calculé depuis les dates ou modifiable manuellement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3️⃣ Prix */}
      <Card>
        <CardHeader>
          <CardTitle>Prix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="price_quad_eur">Prix chambre quadruple (EUR) *</Label>
            <Input
              id="price_quad_eur"
              type="number"
              value={formData.price_quad_eur || ''}
              onChange={(e) => setFormData({ ...formData, price_quad_eur: parseFloat(e.target.value) || 0 })}
              placeholder="Prix par personne en euros"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4️⃣ Type de package */}
      <Card>
        <CardHeader>
          <CardTitle>Type de package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="package_type">Type de package *</Label>
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
        </CardContent>
      </Card>

      {/* 5️⃣ Hébergement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Hébergement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hôtel à Makkah *</Label>
              <Popover open={openMakkahHotel} onOpenChange={setOpenMakkahHotel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.hotel_makkah || "Sélectionner ou taper..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un hôtel..."
                      value={formData.hotel_makkah}
                      onValueChange={(value) => setFormData({ ...formData, hotel_makkah: value })}
                    />
                    <CommandEmpty>
                      <div className="p-2 text-sm">Taper pour ajouter: "{formData.hotel_makkah}"</div>
                    </CommandEmpty>
                    <CommandGroup>
                      {makkahHotels.map((hotel) => (
                        <CommandItem
                          key={hotel.id}
                          value={hotel.hotel_name}
                          onSelect={(value) => {
                            setFormData({ 
                              ...formData, 
                              hotel_makkah: value,
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
            </div>

            <div className="space-y-2">
              <Label>Étoiles Makkah *</Label>
              <Select
                value={formData.hotel_makkah_stars.toString()}
                onValueChange={(value) => setFormData({ ...formData, hotel_makkah_stars: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ⭐</SelectItem>
                  <SelectItem value="2">2 ⭐⭐</SelectItem>
                  <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hôtel à Médine *</Label>
              <Popover open={openMedinaHotel} onOpenChange={setOpenMedinaHotel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.hotel_medina || "Sélectionner ou taper..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un hôtel..."
                      value={formData.hotel_medina}
                      onValueChange={(value) => setFormData({ ...formData, hotel_medina: value })}
                    />
                    <CommandEmpty>
                      <div className="p-2 text-sm">Taper pour ajouter: "{formData.hotel_medina}"</div>
                    </CommandEmpty>
                    <CommandGroup>
                      {medinaHotels.map((hotel) => (
                        <CommandItem
                          key={hotel.id}
                          value={hotel.hotel_name}
                          onSelect={(value) => {
                            setFormData({ 
                              ...formData, 
                              hotel_medina: value,
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
            </div>

            <div className="space-y-2">
              <Label>Étoiles Médine *</Label>
              <Select
                value={formData.hotel_medina_stars.toString()}
                onValueChange={(value) => setFormData({ ...formData, hotel_medina_stars: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ⭐</SelectItem>
                  <SelectItem value="2">2 ⭐⭐</SelectItem>
                  <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6️⃣ Camp Mina */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tent className="h-5 w-5" />
            Camp Mina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Nom du camp</Label>
            <Select
              value={formData.camp_mina}
              onValueChange={(value) => setFormData({ ...formData, camp_mina: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un camp" />
              </SelectTrigger>
              <SelectContent>
                {MINA_CAMPS.map((camp) => (
                  <SelectItem key={camp.value} value={camp.value}>{camp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Code Nusuk */}
      <Card>
        <CardHeader>
          <CardTitle>Code Nusuk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="nusuk_code">Code Nusuk (optionnel)</Label>
            <Input
              id="nusuk_code"
              placeholder="Ex: NSK-12345"
              value={formData.nusuk_code}
              onChange={(e) => setFormData({ ...formData, nusuk_code: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Entrez le code Nusuk fourni par l'agence pour cette offre
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 7️⃣ Pension */}
      <Card>
        <CardHeader>
          <CardTitle>Pension</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="half_board" className="cursor-pointer">Demi-pension</Label>
            <Switch
              id="half_board"
              checked={formData.half_board}
              onCheckedChange={(checked) => setFormData({ ...formData, half_board: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 8️⃣ Villes de départ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Villes de départ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {DEPARTURE_CITIES.map((city) => {
              const isSelected = formData.departure_cities.includes(city.value);
              return (
                <Badge
                  key={city.value}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleCityToggle(city.value)}
                >
                  {isSelected && <Check className="mr-1 h-3 w-3" />}
                  {city.label}
                </Badge>
              );
            })}
          </div>
          {formData.departure_cities.length === 0 && (
            <p className="text-sm text-destructive">* Sélectionnez au moins une ville</p>
          )}
        </CardContent>
      </Card>

      {/* 9️⃣ Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Zone d'hébergement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Zone *</Label>
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
        </CardContent>
      </Card>

      {/* 🔟 Transport aérien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Transport aérien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Compagnie aérienne *</Label>
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
        </CardContent>
      </Card>

      {/* ⭐ Mise en avant */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <Checkbox
              id="is_recommended"
              checked={formData.is_recommended}
              onCheckedChange={(checked) => setFormData({ ...formData, is_recommended: checked as boolean })}
            />
            <Label htmlFor="is_recommended" className="cursor-pointer flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span>Marquer comme offre recommandée</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
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
              Enregistrer l'offre Hajj
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default HajjOfferForm;
