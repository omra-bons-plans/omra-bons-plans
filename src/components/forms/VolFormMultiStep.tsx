import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AirlineSelect } from '@/components/ui/AirlineSelect';
import { AirportSelect } from '@/components/ui/AirportSelect';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AdPreview from '@/components/ui/AdPreview';

interface VolFormMultiStepProps {
  onSubmit: (formData: any, isDraft?: boolean) => void;
  onBack: () => void;
  initialData?: any;
}

export default function VolFormMultiStep({ onSubmit, onBack, initialData }: VolFormMultiStepProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    location: '',
    airline: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    hasStopover: false,
    stopoverDetails: '',
    checkedBagsCount: 0,
    checkedBagsWeight: 20,
    showPhone: true,
    showWhatsapp: false,
    showEmail: true,
    images: [] as string[]
  });

  const [publishEndDate, setPublishEndDate] = useState<Date | undefined>(undefined);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.title.length >= 10 && formData.description.length >= 20;
      case 2:
        return formData.airline && formData.departureAirport && formData.arrivalAirport;
      case 3:
        return formData.departureDate && formData.returnDate && formData.price;
      case 4:
        return publishEndDate;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier une annonce');
      return;
    }

    try {
      const location = `${formData.departureAirport} → ${formData.arrivalAirport}`;
      
      const adData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: 'vols',
        currency: 'EUR',
        location: location,
        images: formData.images,
        cover_image: formData.images[0] || null,
        show_phone: formData.showPhone,
        show_whatsapp: formData.showWhatsapp,
        show_email: formData.showEmail,
        publish_end_date: publishEndDate?.toISOString(),
        is_published: true,
        user_id: user.id
      };

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert(adData)
        .select()
        .single();

      if (adError) throw adError;

      // Insert flight details
      const flightData = {
        ad_id: ad.id,
        airline: formData.airline,
        departure_airport: formData.departureAirport,
        arrival_airport: formData.arrivalAirport,
        departure_date: formData.departureDate?.toISOString().split('T')[0],
        return_date: formData.returnDate?.toISOString().split('T')[0],
        has_stopover: formData.hasStopover,
        stopover_details: formData.stopoverDetails || null,
        checked_bags_count: formData.checkedBagsCount,
        checked_bags_weight: formData.checkedBagsWeight
      };

      const { error: flightError } = await supabase
        .from('ads_vols')
        .insert(flightData);

      if (flightError) throw flightError;

      toast.success('Annonce publiée avec succès !');
      onSubmit(formData, false);
    } catch (error) {
      console.error('Error publishing ad:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder');
      return;
    }

    try {
      const location = formData.departureAirport && formData.arrivalAirport 
        ? `${formData.departureAirport} → ${formData.arrivalAirport}` 
        : '';

      const adData = {
        title: formData.title || 'Brouillon - Vol',
        description: formData.description || '',
        price: formData.price ? parseFloat(formData.price) : 0,
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: 'vols',
        currency: 'EUR',
        location: location,
        images: formData.images,
        cover_image: formData.images[0] || null,
        is_draft: true,
        publish_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        show_phone: formData.showPhone,
        show_whatsapp: formData.showWhatsapp,
        show_email: formData.showEmail,
        user_id: user.id
      };

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert(adData)
        .select()
        .single();

      if (adError) throw adError;

      // Insert flight details if we have minimum info
      if (formData.airline || formData.departureAirport || formData.arrivalAirport) {
        const flightData = {
          ad_id: ad.id,
          airline: formData.airline || '',
          departure_airport: formData.departureAirport || '',
          arrival_airport: formData.arrivalAirport || '',
          departure_date: formData.departureDate?.toISOString().split('T')[0] || null,
          return_date: formData.returnDate?.toISOString().split('T')[0] || null,
          has_stopover: formData.hasStopover,
          stopover_details: formData.stopoverDetails || null,
          checked_bags_count: formData.checkedBagsCount,
          checked_bags_weight: formData.checkedBagsWeight
        };

        const { error: flightError } = await supabase
          .from('ads_vols')
          .insert(flightData);

        if (flightError) throw flightError;
      }

      toast.success('Brouillon sauvegardé !');
      onSubmit(formData, true);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Ex: Vol direct Paris-Jeddah avec Turkish Airlines"
                  maxLength={80}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum 10 caractères</span>
                  <span>{formData.title.length}/80</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Décrivez les détails du vol, services inclus, conditions..."
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum 20 caractères</span>
                  <span>{formData.description.length}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Compagnie et aéroports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Compagnie aérienne *</Label>
                <AirlineSelect
                  value={formData.airline}
                  onChange={(value) => updateFormData('airline', value)}
                  placeholder="Sélectionner une compagnie aérienne..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Aéroport de départ *</Label>
                  <AirportSelect
                    value={formData.departureAirport}
                    onValueChange={(value) => updateFormData('departureAirport', value)}
                    placeholder="Ex: CDG - Paris"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Aéroport d'arrivée *</Label>
                  <AirportSelect
                    value={formData.arrivalAirport}
                    onValueChange={(value) => updateFormData('arrivalAirport', value)}
                    placeholder="Ex: JED - Jeddah"
                  />
                </div>
              </div>

              {/* Section bagages */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-4">Bagages en soute inclus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="checkedBagsCount">Nombre de bagages en soute</Label>
                    <Input
                      id="checkedBagsCount"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.checkedBagsCount}
                      onChange={(e) => updateFormData('checkedBagsCount', parseInt(e.target.value) || 0)}
                      placeholder="Ex: 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkedBagsWeight">Kilos pour chaque bagages</Label>
                    <Input
                      id="checkedBagsWeight"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.checkedBagsWeight}
                      onChange={(e) => updateFormData('checkedBagsWeight', parseInt(e.target.value) || 20)}
                      placeholder="Ex: 23"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dates et escales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date de départ *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.departureDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.departureDate ? (
                            format(formData.departureDate, "dd MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.departureDate}
                          onSelect={(date) => updateFormData('departureDate', date)}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Date de retour *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.returnDate ? (
                            format(formData.returnDate, "dd MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.returnDate}
                          onSelect={(date) => updateFormData('returnDate', date)}
                          initialFocus
                          disabled={(date) => 
                            date < new Date() || 
                            (formData.departureDate && date <= formData.departureDate)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasStopover"
                      checked={formData.hasStopover}
                      onCheckedChange={(checked) => updateFormData('hasStopover', checked)}
                    />
                    <Label htmlFor="hasStopover">Vol avec escale</Label>
                  </div>

                  {formData.hasStopover && (
                    <div className="space-y-2">
                      <Label>Détails de l'escale</Label>
                      <Input
                        value={formData.stopoverDetails}
                        onChange={(e) => updateFormData('stopoverDetails', e.target.value)}
                        placeholder="Ex: Escale à Istanbul (IST) - 2h"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prix et promotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix de vente (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', e.target.value)}
                      placeholder="Ex: 650"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Prix original (€)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => updateFormData('originalPrice', e.target.value)}
                      placeholder="Ex: 850"
                    />
                    <p className="text-xs text-muted-foreground">
                      Prix barré pour montrer la réduction
                    </p>
                  </div>
                </div>

                {formData.originalPrice && formData.price && 
                 parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Économie : {parseFloat(formData.originalPrice) - parseFloat(formData.price)}€ 
                      ({Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}% de réduction)
                    </p>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      images={formData.images}
                      onImagesChange={(images) => updateFormData('images', images)}
                      maxImages={6}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      La première image sera utilisée comme image principale
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Date de fin de publication *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !publishEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {publishEndDate ? (
                        format(publishEndDate, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={publishEndDate}
                      onSelect={setPublishEndDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Informations de contact affichées</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showEmail"
                      checked={formData.showEmail}
                      onCheckedChange={(checked) => updateFormData('showEmail', checked)}
                    />
                    <Label htmlFor="showEmail">Afficher l'email (recommandé)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPhone"
                      checked={formData.showPhone}
                      onCheckedChange={(checked) => updateFormData('showPhone', checked)}
                    />
                    <Label htmlFor="showPhone">Afficher le téléphone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showWhatsapp"
                      checked={formData.showWhatsapp}
                      onCheckedChange={(checked) => updateFormData('showWhatsapp', checked)}
                    />
                    <Label htmlFor="showWhatsapp">Afficher WhatsApp</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation de votre annonce</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Aperçu de votre annonce</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{formData.title || 'Titre de votre annonce'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.departureAirport} → {formData.arrivalAirport}
                      </p>
                      <p className="text-lg font-bold">{formData.price}€</p>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.slice(0, 3).map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Informations générales';
      case 2: return 'Vol et aéroports';
      case 3: return 'Dates et prix';
      case 4: return 'Publication';
      case 5: return 'Prévisualisation';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Publier un vol</h1>
          <span className="text-sm text-muted-foreground">
            Étape {step} sur {totalSteps}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        
        <div className="mt-2 text-center">
          <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:relative bg-background border-t md:border-t-0 p-4 md:p-0 z-50">
        <div className="max-w-4xl mx-auto">
          {step === totalSteps ? (
            /* Étape récapitulatif - Choix final */
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Que souhaitez-vous faire ?</h3>
                <p className="text-sm text-muted-foreground">Choisissez une action pour votre annonce</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="w-full sm:w-auto h-12 px-6"
                >
                  ← Modifier
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleSaveDraft}
                  className="px-6 w-full sm:w-auto h-12"
                >
                  💾 Sauvegarder comme brouillon
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handlePublish}
                  disabled={!validateStep()}
                  className="btn-modern px-8 w-full sm:w-auto h-12"
                >
                  🚀 Publier maintenant
                </Button>
              </div>
            </div>
          ) : (
            /* Étapes normales */
            <div className="flex justify-between items-center">
              <div>
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="w-full sm:w-auto"
                  >
                    Précédent
                  </Button>
                )}
              </div>
              
              <Button 
                onClick={handleNext}
                disabled={!validateStep()}
                className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}