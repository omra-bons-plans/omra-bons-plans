import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Save from 'lucide-react/dist/esm/icons/save';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import Plane from 'lucide-react/dist/esm/icons/plane';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { getAgencyLogo, getAgencyNames } from '@/utils/agencyLogos';
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
import { OmraOfferFormCard } from '@/components/forms/OmraOfferFormCard';
import { HajjOfferForm } from '@/components/forms/HajjOfferForm';
import { HajjOfferFormCard } from '@/components/forms/HajjOfferFormCard';

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

const MONTH_LABEL_TO_INDEX: Record<string, number> = {
  janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
};

const getMonthDefaultDate = (monthLabel?: string): Date | undefined => {
  if (!monthLabel) return undefined;
  const key = monthLabel.toLowerCase();
  const idx = MONTH_LABEL_TO_INDEX[key];
  if (idx === undefined) return undefined;
  const now = new Date();
  const year = idx < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, idx, 1);
};

interface OmraOfferForm {
  agency_name: string;
  agency_logo?: string;
  offer_url: string;
  month_departure: string;
  date_start: string;
  date_end: string;
  duration_nights: number;
  price_eur: number;
  departure_city: string;
  formula_type: string;
  hotel_makkah: string;
  hotel_makkah_stars: number;
  hotel_medinah: string;
  hotel_medinah_stars: number;
  airline: string;
  visa_included: boolean;
  hajj_duration_type?: string;
  is_recommended: boolean;
}

const AdminOmraOffers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload('ad-images');
  
  const [offerType, setOfferType] = useState<'omra' | 'hajj'>('omra');
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [formCounter, setFormCounter] = useState(1);
  
  // Données communes à conserver entre les formulaires
  const [commonData, setCommonData] = useState({
    agency_name: '',
    agency_logo: undefined as string | undefined,
    offer_url: '',
    month_departure: '',
    departure_city: '',
  });
  
  const [formData, setFormData] = useState<OmraOfferForm>({
    agency_name: '',
    offer_url: '',
    month_departure: '',
    date_start: '',
    date_end: '',
    duration_nights: 0,
    price_eur: 0,
    departure_city: '',
    formula_type: 'essentiel',
    hotel_makkah: '',
    hotel_makkah_stars: 3,
    hotel_medinah: '',
    hotel_medinah_stars: 3,
    airline: '',
    visa_included: true,
    hajj_duration_type: 'court',
    is_recommended: false
  });
  
  // Liste des formulaires supplémentaires (Omra)
  const [additionalForms, setAdditionalForms] = useState<OmraOfferForm[]>([]);
  
  // Liste des formulaires supplémentaires (Hajj)
  const [additionalHajjForms, setAdditionalHajjForms] = useState<{ agency_name: string; offer_url: string }[]>([]);

  const [openMakkahHotel, setOpenMakkahHotel] = useState(false);
  const [openMedinaHotel, setOpenMedinaHotel] = useState(false);
  const [openAirline, setOpenAirline] = useState(false);

  const { hotels: makkahHotels, saveHotel: saveMakkahHotel } = useHotelPresets('makkah');
  const { hotels: medinaHotels, saveHotel: saveMedinaHotel } = useHotelPresets('medina');
  const { airlines: airlinePresets, saveAirline } = useAirlinePresets();

  useEffect(() => {
    if (!adminLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate, user]);

  const handleAddAnotherOffer = () => {
    if (offerType === 'omra') {
      const newForm: OmraOfferForm = {
        agency_name: formData.agency_name || commonData.agency_name,
        agency_logo: formData.agency_logo || commonData.agency_logo,
        offer_url: formData.offer_url || commonData.offer_url,
        month_departure: formData.month_departure || commonData.month_departure,
        departure_city: formData.departure_city || commonData.departure_city,
        date_start: '',
        date_end: '',
        duration_nights: 0,
        price_eur: 0,
        formula_type: 'essentiel',
        hotel_makkah: '',
        hotel_makkah_stars: 3,
        hotel_medinah: '',
        hotel_medinah_stars: 3,
        airline: '',
        visa_included: true,
        hajj_duration_type: 'court',
        is_recommended: false,
      };

      setAdditionalForms(prev => [...prev, newForm]);
      setFormCounter(prev => prev + 1);
      toast({
        title: `Formulaire Omra #${additionalForms.length + 2} ajouté`,
        description: "Remplissez les détails de cette nouvelle offre",
      });
    } else {
      const newHajjForm = {
        agency_name: formData.agency_name || commonData.agency_name || '',
        offer_url: formData.offer_url || commonData.offer_url || '',
      };

      setAdditionalHajjForms(prev => [...prev, newHajjForm]);
      setFormCounter(prev => prev + 1);
      toast({
        title: `Formulaire Hajj #${additionalHajjForms.length + 2} ajouté`,
        description: "Remplissez les détails de cette nouvelle offre Hajj",
      });
    }

    setTimeout(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  // Mettre à jour formData quand dateRange change
  useEffect(() => {
    if (dateRange?.from) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      setFormData(prev => ({ ...prev, date_start: startDate }));
      
      if (dateRange.to) {
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        setFormData(prev => ({ ...prev, date_end: endDate }));
        
        // Calculer automatiquement la durée
        const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, duration_nights: nights }));
      }
    }
  }, [dateRange]);

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
    if (formData.agency_logo) {
      setFormData({ ...formData, agency_logo: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agency_name || !formData.offer_url || !formData.price_eur || !formData.date_start || !formData.date_end) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let logoUrl = formData.agency_logo;
      
      // Upload logo si nouveau fichier
      if (logoFile) {
        const uploadResult = await uploadImage(logoFile, 'agency-logos');
        logoUrl = uploadResult.url;
      }

      // Utiliser duration_nights saisi ou calculer à partir des dates
      let durationNights = formData.duration_nights;
      if (!durationNights && formData.date_start && formData.date_end) {
        const start = new Date(formData.date_start);
        const end = new Date(formData.date_end);
        durationNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Générer source_hash unique
      const sourceHash = `manual_${offerType}_${Date.now()}_${formData.agency_name.replace(/\s+/g, '_')}`;

      // Construire le titre de l'offre
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

      // Sauvegarder les hôtels pour les proposer la prochaine fois
      if (formData.hotel_makkah) {
        await saveMakkahHotel(formData.hotel_makkah, formData.hotel_makkah_stars);
      }
      if (formData.hotel_medinah) {
        await saveMedinaHotel(formData.hotel_medinah, formData.hotel_medinah_stars);
      }

      // Sauvegarder la compagnie aérienne
      if (formData.airline) {
        await saveAirline(formData.airline);
      }

      // Sauvegarder les données communes
      setCommonData({
        agency_name: formData.agency_name,
        agency_logo: formData.agency_logo,
        offer_url: formData.offer_url,
        month_departure: formData.month_departure,
        departure_city: formData.departure_city,
      });

      toast({
        title: "Offre ajoutée",
        description: `L'offre ${offerType === 'omra' ? 'Omra' : 'Hajj'} a été ajoutée avec succès. Vous pouvez ajouter une autre offre.`,
      });

      // Reset form en gardant les champs communs pré-remplis
      setFormData({
        agency_name: formData.agency_name,
        agency_logo: formData.agency_logo,
        offer_url: formData.offer_url,
        month_departure: formData.month_departure,
        departure_city: formData.departure_city,
        date_start: '',
        date_end: '',
        duration_nights: 0,
        price_eur: 0,
        formula_type: 'essentiel',
        hotel_makkah: '',
        hotel_makkah_stars: 3,
        hotel_medinah: '',
        hotel_medinah_stars: 3,
        airline: '',
        visa_included: true,
        hajj_duration_type: 'court',
        is_recommended: false
      });
      setLogoFile(null);
      setDateRange(undefined);

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

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Ajouter une offre {offerType === 'omra' ? 'Omra' : 'Hajj'}
              </h1>
              <p className="text-muted-foreground">Ajoutez manuellement une nouvelle offre de séjour</p>
            </div>
          </div>
        </div>

        {/* Type d'annonce - Toujours visible */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Type d'annonce
            </CardTitle>
            <CardDescription>Sélectionnez le type de séjour à ajouter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="offer_type">Type de séjour *</Label>
              <Select
                value={offerType}
                onValueChange={(value: 'omra' | 'hajj') => setOfferType(value)}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omra">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Omra</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hajj">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Hajj</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rendu conditionnel: Formulaire Omra ou Hajj */}
        {offerType === 'hajj' ? (
          <HajjOfferForm 
            onCancel={() => navigate('/admin')}
            onSuccess={() => {
              toast({
                title: "✅ Offre Hajj ajoutée",
                description: "Vous pouvez ajouter une autre offre.",
              });
            }}
            onAddAnother={handleAddAnotherOffer}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <>
              {/* Informations de l'agence - OMRA */}
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
                        // Charger automatiquement le logo de l'agence
                        const logo = getAgencyLogo(value);
                        if (logo) {
                          setLogoPreview(logo);
                          setFormData(prev => ({ ...prev, agency_logo: logo }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une agence" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {getAgencyNames().map((agencyName) => (
                          <SelectItem key={agencyName} value={agencyName}>
                            {agencyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offer_url">Lien de l'offre *</Label>
                    <Input
                      id="offer_url"
                      type="url"
                      value={formData.offer_url}
                      onChange={(e) => setFormData({ ...formData, offer_url: e.target.value })}
                      placeholder="https://exemple.com/offre-omra"
                      required
                    />
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
                <div className="space-y-2">
                  <Label htmlFor="month_departure">Mois de la {offerType === 'omra' ? 'Omra' : 'Hajj'} *</Label>
                  <Select
                    value={formData.month_departure}
                    onValueChange={(value) => setFormData({ ...formData, month_departure: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem key={month.value} value={month.label}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure_city">Ville de départ *</Label>
                  <Select
                    value={formData.departure_city}
                    onValueChange={(value) => setFormData({ ...formData, departure_city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paris">Paris</SelectItem>
                      <SelectItem value="Lyon">Lyon</SelectItem>
                      <SelectItem value="Marseille">Marseille</SelectItem>
                      <SelectItem value="Toulouse">Toulouse</SelectItem>
                      <SelectItem value="Nice">Nice</SelectItem>
                      <SelectItem value="Bruxelles">Bruxelles</SelectItem>
                      <SelectItem value="Genève">Genève</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dates du séjour (aller et retour) *</Label>
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
                              {format(dateRange.from, 'dd MMMM yyyy', { locale: fr })} - {format(dateRange.to, 'dd MMMM yyyy', { locale: fr })}
                            </>
                          ) : (
                            format(dateRange.from, 'dd MMMM yyyy', { locale: fr })
                          )
                        ) : (
                          <span>Sélectionner les dates de départ et retour</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        defaultMonth={dateRange?.from ?? getMonthDefaultDate(formData.month_departure)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    {dateRange?.from && dateRange?.to && (
                      <>Durée: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nuits</>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_nights">Nombre de nuits total</Label>
                  <Input
                    id="duration_nights"
                    type="number"
                    min="1"
                    value={formData.duration_nights || ''}
                    onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || 0 })}
                    placeholder="Calculé automatiquement ou saisir manuellement"
                  />
                  <p className="text-xs text-muted-foreground">
                    Calculé automatiquement depuis les dates ou modifiable manuellement
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_eur">Prix Chambre Quadruple (EUR) *</Label>
                  <Input
                    id="price_eur"
                    type="number"
                    value={formData.price_eur}
                    onChange={(e) => setFormData({ ...formData, price_eur: parseFloat(e.target.value) || 0 })}
                    onFocus={(e) => e.target.value === '0' && setFormData({ ...formData, price_eur: '' as any })}
                    placeholder="Ex: 1500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formula_type">Type de séjour *</Label>
                  <Select
                    value={formData.formula_type}
                    onValueChange={(value) => setFormData({ ...formData, formula_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essentiel">Essentiel</SelectItem>
                      <SelectItem value="confort">Confort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visa_included"
                    checked={formData.visa_included}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, visa_included: checked as boolean })
                    }
                  />
                  <Label htmlFor="visa_included" className="cursor-pointer">
                    Visa inclus
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hébergement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hébergement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_makkah">Hôtel à Makkah *</Label>
                  <Popover open={openMakkahHotel} onOpenChange={setOpenMakkahHotel}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMakkahHotel}
                        className="w-full justify-between"
                      >
                        {formData.hotel_makkah || "Sélectionner ou taper un hôtel..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Rechercher ou ajouter un hôtel..." 
                          value={formData.hotel_makkah}
                          onValueChange={(value) => setFormData({ ...formData, hotel_makkah: value })}
                        />
                        <CommandEmpty>
                          <div className="p-4 text-sm text-muted-foreground">
                            Appuyez sur Entrée pour ajouter "{formData.hotel_makkah}"
                          </div>
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
                                  hotel_makkah_stars: hotel.stars
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel_makkah_stars">Nombre d'étoiles *</Label>
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
                  <Label htmlFor="hotel_medinah">Hôtel à Médine *</Label>
                  <Popover open={openMedinaHotel} onOpenChange={setOpenMedinaHotel}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMedinaHotel}
                        className="w-full justify-between"
                      >
                        {formData.hotel_medinah || "Sélectionner ou taper un hôtel..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Rechercher ou ajouter un hôtel..." 
                          value={formData.hotel_medinah}
                          onValueChange={(value) => setFormData({ ...formData, hotel_medinah: value })}
                        />
                        <CommandEmpty>
                          <div className="p-4 text-sm text-muted-foreground">
                            Appuyez sur Entrée pour ajouter "{formData.hotel_medinah}"
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {medinaHotels.map((hotel) => (
                            <CommandItem
                              key={hotel.id}
                              value={hotel.hotel_name}
                              onSelect={(value) => {
                                setFormData({ 
                                  ...formData, 
                                  hotel_medinah: value,
                                  hotel_medinah_stars: hotel.stars
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel_medinah_stars">Nombre d'étoiles *</Label>
                  <Select
                    value={formData.hotel_medinah_stars.toString()}
                    onValueChange={(value) => setFormData({ ...formData, hotel_medinah_stars: parseInt(value) })}
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

          {/* Transport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Transport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="airline">Nom de la compagnie aérienne *</Label>
                <Popover open={openAirline} onOpenChange={setOpenAirline}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAirline}
                      className="w-full justify-between"
                    >
                      {formData.airline || "Sélectionner ou taper une compagnie..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Rechercher ou ajouter une compagnie..." 
                        value={formData.airline}
                        onValueChange={(value) => setFormData({ ...formData, airline: value })}
                      />
                      <CommandEmpty>
                        <div className="p-4 text-sm text-muted-foreground">
                          Appuyez sur Entrée pour ajouter "{formData.airline}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {airlinePresets.map((airline) => (
                          <CommandItem
                            key={airline.id}
                            value={airline.airline_name}
                            onSelect={(value) => {
                              setFormData({ ...formData, airline: value });
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
            </CardContent>
          </Card>

          {/* Tag Recommandé */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <Checkbox
                  id="is_recommended"
                  checked={formData.is_recommended}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_recommended: checked as boolean })
                  }
                />
                <Label
                  htmlFor="is_recommended"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <span className="text-xl">⭐</span>
                  <span>Marquer comme offre recommandée</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Annuler
            </Button>
            <div className="flex gap-4">
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
                    Enregistrer l'offre
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddAnotherOffer}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter une offre
              </Button>
            </div>
          </div>
          </>
          </form>
        )}

        {/* Formulaires supplémentaires Omra */}
        {offerType === 'omra' && additionalForms.map((form, index) => (
          <OmraOfferFormCard
            key={`omra-form-${index}-${formCounter}`}
            index={index + 1}
            initialData={form}
            offerType={offerType}
            logoPreview={logoPreview}
            onRemove={() => {
              setAdditionalForms(additionalForms.filter((_, i) => i !== index));
            }}
            onSave={() => {
              // Rafraîchir ou autre action si nécessaire
            }}
          />
        ))}

        {/* Formulaires supplémentaires Hajj */}
        {offerType === 'hajj' && additionalHajjForms.map((form, index) => (
          <HajjOfferFormCard
            key={`hajj-form-${index}-${formCounter}`}
            index={index + 1}
            initialData={form}
            logoPreview={logoPreview}
            onRemove={() => {
              setAdditionalHajjForms(additionalHajjForms.filter((_, i) => i !== index));
            }}
            onSave={() => {
              // Rafraîchir ou autre action si nécessaire
            }}
          />
        ))}

        {/* Bouton toujours visible pour ajouter un formulaire (utile quand on est sur les cartes #2/#3/...) */}
        <div className="flex flex-wrap justify-center gap-3 py-4">
          <Button type="button" variant="secondary" onClick={handleAddAnotherOffer} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une offre
          </Button>
          {(offerType === 'omra' ? additionalForms.length : additionalHajjForms.length) > 0 && (
            <Button
              type="button"
              onClick={async () => {
                const forms = document.querySelectorAll<HTMLFormElement>(`form[data-offer-form="${offerType}"]`);
                toast({
                  title: 'Enregistrement en cours...',
                  description: `${forms.length} offre(s) à enregistrer`,
                });
                for (const f of Array.from(forms)) {
                  f.requestSubmit();
                  // Laisser le temps à chaque insertion de se terminer
                  await new Promise((r) => setTimeout(r, 800));
                }
              }}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Enregistrer toutes les offres ({offerType === 'omra' ? additionalForms.length : additionalHajjForms.length})
            </Button>
          )}
        </div>

        {/* Compteur d'offres ajoutées */}
        {(offerType === 'omra' ? additionalForms.length : additionalHajjForms.length) > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            {offerType === 'omra' ? additionalForms.length : additionalHajjForms.length} offre(s) supplémentaire(s) en attente
          </div>
        )}
      </div>

      {/* FAB - Bouton flottant pour ajouter une offre */}
      <Button
        type="button"
        size="lg"
        onClick={handleAddAnotherOffer}
        className="fixed bottom-6 right-6 z-[200] h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all gap-0 p-0"
        title={`Ajouter une offre ${offerType === 'omra' ? 'Omra' : 'Hajj'}`}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AdminOmraOffers;
