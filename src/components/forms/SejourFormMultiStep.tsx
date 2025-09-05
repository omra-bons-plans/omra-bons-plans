import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Upload, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SejourFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  airline: string;
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
  isPromotion: boolean;
  promotionEndDate?: string;
}

interface SejourFormMultiStepProps {
  formulaType: string;
  onSubmit: (data: SejourFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
}

const SejourFormMultiStep = ({ formulaType, onSubmit, onBack }: SejourFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<SejourFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      isPromotion: false,
    }
  });

  const totalSteps = 4;
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
        fieldsToValidate = ['title', 'description', 'airline', 'departureDate', 'returnDate'];
        break;
      case 2:
        // Hotel information - no required validation needed
        break;
      case 3:
        fieldsToValidate = ['price'];
        break;
      case 4:
        fieldsToValidate = ['publishEndDate'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (data: SejourFormData) => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Le titre est requis" })}
                    placeholder="Ex: Omra Confort 5★ - 15 jours"
                  />
                  {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airline">Compagnie aérienne *</Label>
                  <Select onValueChange={(value) => setValue("airline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la compagnie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emirates">Emirates</SelectItem>
                      <SelectItem value="saudia">Saudia</SelectItem>
                      <SelectItem value="air-france">Air France</SelectItem>
                      <SelectItem value="turkish">Turkish Airlines</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète *</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "La description est requise" })}
                  placeholder="Décrivez votre séjour Omra en détail..."
                  rows={4}
                />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>

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
                    {...register("returnDate", { required: "La date de retour est requise" })}
                  />
                  {errors.returnDate && <p className="text-destructive text-sm">{errors.returnDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nightsMedina">Nombre de nuitées à Médine</Label>
                  <Input
                    id="nightsMedina"
                    type="number"
                    min="0"
                    {...register("nightsMedina", { valueAsNumber: true })}
                    placeholder="Ex: 4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nightsMecca">Nombre de nuitées à Makkah</Label>
                  <Input
                    id="nightsMecca"
                    type="number"
                    min="0"
                    {...register("nightsMecca", { valueAsNumber: true })}
                    placeholder="Ex: 8"
                  />
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
                <MapPin className="w-5 h-5" />
                <span>Informations hôtels</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🕌 Hôtel Médine</h4>
                  <div className="space-y-2">
                    <Label htmlFor="medinaHotelName">Nom de l'hôtel</Label>
                    <Input
                      id="medinaHotelName"
                      {...register("medinaHotelName")}
                      placeholder="Ex: Pullman Zamzam Medina"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medinaHotelDistance">Distance de la mosquée</Label>
                    <Input
                      id="medinaHotelDistance"
                      {...register("medinaHotelDistance")}
                      placeholder="Ex: 200m de Masjid Al-Nabawi"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🕋 Hôtel Makkah</h4>
                  <div className="space-y-2">
                    <Label htmlFor="meccaHotelName">Nom de l'hôtel</Label>
                    <Input
                      id="meccaHotelName"
                      {...register("meccaHotelName")}
                      placeholder="Ex: Fairmont Makkah Clock Royal Tower"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meccaHotelDistance">Distance de la mosquée</Label>
                    <Input
                      id="meccaHotelDistance"
                      {...register("meccaHotelDistance")}
                      placeholder="Ex: 50m du Masjid Al-Haram"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
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
                            <p className="text-sm text-muted-foreground">Cliquez pour ajouter une photo de couverture</p>
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
                      {...register("price", { required: "Le prix est requis", valueAsNumber: true })}
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
                      {...register("originalPrice", { valueAsNumber: true })}
                      placeholder="Ex: 4200"
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
          </div>
        );

      case 4:
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
                <p className="text-sm text-muted-foreground">
                  L'annonce sera automatiquement supprimée après cette date
                </p>
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
          <div className={`w-16 h-16 ${formula.color} rounded-2xl flex items-center justify-center shadow-large`}>
            <span className="text-2xl text-white font-bold">{formula.rating.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Séjour Omra {formula.name}</h1>
            <p className="text-muted-foreground">{formula.rating} - Package complet</p>
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

export default SejourFormMultiStep;