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

interface OmraOfferForm {
  agency_name: string;
  agency_url: string;
  agency_logo?: string;
  offer_title: string;
  offer_url: string;
  price_eur: number;
  month_departure: string;
  date_start?: string;
  date_end?: string;
  departure_city: string;
  formula_type: string;
  duration_nights?: number;
  makkah_nights: number;
  medina_nights: number;
  hotel_makkah?: string;
  hotel_medinah?: string;
  distance_to_haram_m?: number;
  board?: string;
  flights_included: boolean;
  visa_included: boolean;
  guide_language: string[];
  notes?: string;
  status: string;
}

const AdminOmraOffers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload('ad-images');
  
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<OmraOfferForm>({
    agency_name: '',
    agency_url: '',
    offer_title: '',
    offer_url: '',
    price_eur: 0,
    month_departure: '',
    departure_city: '',
    formula_type: 'economique',
    makkah_nights: 0,
    medina_nights: 0,
    flights_included: true,
    visa_included: false,
    guide_language: ['fr'],
    status: 'active'
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
    
    if (!formData.agency_name || !formData.offer_title || !formData.price_eur) {
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

      // Calculer duration_nights si dates fournies
      let durationNights = formData.duration_nights;
      if (formData.date_start && formData.date_end && !durationNights) {
        const start = new Date(formData.date_start);
        const end = new Date(formData.date_end);
        durationNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Générer source_hash unique
      const sourceHash = `manual_${Date.now()}_${formData.agency_name.replace(/\s+/g, '_')}_${formData.offer_title.substring(0, 20).replace(/\s+/g, '_')}`;

      const offerData = {
        ...formData,
        agency_logo: logoUrl,
        duration_nights: durationNights || formData.makkah_nights + formData.medina_nights,
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
        description: "L'offre Omra a été ajoutée avec succès",
      });

      // Reset form
      setFormData({
        agency_name: '',
        agency_url: '',
        offer_title: '',
        offer_url: '',
        price_eur: 0,
        month_departure: '',
        departure_city: '',
        formula_type: 'economique',
        makkah_nights: 0,
        medina_nights: 0,
        flights_included: true,
        visa_included: false,
        guide_language: ['fr'],
        status: 'active'
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
              <h1 className="text-3xl font-bold">Ajouter une offre Omra</h1>
              <p className="text-muted-foreground">Ajoutez manuellement une nouvelle offre de séjour</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Agence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'agence
              </CardTitle>
              <CardDescription>Détails de l'agence proposant l'offre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agency_name">Nom de l'agence *</Label>
                  <Input
                    id="agency_name"
                    value={formData.agency_name}
                    onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency_url">URL de l'agence *</Label>
                  <Input
                    id="agency_url"
                    type="url"
                    value={formData.agency_url}
                    onChange={(e) => setFormData({ ...formData, agency_url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo de l'agence</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
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
                      <span className="text-xs text-muted-foreground">Cliquer pour uploader</span>
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

          {/* Informations Offre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Informations de l'offre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offer_title">Titre de l'offre *</Label>
                <Input
                  id="offer_title"
                  value={formData.offer_title}
                  onChange={(e) => setFormData({ ...formData, offer_title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer_url">URL de l'offre *</Label>
                <Input
                  id="offer_url"
                  type="url"
                  value={formData.offer_url}
                  onChange={(e) => setFormData({ ...formData, offer_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_eur">Prix (EUR) *</Label>
                  <Input
                    id="price_eur"
                    type="number"
                    value={formData.price_eur}
                    onChange={(e) => setFormData({ ...formData, price_eur: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month_departure">Mois de départ *</Label>
                  <Input
                    id="month_departure"
                    value={formData.month_departure}
                    onChange={(e) => setFormData({ ...formData, month_departure: e.target.value })}
                    placeholder="Ex: Janvier 2025"
                    required
                  />
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
                  <Label htmlFor="date_start">Date de départ</Label>
                  <Input
                    id="date_start"
                    type="date"
                    value={formData.date_start || ''}
                    onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_end">Date de retour</Label>
                  <Input
                    id="date_end"
                    type="date"
                    value={formData.date_end || ''}
                    onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formule et Hébergement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Formule et Hébergement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formula_type">Type de formule *</Label>
                  <Select
                    value={formData.formula_type}
                    onValueChange={(value) => setFormData({ ...formData, formula_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economique">Économique</SelectItem>
                      <SelectItem value="confort">Confort</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">Pension</Label>
                  <Select
                    value={formData.board || ''}
                    onValueChange={(value) => setFormData({ ...formData, board: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petit déjeuner">Petit déjeuner</SelectItem>
                      <SelectItem value="Demi-pension">Demi-pension</SelectItem>
                      <SelectItem value="Pension complète">Pension complète</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="makkah_nights">Nuits à La Mecque *</Label>
                  <Input
                    id="makkah_nights"
                    type="number"
                    value={formData.makkah_nights}
                    onChange={(e) => setFormData({ ...formData, makkah_nights: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medina_nights">Nuits à Médine *</Label>
                  <Input
                    id="medina_nights"
                    type="number"
                    value={formData.medina_nights}
                    onChange={(e) => setFormData({ ...formData, medina_nights: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_nights">Durée totale (nuits)</Label>
                  <Input
                    id="duration_nights"
                    type="number"
                    value={formData.duration_nights || ''}
                    onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || undefined })}
                    placeholder="Auto si dates renseignées"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_makkah">Hôtel La Mecque</Label>
                  <Input
                    id="hotel_makkah"
                    value={formData.hotel_makkah || ''}
                    onChange={(e) => setFormData({ ...formData, hotel_makkah: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel_medinah">Hôtel Médine</Label>
                  <Input
                    id="hotel_medinah"
                    value={formData.hotel_medinah || ''}
                    onChange={(e) => setFormData({ ...formData, hotel_medinah: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance_to_haram_m">Distance au Haram (mètres)</Label>
                <Input
                  id="distance_to_haram_m"
                  type="number"
                  value={formData.distance_to_haram_m || ''}
                  onChange={(e) => setFormData({ ...formData, distance_to_haram_m: parseInt(e.target.value) || undefined })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services inclus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Services inclus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flights_included"
                  checked={formData.flights_included}
                  onCheckedChange={(checked) => setFormData({ ...formData, flights_included: checked as boolean })}
                />
                <Label htmlFor="flights_included" className="cursor-pointer">
                  Vols inclus
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visa_included"
                  checked={formData.visa_included}
                  onCheckedChange={(checked) => setFormData({ ...formData, visa_included: checked as boolean })}
                />
                <Label htmlFor="visa_included" className="cursor-pointer">
                  Visa inclus
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Langues du guide</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang_fr"
                      checked={formData.guide_language.includes('fr')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, guide_language: [...formData.guide_language, 'fr'] });
                        } else {
                          setFormData({ ...formData, guide_language: formData.guide_language.filter(l => l !== 'fr') });
                        }
                      }}
                    />
                    <Label htmlFor="lang_fr" className="cursor-pointer">Français</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang_ar"
                      checked={formData.guide_language.includes('ar')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, guide_language: [...formData.guide_language, 'ar'] });
                        } else {
                          setFormData({ ...formData, guide_language: formData.guide_language.filter(l => l !== 'ar') });
                        }
                      }}
                    />
                    <Label htmlFor="lang_ar" className="cursor-pointer">Arabe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang_en"
                      checked={formData.guide_language.includes('en')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, guide_language: [...formData.guide_language, 'en'] });
                        } else {
                          setFormData({ ...formData, guide_language: formData.guide_language.filter(l => l !== 'en') });
                        }
                      }}
                    />
                    <Label htmlFor="lang_en" className="cursor-pointer">Anglais</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes additionnelles</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="stale">Périmée</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </SelectContent>
                </Select>
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
