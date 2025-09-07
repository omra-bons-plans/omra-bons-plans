import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Upload, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AirportSelect } from "@/components/ui/AirportSelect";
import { AirlineSelect } from "@/components/ui/AirlineSelect";

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
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
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
      showWhatsapp: false,
      showProfessionalPhone: false,
      isPromotion: false,
      hasOutboundStopover: false,
      hasReturnStopover: false,
    }
  });

  const totalSteps = 6;
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

  // Scroll vers le haut quand l'étape change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

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
    console.log("handleNext called, current step:", currentStep);
    
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
      case 6:
        // Récapitulatif - pas de validation nécessaire
        break;
    }

    console.log("Fields to validate:", fieldsToValidate);
    const formValues = watch();
    console.log("Current form values:", formValues);

    try {
      const isValid = await trigger(fieldsToValidate);
      console.log("Validation result:", isValid);
      
      if (isValid && currentStep < totalSteps) {
        console.log("Moving to next step:", currentStep + 1);
        setCurrentStep(currentStep + 1);
        // Scroll vers le haut de la page avec un délai pour s'assurer que le DOM est mis à jour
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        console.log("Validation failed or last step reached");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    // Vérifier que la photo de couverture est présente
    if (!coverImage) {
      alert("La photo de couverture est obligatoire");
      return;
    }
    
    // Ajouter les images aux données du formulaire
    const data = watch();
    const dataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage
    };
    
    onSubmit(dataWithImages, false);
  };

  const handleSaveDraft = () => {
    // Ajouter les images aux données du formulaire
    const data = watch();
    const dataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage
    };
    
    onSubmit(dataWithImages, true);
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
                  {...register("title", { 
                    required: "Le titre est requis",
                    minLength: {
                      value: 10,
                      message: "Le titre doit contenir au moins 10 caractères"
                    },
                    maxLength: {
                      value: 80,
                      message: "Le titre ne peut pas dépasser 80 caractères"
                    }
                  })}
                  placeholder="Ex: Vol direct Paris-Jeddah avec Emirates"
                  maxLength={80}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{errors.title?.message}</span>
                  <span>{watch('title')?.length || 0}/80</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète *</Label>
                <Textarea
                  id="description"
                  {...register("description", { 
                    required: "La description est requise",
                    minLength: {
                      value: 20,
                      message: "La description doit contenir au moins 20 caractères"
                    },
                    maxLength: {
                      value: 500,
                      message: "La description ne peut pas dépasser 500 caractères"
                    }
                  })}
                  placeholder="Décrivez les détails du vol, services inclus..."
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs">
                  <span className={errors.description ? "text-red-500" : "text-muted-foreground"}>
                    {errors.description?.message || "La description doit contenir au moins 20 caractères"}
                  </span>
                  <span className="text-muted-foreground">{watch('description')?.length || 0}/500</span>
                </div>
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>
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
                    <AirlineSelect
                      value={field.value || ""}
                      onChange={(value) => {
                        console.log("Airline selected:", value);
                        field.onChange(value);
                        setTimeout(() => {
                          trigger("airline");
                        }, 100);
                      }}
                      placeholder="Sélectionner une compagnie aérienne..."
                    />
                  )}
                />
                {errors.airline && <p className="text-destructive text-sm">{errors.airline.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Aéroport de départ *</Label>
                  <Controller
                    name="departureAirport"
                    control={control}
                    rules={{ required: "L'aéroport de départ est requis" }}
                    render={({ field }) => (
                      <AirportSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Ex: CDG - Paris"
                      />
                    )}
                  />
                  {errors.departureAirport && <p className="text-destructive text-sm">{errors.departureAirport.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Aéroport d'arrivée *</Label>
                  <Controller
                    name="arrivalAirport"
                    control={control}
                    rules={{ required: "L'aéroport d'arrivée est requis" }}
                    render={({ field }) => (
                      <AirportSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Ex: JED - Jeddah"
                      />
                    )}
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
                    min={new Date().toISOString().split('T')[0]}
                    {...register("departureDate", { 
                      required: "La date de départ est requise",
                      validate: (value) => {
                        const today = new Date().toISOString().split('T')[0];
                        if (value && value < today) {
                          return "La date de départ ne peut pas être antérieure à aujourd'hui";
                        }
                        return true;
                      }
                    })}
                  />
                  {errors.departureDate && <p className="text-destructive text-sm">{errors.departureDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnDate">Date de retour *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    min={watch("departureDate") || new Date().toISOString().split('T')[0]}
                    {...register("returnDate", { 
                      required: "La date de retour est requise",
                      validate: (value) => {
                        const today = new Date().toISOString().split('T')[0];
                        if (value && value < today) {
                          return "La date de retour ne peut pas être antérieure à aujourd'hui";
                        }
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
                    <Label htmlFor="outboundStopoverDetails">Aéroport d'escale aller</Label>
                    <Controller
                      name="outboundStopoverDetails"
                      control={control}
                      render={({ field }) => (
                        <AirportSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner l'aéroport d'escale..."
                        />
                      )}
                    />
                  </div>
                )}

                {watch('hasReturnStopover') && (
                  <div className="space-y-2">
                    <Label htmlFor="returnStopoverDetails">Aéroport d'escale retour</Label>
                    <Controller
                      name="returnStopoverDetails"
                      control={control}
                      render={({ field }) => (
                        <AirportSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner l'aéroport d'escale..."
                        />
                      )}
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
                  min={new Date().toISOString().split('T')[0]}
                  {...register("publishEndDate", { 
                    required: "La date de fin est requise",
                    validate: (value) => {
                      const today = new Date().toISOString().split('T')[0];
                      if (value && value < today) {
                        return "La date de fin de publication ne peut pas être antérieure à aujourd'hui";
                      }
                      return true;
                    }
                  })}
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
                    <Label htmlFor="showPhone">Afficher le téléphone portable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showWhatsapp"
                      checked={watch("showWhatsapp")}
                      onCheckedChange={(checked) => setValue("showWhatsapp", !!checked)}
                    />
                    <Label htmlFor="showWhatsapp">Afficher WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showProfessionalPhone"
                      checked={watch("showProfessionalPhone")}
                      onCheckedChange={(checked) => setValue("showProfessionalPhone", !!checked)}
                    />
                    <Label htmlFor="showProfessionalPhone">Afficher le téléphone fixe (professionnel)</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Vérifiez votre annonce</h2>
              <p className="text-muted-foreground">Voici ce que les voyageurs verront. Assurez-vous que tout est correct.</p>
            </div>

            <div className="bg-background rounded-2xl border border-border/20 shadow-soft overflow-hidden max-w-md mx-auto">
              {/* Photo principale */}
              <div className="relative aspect-[4/3] bg-muted">
                {coverImage ? (
                  <img 
                    src={URL.createObjectURL(coverImage)} 
                    alt="Photo de couverture" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">Aucune photo</p>
                    </div>
                  </div>
                )}
                
                {/* Indicateurs de photos */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {images.map((_, index) => (
                    <div key={index} className="w-2 h-2 bg-white/40 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {/* Titre et trajet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                      {watch('departureAirport')} ✈️ {watch('arrivalAirport')}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {watch('airline')}
                    </div>
                  </div>
                  
                  {/* Prix */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-foreground">{watch('price')}€</span>
                    {watch('originalPrice') && watch('originalPrice') > watch('price') && (
                      <span className="text-lg text-destructive line-through">{watch('originalPrice')}€</span>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Date</div>
                    <div className="text-sm text-muted-foreground">
                      Du {watch('departureDate') ? new Date(watch('departureDate')).toLocaleDateString('fr-FR') : '--'} au {watch('returnDate') ? new Date(watch('returnDate')).toLocaleDateString('fr-FR') : '--'}
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">Détails</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Compagnie: {watch('airline') || 'Non spécifiée'}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Trajet: {watch('departureAirport')} → {watch('arrivalAirport')}</span>
                    </li>
                    {watch('hasOutboundStopover') && (
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Escale aller: {watch('outboundStopoverDetails') || 'Oui'}</span>
                      </li>
                    )}
                    {watch('hasReturnStopover') && (
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Escale retour: {watch('returnStopoverDetails') || 'Oui'}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">Contact</h4>
                  <div className="space-y-3">
                    {watch('showEmail') && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary">@</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Votre email sera affiché</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                        <span className="text-muted-foreground">📞</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {watch('showPhone') ? 'Afficher votre numéro de téléphone' : 'Masquer votre numéro de téléphone'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {watch('description') && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {watch('description')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
          <div>
            <h1 className="text-3xl font-bold">Vol pour l'Omra</h1>
            <p className="text-muted-foreground">Billets d'avion aller-retour</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 pb-8">
        {renderStep()}

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background/98 backdrop-blur-sm border-t border-border/20 p-6 -mx-4 sm:-mx-6 mt-8 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {currentStep === totalSteps ? (
              /* Étape récapitulatif - Choix final */
              <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-background border-t md:border-t-0 p-4 md:p-0 space-y-4 z-50 md:z-auto">
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
                    className="btn-modern px-8 w-full sm:w-auto h-12"
                  >
                    🚀 Publier maintenant
                  </Button>
                </div>
              </div>
            ) : (
              /* Étapes normales */
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 1 ? onBack : handlePrevious}
                  className="w-full sm:w-auto h-12 px-6"
                >
                  {currentStep === 1 ? 'Retour' : 'Précédent'}
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="btn-modern px-8 w-full sm:w-auto h-12"
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolFormMultiStep;