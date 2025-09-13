import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Upload, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAirlines } from "@/hooks/useAirlines";

interface SejourFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate: string;
  nightsMedina: number;
  nightsMecca: number;
  medinaHotelName: string;
  medinaHotelDistance: string;
  meccaHotelName: string;
  meccaHotelDistance: string;
  publishEndDate: string;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
  isPromotion: boolean;
  promotionEndDate?: string;
  checkedBagsCount?: number;
  checkedBagsWeight?: number;
  carryOnBagsCount?: number;
  carryOnBagsWeight?: number;
}

interface SejourFormMultiStepProps {
  formulaType: string;
  onSubmit: (data: SejourFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
  initialData?: any;
  isEditMode?: boolean;
}

const SejourFormMultiStep = ({ formulaType, onSubmit, onBack, initialData, isEditMode }: SejourFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  
  // Hook pour les compagnies aériennes
  const { airlines, loading: airlinesLoading, error: airlinesError } = useAirlines();

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger, reset } = useForm<SejourFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      showWhatsapp: false,
      showProfessionalPhone: false,
      isPromotion: false,
      checkedBagsCount: 0,
      checkedBagsWeight: 20,
      carryOnBagsCount: 1,
      carryOnBagsWeight: 10,
    }
  });

  // Pré-remplir le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (initialData && isEditMode) {
      console.log('🔄 Pre-filling form with initial data:', initialData);
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        originalPrice: initialData.originalPrice || 0,
        airline: initialData.airline || '',
        departureAirport: initialData.departureAirport || '',
        arrivalAirport: initialData.arrivalAirport || '',
        departureDate: initialData.departureDate || '',
        returnDate: initialData.returnDate || '',
        nightsMedina: initialData.nightsMedina || 0,
        nightsMecca: initialData.nightsMecca || 0,
        medinaHotelName: initialData.medinaHotelName || '',
        medinaHotelDistance: initialData.medinaHotelDistance || '',
        meccaHotelName: initialData.meccaHotelName || '',
        meccaHotelDistance: initialData.meccaHotelDistance || '',
        publishEndDate: initialData.publishEndDate || '',
        showEmail: initialData.showEmail !== undefined ? initialData.showEmail : true,
        showPhone: initialData.showPhone !== undefined ? initialData.showPhone : false,
        showWhatsapp: initialData.showWhatsapp !== undefined ? initialData.showWhatsapp : false,
        showProfessionalPhone: initialData.showProfessionalPhone !== undefined ? initialData.showProfessionalPhone : false,
        isPromotion: initialData.isPromotion !== undefined ? initialData.isPromotion : false,
        promotionEndDate: initialData.promotionEndDate || '',
        checkedBagsCount: initialData.checkedBagsCount || 0,
        checkedBagsWeight: initialData.checkedBagsWeight || 20,
        carryOnBagsCount: initialData.carryOnBagsCount || 1,
        carryOnBagsWeight: initialData.carryOnBagsWeight || 10,
      });
    }
  }, [initialData, isEditMode, reset]);

  // Watch dates for automatic nights calculation
  const departureDate = watch('departureDate');
  const returnDate = watch('returnDate');
  const nightsMedina = watch('nightsMedina');
  const nightsMecca = watch('nightsMecca');

  // Calculate total nights from dates
  const calculateTotalNights = (departure: string, returnDate: string) => {
    if (!departure || !returnDate) return 0;
    const start = new Date(departure);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Auto-adjust nights when dates change
  const totalNightsFromDates = calculateTotalNights(departureDate, returnDate);
  const totalNightsFromInputs = (nightsMedina || 0) + (nightsMecca || 0);

  // Function to redistribute nights proportionally
  const redistributeNights = (totalNights: number) => {
    if (totalNights === 0) {
      setValue('nightsMedina', 0);
      setValue('nightsMecca', 0);
      return;
    }
    
    // If no previous distribution, default to 30% Medina, 70% Mecca
    if (totalNightsFromInputs === 0) {
      const medinaNights = Math.floor(totalNights * 0.3);
      const meccaNights = totalNights - medinaNights;
      setValue('nightsMedina', medinaNights);
      setValue('nightsMecca', meccaNights);
    } else {
      // Maintain proportions
      const medinaRatio = nightsMedina / totalNightsFromInputs;
      const newMedinaNights = Math.round(totalNights * medinaRatio);
      const newMeccaNights = totalNights - newMedinaNights;
      setValue('nightsMedina', newMedinaNights);
      setValue('nightsMecca', newMeccaNights);
    }
  };

  // Auto-redistribute nights when dates change
  useEffect(() => {
    if (departureDate && returnDate && totalNightsFromDates > 0) {
      redistributeNights(totalNightsFromDates);
    }
  }, [departureDate, returnDate]);

  // Auto-adjust Mecca nights when Medina nights change
  useEffect(() => {
    if (totalNightsFromDates > 0 && nightsMedina !== undefined) {
      const calculatedMeccaNights = totalNightsFromDates - nightsMedina;
      if (calculatedMeccaNights >= 0 && calculatedMeccaNights !== nightsMecca) {
        setValue('nightsMecca', calculatedMeccaNights);
      }
    }
  }, [nightsMedina, totalNightsFromDates]);

  // Auto-adjust Medina nights when Mecca nights change
  useEffect(() => {
    if (totalNightsFromDates > 0 && nightsMecca !== undefined) {
      const calculatedMedinaNights = totalNightsFromDates - nightsMecca;
      if (calculatedMedinaNights >= 0 && calculatedMedinaNights !== nightsMedina) {
        setValue('nightsMedina', calculatedMedinaNights);
      }
    }
  }, [nightsMecca, totalNightsFromDates]);

  // Scroll vers le haut quand l'étape change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

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

  const totalSteps = 6;
  const isPromotion = watch('isPromotion');
  const originalPrice = watch('originalPrice');
  const price = watch('price');

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

  const getFormulaDetails = (type: string) => {
    switch (type) {
      case 'confort':
        return { name: 'Confort', rating: '5★', color: 'bg-gradient-primary' };
      case 'essentiel':
        return { name: 'Essentiel', rating: '4★', color: 'bg-gradient-secondary' };
      case 'eco':
        return { name: 'Éco', rating: '3★', color: 'bg-gradient-hero' };
      default:
        return { name: 'Standard', rating: '3★', color: 'bg-muted' };
    }
  };

  const formula = getFormulaDetails(formulaType);

  const handleNext = async () => {
    let fieldsToValidate: (keyof SejourFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        // Validation manuelle pour airline car il utilise setValue au lieu de register
        const currentAirline = watch('airline');
        if (!currentAirline) {
          alert("Veuillez sélectionner une compagnie aérienne");
          return;
        }
        fieldsToValidate = ['title', 'departureAirport', 'arrivalAirport'];
        break;
      case 2:
        fieldsToValidate = ['description'];
        break;
      case 3:
        fieldsToValidate = ['departureDate', 'returnDate', 'nightsMedina', 'nightsMecca'];
        break;
      case 4:
        fieldsToValidate = ['medinaHotelName', 'medinaHotelDistance', 'meccaHotelName', 'meccaHotelDistance'];
        break;
      case 5:
        fieldsToValidate = ['price', 'publishEndDate'];
        break;
      case 6:
        // Récapitulatif - pas de validation nécessaire
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    
    // Validation spéciale pour l'étape 5 - photo de couverture obligatoire
    if (currentStep === 5 && !coverImage) {
      alert("La photo de couverture est obligatoire");
      return;
    }
    
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
      // Scroll vers le haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        'Voulez-vous vraiment quitter ? Vos modifications ne seront pas sauvegardées.'
      );
      if (confirmLeave) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleSaveDraft = (data: SejourFormData) => {
    // Ajouter les images aux données du formulaire
    const dataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage
    };
    
    onSubmit(dataWithImages, true);
    setIsFormDirty(false); // Marquer comme sauvegardé
  };

  const handlePublish = (data: SejourFormData) => {
    // Vérifier que la photo de couverture est présente
    if (!coverImage) {
      alert("La photo de couverture est obligatoire");
      return;
    }
    
    // Ajouter les images aux données du formulaire
    const dataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage
    };
    
    onSubmit(dataWithImages, false);
    setIsFormDirty(false); // Marquer comme sauvegardé après publication
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Informations de base</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    {...register("title", { 
                      required: "Le titre est requis",
                      minLength: {
                        value: 5,
                        message: "Le titre doit contenir au moins 5 caractères"
                      },
                      maxLength: {
                        value: 20,
                        message: "Le titre ne peut pas dépasser 20 caractères"
                      }
                    })}
                    placeholder="Ex: Omra Confort 5★"
                    maxLength={20}
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      setValue('title', upperValue, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                    <span className={errors.title ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {errors.title?.message || "Le titre doit contenir au moins 5 caractères"}
                    </span>
                    <span className="text-muted-foreground text-right">{watch('title')?.length || 0}/20</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airline">Compagnie aérienne *</Label>
                  <Select 
                    onValueChange={(value) => {
                      console.log("Airline selected:", value);
                      setValue("airline", value);
                    }} 
                    value={watch("airline") || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={airlinesLoading ? "Chargement..." : "Choisir la compagnie"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                      {airlinesLoading ? (
                        <SelectItem value="loading" disabled>Chargement des compagnies...</SelectItem>
                      ) : airlinesError ? (
                        <SelectItem value="error" disabled>Erreur de chargement</SelectItem>
                      ) : (
                        <>
                          {airlines.map((airline) => (
                            <SelectItem key={airline.iata} value={airline.iata}>
                              {airline.name} ({airline.iata})
                            </SelectItem>
                          ))}
                          <SelectItem value="autre">Autre</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {!watch("airline") && <p className="text-destructive text-sm">La compagnie aérienne est requise</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="departureAirport">Aéroport de départ *</Label>
                    <Input 
                      id="departureAirport"
                      placeholder="Ex: CDG, LYS, ORY..."
                      {...register("departureAirport", { 
                        required: "L'aéroport de départ est requis",
                        pattern: {
                          value: /^[A-Z]{3}$/,
                          message: "Code IATA à 3 lettres (ex: CDG)"
                        }
                      })}
                      maxLength={3}
                      className="uppercase"
                      onChange={(e) => setValue("departureAirport", e.target.value.toUpperCase())}
                    />
                    {errors.departureAirport && <p className="text-destructive text-sm">{errors.departureAirport.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalAirport">Aéroport d'arrivée *</Label>
                    <Input 
                      id="arrivalAirport"
                      placeholder="Ex: JED, RUH..."
                      {...register("arrivalAirport", { 
                        required: "L'aéroport d'arrivée est requis",
                        pattern: {
                          value: /^[A-Z]{3}$/,
                          message: "Code IATA à 3 lettres (ex: JED)"
                        }
                      })}
                      maxLength={3}
                      className="uppercase"
                      onChange={(e) => setValue("arrivalAirport", e.target.value.toUpperCase())}
                    />
                    {errors.arrivalAirport && <p className="text-destructive text-sm">{errors.arrivalAirport.message}</p>}
                  </div>
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
                      {...register("checkedBagsCount", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Le nombre doit être positif" }
                      })}
                      placeholder="Ex: 1"
                    />
                    {errors.checkedBagsCount && <p className="text-destructive text-sm">{errors.checkedBagsCount.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkedBagsWeight">Kilos pour chaque bagages</Label>
                    <Input
                      id="checkedBagsWeight"
                      type="number"
                      min="0"
                      max="50"
                      {...register("checkedBagsWeight", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Le poids doit être positif" }
                      })}
                      placeholder="Ex: 23"
                    />
                    {errors.checkedBagsWeight && <p className="text-destructive text-sm">{errors.checkedBagsWeight.message}</p>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold mb-4">Bagages à main inclus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="carryOnBagsCount">Nombre de bagages à main</Label>
                    <Input
                      id="carryOnBagsCount"
                      type="number"
                      min="0"
                      max="5"
                      {...register("carryOnBagsCount", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Le nombre doit être positif" }
                      })}
                      placeholder="Ex: 1"
                    />
                    {errors.carryOnBagsCount && <p className="text-destructive text-sm">{errors.carryOnBagsCount.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carryOnBagsWeight">Kilos pour chaque bagage à main</Label>
                    <Input
                      id="carryOnBagsWeight"
                      type="number"
                      min="0"
                      max="15"
                      {...register("carryOnBagsWeight", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Le poids doit être positif" }
                      })}
                      placeholder="Ex: 10"
                    />
                    {errors.carryOnBagsWeight && <p className="text-destructive text-sm">{errors.carryOnBagsWeight.message}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>Description du séjour</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  placeholder="Décrivez votre séjour Omra en détail..."
                  rows={6}
                  maxLength={500}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                  <span className={errors.description ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {errors.description?.message || "La description doit contenir au moins 20 caractères"}
                  </span>
                  <span className="text-muted-foreground text-right">{watch('description')?.length || 0}/500</span>
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
                <span>Dates du voyage</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nightsMedina">Nombre de nuitées à Médine *</Label>
                  <Input
                    id="nightsMedina"
                    type="number"
                    min="0"
                    max={totalNightsFromDates || 30}
                    {...register("nightsMedina", { 
                      required: "Le nombre de nuitées est requis",
                      valueAsNumber: true,
                      validate: (value) => {
                        const total = (value || 0) + (nightsMecca || 0);
                        if (totalNightsFromDates > 0 && total !== totalNightsFromDates) {
                          return `Le total des nuitées doit être égal à ${totalNightsFromDates} nuits`;
                        }
                        return true;
                      }
                    })}
                    placeholder="Ex: 4"
                  />
                  {errors.nightsMedina && <p className="text-destructive text-sm">{errors.nightsMedina.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nightsMecca">Nombre de nuitées à Makkah *</Label>
                  <Input
                    id="nightsMecca"
                    type="number"
                    min="0"
                    max={totalNightsFromDates || 30}
                    {...register("nightsMecca", { 
                      required: "Le nombre de nuitées est requis",
                      valueAsNumber: true,
                      validate: (value) => {
                        const total = (nightsMedina || 0) + (value || 0);
                        if (totalNightsFromDates > 0 && total !== totalNightsFromDates) {
                          return `Le total des nuitées doit être égal à ${totalNightsFromDates} nuits`;
                        }
                        return true;
                      }
                    })}
                    placeholder="Ex: 8"
                  />
                  {errors.nightsMecca && <p className="text-destructive text-sm">{errors.nightsMecca.message}</p>}
                </div>
              </div>

              {totalNightsFromDates > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Durée totale du séjour :</strong> {totalNightsFromDates} nuits
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Répartition actuelle :</strong> {nightsMedina || 0} nuits à Médine + {nightsMecca || 0} nuits à Makkah = {(nightsMedina || 0) + (nightsMecca || 0)} nuits
                  </p>
                  {totalNightsFromInputs !== totalNightsFromDates && (
                    <p className="text-amber-600 text-sm mt-2">
                      ⚠️ La répartition des nuitées ne correspond pas à la durée totale du séjour
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Informations hôtels</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🕌 Hôtel Médine</h4>
                  <div className="space-y-2">
                    <Label htmlFor="medinaHotelName">Nom de l'hôtel *</Label>
                    <Input
                      id="medinaHotelName"
                      {...register("medinaHotelName", { required: "Le nom de l'hôtel est requis" })}
                      placeholder="Ex: Pullman Zamzam Medina"
                    />
                    {errors.medinaHotelName && <p className="text-destructive text-sm">{errors.medinaHotelName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medinaHotelDistance">Distance de la mosquée (en mètres) *</Label>
                    <Input
                      id="medinaHotelDistance"
                      type="number"
                      min="0"
                      {...register("medinaHotelDistance", { required: "La distance est requise" })}
                      placeholder="200"
                    />
                    {errors.medinaHotelDistance && <p className="text-destructive text-sm">{errors.medinaHotelDistance.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🕋 Hôtel Makkah</h4>
                  <div className="space-y-2">
                    <Label htmlFor="meccaHotelName">Nom de l'hôtel *</Label>
                    <Input
                      id="meccaHotelName"
                      {...register("meccaHotelName", { required: "Le nom de l'hôtel est requis" })}
                      placeholder="Ex: Fairmont Makkah Clock Royal Tower"
                    />
                    {errors.meccaHotelName && <p className="text-destructive text-sm">{errors.meccaHotelName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meccaHotelDistance">Distance de la mosquée (en mètres) *</Label>
                    <Input
                      id="meccaHotelDistance"
                      type="number"
                      min="0"
                      {...register("meccaHotelDistance", { required: "La distance est requise" })}
                      placeholder="50"
                    />
                    {errors.meccaHotelDistance && <p className="text-destructive text-sm">{errors.meccaHotelDistance.message}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
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
                    <Label>Photo de couverture (obligatoire) *</Label>
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
                            <p className="text-sm text-muted-foreground">Cliquez pour ajouter une photo de couverture *</p>
                            <p className="text-xs text-destructive">Ce champ est obligatoire</p>
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
                        validate: {
                          lowerThanOriginal: (value) => {
                            const originalPrice = watch('originalPrice');
                            if (originalPrice && value && value >= originalPrice) {
                              return "Le prix de vente doit être inférieur au prix de base";
                            }
                            return true;
                          }
                        }
                      })}
                      placeholder="Ex: 2890"
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
                        validate: {
                          higherThanSalePrice: (value) => {
                            const salePrice = watch('price');
                            if (value && salePrice && value <= salePrice) {
                              return "Le prix de base doit être supérieur au prix de vente";
                            }
                            return true;
                          }
                        }
                      })}
                      placeholder="Ex: 4200"
                    />
                    {errors.originalPrice && <p className="text-destructive text-sm">{errors.originalPrice.message}</p>}
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPromotion"
                    checked={isPromotion}
                    onCheckedChange={(checked) => setValue("isPromotion", !!checked)}
                  />
                  <Label htmlFor="isPromotion">Cette annonce est une promotion</Label>
                </div>

                {isPromotion && (
                  <div className="space-y-2">
                    <Label htmlFor="promotionEndDate">Date de fin de promotion</Label>
                    <Input
                      id="promotionEndDate"
                      type="date"
                      {...register("promotionEndDate")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

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
                  <p className="text-sm text-muted-foreground">
                    L'annonce sera automatiquement supprimée après cette date
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Informations de contact affichées</h4>
                   <div className="space-y-6">
                     <div className="flex items-center justify-between">
                       <Label htmlFor="showEmail" className="text-sm font-medium">Afficher l'email (recommandé)</Label>
                       <Switch
                         id="showEmail"
                         checked={watch("showEmail")}
                         onCheckedChange={(checked) => setValue("showEmail", checked)}
                       />
                     </div>
                     <div className="flex items-center justify-between">
                       <Label htmlFor="showPhone" className="text-sm font-medium">Afficher le téléphone portable</Label>
                       <Switch
                         id="showPhone"
                         checked={watch("showPhone")}
                         onCheckedChange={(checked) => setValue("showPhone", checked)}
                       />
                     </div>
                     <div className="flex items-center justify-between">
                       <Label htmlFor="showWhatsapp" className="text-sm font-medium">Afficher WhatsApp</Label>
                       <Switch
                         id="showWhatsapp"
                         checked={watch("showWhatsapp")}
                         onCheckedChange={(checked) => setValue("showWhatsapp", checked)}
                       />
                     </div>
                     <div className="flex items-center justify-between">
                       <Label htmlFor="showProfessionalPhone" className="text-sm font-medium">Afficher le téléphone fixe (professionnel)</Label>
                       <Switch
                         id="showProfessionalPhone"
                         checked={watch("showProfessionalPhone")}
                         onCheckedChange={(checked) => setValue("showProfessionalPhone", checked)}
                       />
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                {/* Titre et formule */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                      {formula.name}
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
                      <span>{(watch("nightsMedina") || 0) + (watch("nightsMecca") || 0)} Nuits</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{watch("nightsMedina") || 0} Nuitées à Médine</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{watch("nightsMecca") || 0} Nuitées à Makkah</span>
                    </li>
                    {watch('medinaHotelName') && (
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>🕌 {watch('medinaHotelName')}</span>
                      </li>
                    )}
                    {watch('meccaHotelName') && (
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>🕋 {watch('meccaHotelName')}</span>
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
    <div className="max-w-4xl mx-auto space-y-8 pb-32 md:pb-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-16 h-16 ${formula.color} rounded-2xl flex items-center justify-center shadow-large`}>
            <span className="text-2xl text-white font-bold">
              {formula.rating && typeof formula.rating === 'string' ? formula.rating.charAt(0) : '★'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Séjour Omra {formula.name}</h1>
            <p className="text-muted-foreground">{formula.rating} - Package complet</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Progress indicator */}
        <div className="w-full bg-muted rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Étape {currentStep} sur {totalSteps}
            {currentStep === 6 ? " - Récapitulatif" : ""}
          </p>
        </div>

        {renderStep()}

        {/* Navigation */}
<div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/40 p-4 sm:p-6 -mx-4 sm:-mx-6 mt-8 shadow-xl z-50">
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
                    onClick={() => handleSaveDraft(watch())}
                    className="px-6 w-full sm:w-auto h-12"
                  >
                    💾 Sauvegarder comme brouillon
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => handlePublish(watch())}
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
                  onClick={currentStep === 1 ? handleBack : handlePrevious}
                  className="w-full sm:w-auto h-12 px-6 border-2 hover:border-primary transition-colors"
                >
                  {currentStep === 1 ? 'Retour' : 'Précédent'}
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="btn-modern px-8 w-full sm:w-auto h-12 shadow-lg"
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

export default SejourFormMultiStep;