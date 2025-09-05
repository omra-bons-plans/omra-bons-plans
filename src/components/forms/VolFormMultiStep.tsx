import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plane, Upload, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VolFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate: string;
  hasOutboundStopover: boolean;
  hasReturnStopover: boolean;
  outboundStopoverDetails?: string;
  returnStopoverDetails?: string;
  publishEndDate: string;
  showEmail: boolean;
  showPhone: boolean;
  isPromotion: boolean;
  promotionEndDate?: string;
}

interface VolFormMultiStepProps {
  onSubmit: (data: VolFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
}

const VolFormMultiStep = ({ onSubmit, onBack }: VolFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger, control } = useForm<VolFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      isPromotion: false,
      hasOutboundStopover: false,
      hasReturnStopover: false,
    }
  });

  const totalSteps = 5;
  const originalPrice = watch('originalPrice');
  const price = watch('price');

  // Marquer le formulaire comme modifié dès qu'une valeur change
  useEffect(() => {
    const subscription = watch(() => {
      setIsFormDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Gérer la fermeture de la page/onglet avec confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = 'Voulez-vous vraiment quitter ? Vos modifications ne seront pas sauvegardées.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && !coverImage) {
      setCoverImage(files[0]);
      setImages(files.slice(1, 7));
    } else {
      setImages(prev => [...prev, ...files].slice(0, 6));
    }
  };

  const calculateDiscount = () => {
    if (originalPrice && price && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof VolFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'description'];
        break;
      case 2:
        fieldsToValidate = ['airline', 'departureAirport', 'arrivalAirport'];
        break;
      case 3:
        fieldsToValidate = ['departureDate', 'returnDate'];
        break;
      case 4:
        fieldsToValidate = ['price'];
        break;
      case 5:
        fieldsToValidate = ['publishEndDate'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll vers le haut de la page avec un délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (data: VolFormData) => {
    onSubmit(data, false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Informations générales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Le titre est requis" })}
                  placeholder="Ex: Vol direct Paris-Jeddah avec Emirates"
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète *</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "La description est requise" })}
                  placeholder="Décrivez les détails du vol, services inclus..."
                  rows={4}
                />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="w-5 h-5" />
                <span>Compagnie et aéroports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="airline">Compagnie aérienne *</Label>
                <Controller
                  name="airline"
                  control={control}
                  rules={{ required: "La compagnie aérienne est requise" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la compagnie" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                        <SelectItem value="air-france">Air France</SelectItem>
                        <SelectItem value="egyptair">EgyptAir</SelectItem>
                        <SelectItem value="emirates">Emirates</SelectItem>
                        <SelectItem value="flyadeal">Flyadeal</SelectItem>
                        <SelectItem value="flynas">Flynas</SelectItem>
                        <SelectItem value="pegasus">Pegasus Airlines</SelectItem>
                        <SelectItem value="qatar">Qatar Airways</SelectItem>
                        <SelectItem value="royal-jordanian">Royal Jordanian</SelectItem>
                        <SelectItem value="saudi">Saudi Arabian Airlines</SelectItem>
                        <SelectItem value="transavia">Transavia</SelectItem>
                        <SelectItem value="turkish">Turkish Airlines</SelectItem>
                        <SelectItem value="wizz-air">Wizz Air</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.airline && <p className="text-destructive text-sm">{errors.airline.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Aéroport de départ *</Label>
                  <Input
                    id="departureAirport"
                    {...register("departureAirport", { required: "L'aéroport de départ est requis" })}
                    placeholder="Ex: Paris CDG"
                  />
                  {errors.departureAirport && <p className="text-destructive text-sm">{errors.departureAirport.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Aéroport d'arrivée *</Label>
                  <Input
                    id="arrivalAirport"
                    {...register("arrivalAirport", { required: "L'aéroport d'arrivée est requis" })}
                    placeholder="Ex: Jeddah JED"
                  />
                  {errors.arrivalAirport && <p className="text-destructive text-sm">{errors.arrivalAirport.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Dates et escales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Date de départ *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    {...register("departureDate", { required: "La date de départ est requise" })}
                  />
                  {errors.departureDate && <p className="text-destructive text-sm">{errors.departureDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnDate">Date de retour *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    {...register("returnDate", { 
                      required: "La date de retour est requise",
                      validate: (value) => {
                        const departureDate = watch("departureDate");
                        if (departureDate && value && new Date(value) <= new Date(departureDate)) {
                          return "La date de retour doit être après la date de départ";
                        }
                        return true;
                      }
                    })}
                  />
                  {errors.returnDate && <p className="text-destructive text-sm">{errors.returnDate.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasOutboundStopover"
                      checked={watch('hasOutboundStopover')}
                      onCheckedChange={(checked) => setValue("hasOutboundStopover", !!checked)}
                    />
                    <Label htmlFor="hasOutboundStopover">Vol aller avec escale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasReturnStopover"
                      checked={watch('hasReturnStopover')}
                      onCheckedChange={(checked) => setValue("hasReturnStopover", !!checked)}
                    />
                    <Label htmlFor="hasReturnStopover">Vol retour avec escale</Label>
                  </div>
                </div>

                {watch('hasOutboundStopover') && (
                  <div className="space-y-2">
                    <Label htmlFor="outboundStopoverDetails">Détails de l'escale aller</Label>
                    <Input
                      id="outboundStopoverDetails"
                      {...register("outboundStopoverDetails")}
                      placeholder="Ex: Escale à Dubaï (2h30)"
                    />
                  </div>
                )}

                {watch('hasReturnStopover') && (
                  <div className="space-y-2">
                    <Label htmlFor="returnStopoverDetails">Détails de l'escale retour</Label>
                    <Input
                      id="returnStopoverDetails"
                      {...register("returnStopoverDetails")}
                      placeholder="Ex: Escale à Istanbul (3h15)"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Photos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Photo de couverture (obligatoire)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        {coverImage ? (
                          <div className="space-y-2">
                            <img 
                              src={URL.createObjectURL(coverImage)} 
                              alt="Cover" 
                              className="w-32 h-24 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-muted-foreground">{coverImage.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Cliquez pour ajouter une photo</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Photos supplémentaires (max 6)</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {images.length < 6 && (
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="additional-upload"
                          />
                          <label htmlFor="additional-upload" className="cursor-pointer">
                            <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                            <p className="text-xs text-muted-foreground mt-1">+</p>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Prix et promotion</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix de vente (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { 
                        required: "Le prix est requis", 
                        valueAsNumber: true,
                        validate: (value) => {
                          const basePrice = watch("originalPrice");
                          if (basePrice && value > basePrice) {
                            return "Le prix de vente ne peut pas être supérieur au prix de base";
                          }
                          return true;
                        }
                      })}
                      placeholder="Ex: 650"
                    />
                    {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Prix de base (€)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      {...register("originalPrice", { 
                        valueAsNumber: true,
                        validate: (value) => {
                          const salePrice = watch("price");
                          if (value && salePrice && salePrice > value) {
                            return "Le prix de base doit être supérieur au prix de vente";
                          }
                          return true;
                        }
                      })}
                      placeholder="Ex: 850"
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("originalPrice", value ? parseFloat(value) : undefined);
                        // Re-valider le prix de vente quand le prix de base change
                        trigger("price");
                      }}
                    />
                  </div>
                </div>

                {calculateDiscount() > 0 && (
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Réduction calculée</p>
                        <p className="text-sm text-muted-foreground">
                          {calculateDiscount()}% de réduction
                        </p>
                      </div>
                      <Badge className={calculateDiscount() >= 30 ? "bg-destructive" : "bg-success"}>
                        {calculateDiscount() >= 30 ? "⚡ Vente Flash" : "🏷️ Promotion"}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Paramètres de publication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="publishEndDate">Date de fin de publication *</Label>
                <Input
                  id="publishEndDate"
                  type="date"
                  {...register("publishEndDate", { required: "La date de fin est requise" })}
                />
                {errors.publishEndDate && <p className="text-destructive text-sm">{errors.publishEndDate.message}</p>}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Informations de contact affichées</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showEmail"
                      checked={watch("showEmail")}
                      onCheckedChange={(checked) => setValue("showEmail", !!checked)}
                    />
                    <Label htmlFor="showEmail">Afficher l'email (recommandé)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showPhone"
                      checked={watch("showPhone")}
                      onCheckedChange={(checked) => setValue("showPhone", !!checked)}
                    />
                    <Label htmlFor="showPhone">Afficher le téléphone</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-large">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Vol pour l'Omra</h1>
            <p className="text-muted-foreground">Billets d'avion aller-retour</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {renderStep()}

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 sm:pt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={currentStep === 1 ? onBack : handlePrevious}
            className="w-full sm:w-auto"
          >
            {currentStep === 1 ? 'Retour' : 'Précédent'}
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {currentStep === totalSteps && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  const data = watch();
                  onSubmit(data, true);
                }}
                className="px-4 sm:px-6 w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Enregistrer et continuer plus tard</span>
                <span className="sm:hidden">Sauvegarder brouillon</span>
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
              >
                Suivant
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
              >
                Publier l'annonce
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default VolFormMultiStep;