import { useState, useEffect } from 'react';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useHotelPresets } from '@/hooks/useHotelPresets';
import { useAirlinePresets } from '@/hooks/useAirlinePresets';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Check from 'lucide-react/dist/esm/icons/check';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import Save from 'lucide-react/dist/esm/icons/save';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MONTHS = [
  { value: 'janvier', label: 'Janvier' },
  { value: 'fevrier', label: 'Février' },
  { value: 'mars', label: 'Mars' },
  { value: 'avril', label: 'Avril' },
  { value: 'mai', label: 'Mai' },
  { value: 'juin', label: 'Juin' },
  { value: 'juillet', label: 'Juillet' },
  { value: 'aout', label: 'Août' },
  { value: 'septembre', label: 'Septembre' },
  { value: 'octobre', label: 'Octobre' },
  { value: 'novembre', label: 'Novembre' },
  { value: 'decembre', label: 'Décembre' },
  { value: 'ramadan', label: 'Ramadan' },
];

const DEPARTURE_CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 
  'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bruxelles', 'Genève'
];

const FORMULA_TYPES = [
  { value: 'essentiel', label: 'Essentiel' },
  { value: 'confort', label: 'Confort' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

interface OmraOfferFormCardProps {
  index: number;
  initialData: any;
  offerType: 'omra' | 'hajj';
  logoPreview: string | null;
  onRemove: () => void;
  onSave: () => void;
}

export const OmraOfferFormCard = ({ 
  index, 
  initialData, 
  offerType, 
  logoPreview: initialLogoPreview,
  onRemove,
  onSave 
}: OmraOfferFormCardProps) => {
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload('ad-images');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoPreview);

  const [openMakkahHotel, setOpenMakkahHotel] = useState(false);
  const [openMedinaHotel, setOpenMedinaHotel] = useState(false);
  const [openAirline, setOpenAirline] = useState(false);

  const { hotels: makkahHotels, saveHotel: saveMakkahHotel } = useHotelPresets('makkah');
  const { hotels: medinaHotels, saveHotel: saveMedinaHotel } = useHotelPresets('medina');
  const { airlines: airlinePresets, saveAirline } = useAirlinePresets();

  // Mettre à jour formData quand dateRange change
  useEffect(() => {
    if (dateRange?.from) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      setFormData((prev: any) => ({ ...prev, date_start: startDate }));
      
      if (dateRange.to) {
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        setFormData((prev: any) => ({ ...prev, date_end: endDate }));
        
        const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        setFormData((prev: any) => ({ ...prev, duration_nights: nights }));
      }
    }
  }, [dateRange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price_eur || !formData.date_start || !formData.date_end) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let durationNights = formData.duration_nights;
      if (!durationNights && formData.date_start && formData.date_end) {
        const start = new Date(formData.date_start);
        const end = new Date(formData.date_end);
        durationNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }

      const sourceHash = `manual_${offerType}_${Date.now()}_${formData.agency_name.replace(/\s+/g, '_')}_${index}`;
      const offerTitle = `${offerType === 'omra' ? 'Omra' : 'Hajj'} ${formData.formula_type} - ${formData.month_departure}`;

      const offerData = {
        agency_name: formData.agency_name,
        agency_url: `https://${formData.agency_name.toLowerCase().replace(/\s+/g, '')}.com`,
        offer_title: offerTitle,
        offer_url: formData.offer_url,
        price_eur: formData.price_eur,
        month_departure: formData.month_departure,
        date_start: formData.date_start,
        date_end: formData.date_end,
        departure_city: formData.departure_city,
        formula_type: formData.formula_type,
        duration_nights: durationNights,
        makkah_nights: Math.floor(durationNights / 2),
        medina_nights: Math.ceil(durationNights / 2),
        hotel_makkah: `${formData.hotel_makkah} (${formData.hotel_makkah_stars}⭐)`,
        hotel_medinah: `${formData.hotel_medinah} (${formData.hotel_medinah_stars}⭐)`,
        flights_included: true,
        visa_included: formData.visa_included,
        guide_language: ['fr'],
        airline: formData.airline,
        is_recommended: formData.is_recommended,
        notes: offerType === 'hajj' 
          ? `Compagnie aérienne: ${formData.airline}\nDurée: ${formData.hajj_duration_type === 'court' ? 'Court séjour' : 'Long séjour'}`
          : `Compagnie aérienne: ${formData.airline}`,
        status: 'active',
        source_hash: sourceHash,
        scraped_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('omra_offers')
        .insert([offerData]);

      if (error) throw error;

      if (formData.hotel_makkah) {
        await saveMakkahHotel(formData.hotel_makkah, formData.hotel_makkah_stars);
      }
      if (formData.hotel_medinah) {
        await saveMedinaHotel(formData.hotel_medinah, formData.hotel_medinah_stars);
      }
      if (formData.airline) {
        await saveAirline(formData.airline);
      }

      toast({
        title: "Offre ajoutée",
        description: `L'offre ${offerType === 'omra' ? 'Omra' : 'Hajj'} a été ajoutée avec succès.`,
      });

      onSave();
      onRemove();

    } catch (error: any) {
      console.error('Error saving offer:', error);
      toast({
        title: "Erreur",
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
        <h2 className="text-2xl font-bold">Offre #{index + 1}</h2>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer ce formulaire
        </Button>
      </div>

      {/* Logo - Non éditable, juste affiché */}
      {logoPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Agence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={logoPreview}
                alt="Logo agence"
                className="w-24 h-24 object-contain p-2 border rounded-lg bg-white"
              />
              <div>
                <p className="font-semibold">{formData.agency_name}</p>
                <p className="text-sm text-muted-foreground">{formData.departure_city}</p>
                <p className="text-sm text-muted-foreground">{formData.month_departure}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détails du séjour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Détails du séjour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dates */}
            <div className="space-y-2">
              <Label>Dates du séjour *</Label>
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
                          {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                          {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                        </>
                      ) : (
                        format(dateRange.from, "dd MMM yyyy", { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner les dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              {dateRange?.from && dateRange?.to && (
                <p className="text-sm text-muted-foreground">
                  Durée: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nuits
                </p>
              )}
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <Label htmlFor={`price_${index}`}>Prix (EUR) *</Label>
              <Input
                id={`price_${index}`}
                type="number"
                step="0.01"
                value={formData.price_eur || ''}
                onChange={(e) => setFormData({ ...formData, price_eur: parseFloat(e.target.value) })}
                placeholder="2500"
                required
              />
            </div>

            {/* Formule */}
            <div className="space-y-2">
              <Label htmlFor={`formula_${index}`}>Formule *</Label>
              <Select
                value={formData.formula_type}
                onValueChange={(value) => setFormData({ ...formData, formula_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMULA_TYPES.map((formula) => (
                    <SelectItem key={formula.value} value={formula.value}>
                      {formula.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hôtels */}
      <Card>
        <CardHeader>
          <CardTitle>Hébergement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hôtel Makkah */}
            <div className="space-y-2">
              <Label>Hôtel à La Mecque</Label>
              <Popover open={openMakkahHotel} onOpenChange={setOpenMakkahHotel}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMakkahHotel}
                    className="w-full justify-between"
                  >
                    {formData.hotel_makkah || "Sélectionner ou saisir"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Rechercher ou saisir un hôtel..." 
                      value={formData.hotel_makkah}
                      onValueChange={(value) => setFormData({ ...formData, hotel_makkah: value })}
                    />
                    <CommandEmpty>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => {
                          setOpenMakkahHotel(false);
                        }}
                      >
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
                              hotel_makkah_stars: hotel.stars || 3
                            });
                            setOpenMakkahHotel(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.hotel_makkah === hotel.hotel_name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {hotel.hotel_name} ({hotel.stars}⭐)
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-sm">Étoiles:</Label>
                <Select
                  value={String(formData.hotel_makkah_stars)}
                  onValueChange={(value) => setFormData({ ...formData, hotel_makkah_stars: parseInt(value) })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <SelectItem key={stars} value={String(stars)}>
                        {stars}⭐
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hôtel Medina */}
            <div className="space-y-2">
              <Label>Hôtel à Médine</Label>
              <Popover open={openMedinaHotel} onOpenChange={setOpenMedinaHotel}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMedinaHotel}
                    className="w-full justify-between"
                  >
                    {formData.hotel_medinah || "Sélectionner ou saisir"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Rechercher ou saisir un hôtel..." 
                      value={formData.hotel_medinah}
                      onValueChange={(value) => setFormData({ ...formData, hotel_medinah: value })}
                    />
                    <CommandEmpty>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => {
                          setOpenMedinaHotel(false);
                        }}
                      >
                        Utiliser "{formData.hotel_medinah}"
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
                              hotel_medinah: hotel.hotel_name,
                              hotel_medinah_stars: hotel.stars || 3
                            });
                            setOpenMedinaHotel(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.hotel_medinah === hotel.hotel_name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {hotel.hotel_name} ({hotel.stars}⭐)
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-sm">Étoiles:</Label>
                <Select
                  value={String(formData.hotel_medinah_stars)}
                  onValueChange={(value) => setFormData({ ...formData, hotel_medinah_stars: parseInt(value) })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <SelectItem key={stars} value={String(stars)}>
                        {stars}⭐
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle>Transport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Compagnie aérienne</Label>
            <Popover open={openAirline} onOpenChange={setOpenAirline}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAirline}
                  className="w-full justify-between"
                >
                  {formData.airline || "Sélectionner ou saisir"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher ou saisir une compagnie..." 
                    value={formData.airline}
                    onValueChange={(value) => setFormData({ ...formData, airline: value })}
                  />
                  <CommandEmpty>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setOpenAirline(false);
                      }}
                    >
                      Utiliser "{formData.airline}"
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {airlinePresets.map((airline) => (
                      <CommandItem
                        key={airline.airline_name}
                        value={airline.airline_name}
                        onSelect={() => {
                          setFormData({ ...formData, airline: airline.airline_name });
                          setOpenAirline(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.airline === airline.airline_name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {airline.airline_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`visa_${index}`}
              checked={formData.visa_included}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, visa_included: checked as boolean })
              }
            />
            <Label htmlFor={`visa_${index}`} className="cursor-pointer">
              Visa inclus
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`recommended_${index}`}
              checked={formData.is_recommended}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_recommended: checked as boolean })
              }
            />
            <Label htmlFor={`recommended_${index}`} className="cursor-pointer flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span>Marquer comme offre recommandée</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={saving || uploading}
          className="gap-2"
        >
          {saving || uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer l'offre #{index + 1}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
