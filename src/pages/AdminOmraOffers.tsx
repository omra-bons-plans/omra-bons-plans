import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, ArrowLeft, Upload, X, Building2, MapPin, Calendar, Plane } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { getAgencyLogo, getAgencyNames } from '@/utils/agencyLogos';

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
  
  const [formData, setFormData] = useState<OmraOfferForm>({
    agency_name: '',
    offer_url: '',
    month_departure: '',
    date_start: '',
    date_end: '',
    duration_nights: 0,
    price_eur: 0,
    departure_city: '',
    formula_type: 'confort',
    hotel_makkah: '',
    hotel_makkah_stars: 3,
    hotel_medinah: '',
    hotel_medinah_stars: 3,
    airline: '',
    visa_included: false,
    hajj_duration_type: 'court'
  });

  useEffect(() => {
    if (!adminLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate, user]);

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

      // Calculer duration_nights à partir des dates
      const start = new Date(formData.date_start);
      const end = new Date(formData.date_end);
      const durationNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

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

      toast({
        title: "Offre ajoutée",
        description: `L'offre ${offerType === 'omra' ? 'Omra' : 'Hajj'} a été ajoutée avec succès`,
      });

      // Reset form
      setFormData({
        agency_name: '',
        offer_url: '',
        month_departure: '',
        date_start: '',
        date_end: '',
        duration_nights: 0,
        price_eur: 0,
        departure_city: '',
        formula_type: 'confort',
        hotel_makkah: '',
        hotel_makkah_stars: 3,
        hotel_medinah: '',
        hotel_medinah_stars: 3,
        airline: '',
        visa_included: false,
        hajj_duration_type: 'court'
      });
      setLogoFile(null);
      setLogoPreview(null);

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'annonce */}
          <Card>
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
                        <Calendar className="h-4 w-4" />
                        <span>Hajj</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Informations de l'agence */}
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
                <Calendar className="h-5 w-5" />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_start">Date de séjour aller *</Label>
                  <Input
                    id="date_start"
                    type="date"
                    value={formData.date_start}
                    onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_end">Date de séjour retour *</Label>
                  <Input
                    id="date_end"
                    type="date"
                    value={formData.date_end}
                    onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_nights">Nombre de jours total *</Label>
                  <Input
                    id="duration_nights"
                    type="number"
                    value={formData.duration_nights}
                    onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 14"
                    required
                  />
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
                      <SelectValue />
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

              {offerType === 'hajj' && (
                <div className="space-y-2">
                  <Label htmlFor="hajj_duration_type">Durée de séjour Hajj *</Label>
                  <Select
                    value={formData.hajj_duration_type}
                    onValueChange={(value) => setFormData({ ...formData, hajj_duration_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="court">Court séjour</SelectItem>
                      <SelectItem value="long">Long séjour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                  <Input
                    id="hotel_makkah"
                    value={formData.hotel_makkah}
                    onChange={(e) => setFormData({ ...formData, hotel_makkah: e.target.value })}
                    placeholder="Ex: Al Safwah Tower"
                    required
                  />
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
                  <Input
                    id="hotel_medinah"
                    value={formData.hotel_medinah}
                    onChange={(e) => setFormData({ ...formData, hotel_medinah: e.target.value })}
                    placeholder="Ex: Dar Al Taqwa"
                    required
                  />
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
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  placeholder="Ex: Air France, Emirates, Saudia"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
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
                  Enregistrer l'offre
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOmraOffers;
