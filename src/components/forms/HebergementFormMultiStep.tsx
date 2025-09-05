import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Hotel, Upload, Calendar, DollarSign, MapPin, Bed, Wifi, Snowflake, Tv, Refrigerator, WashingMachine, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressBar from "@/components/ui/ProgressBar";

interface HebergementFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  city: string;
  accommodationType: string;
  name: string;
  distanceToMosque?: string;
  availableFrom?: string;
  availableTo?: string;
  roomsCount?: number;
  bedsCount?: number;
  hasLivingRoom: boolean;
  hasWifi: boolean;
  hasAc: boolean;
  hasTv: boolean;
  hasFridge: boolean;
  hasWashingMachine: boolean;
  videoUrl?: string;
  publishEndDate: string;
  showEmail: boolean;
  showPhone: boolean;
  isPromotion: boolean;
  promotionEndDate?: string;
}

interface HebergementFormMultiStepProps {
  onSubmit: (data: HebergementFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
}

const HebergementFormMultiStep = ({ onSubmit, onBack }: HebergementFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger, control } = useForm<HebergementFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      isPromotion: false,
      hasLivingRoom: false,
      hasWifi: false,
      hasAc: false,
      hasTv: false,
      hasFridge: false,
      hasWashingMachine: false,
    }
  });

  const watchedCity = watch('city');
  const watchedAccommodationType = watch('accommodationType');

  const totalSteps = 6;
  const steps = ["Informations de base", "Dates et détails", "Commodités", "Photos et médias", "Prix et publication", "Récapitulatif"];

  const nextStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        // Valider titre, description, ville, type et nom (si hôtel)
        if (watchedAccommodationType === 'hotel') {
          isValid = await trigger(['title', 'description', 'city', 'accommodationType', 'name']);
        } else {
          isValid = await trigger(['title', 'description', 'city', 'accommodationType']);
        }
        break;
      case 2:
        // Valider lits (obligatoire), chambres (si appartement) et dates
        const fieldsToValidate: (keyof HebergementFormData)[] = ['bedsCount'];
        if (watchedAccommodationType === 'apartment') {
          fieldsToValidate.push('roomsCount');
        }
        // Ajouter la validation des dates si elles sont renseignées
        const availableFrom = watch('availableFrom');
        const availableTo = watch('availableTo');
        if (availableFrom || availableTo) {
          fieldsToValidate.push('availableFrom', 'availableTo');
        }
        isValid = await trigger(fieldsToValidate);
        break;
      case 3:
        isValid = true; // Commodités et vidéo sont optionnelles
        break;
      case 4:
        isValid = !!coverImage; // Cover image is required
        if (!isValid) {
          alert("Une photo de couverture est obligatoire");
        }
        break;
      case 5:
        isValid = await trigger(['price', 'publishEndDate']);
        break;
      case 6:
        // Récapitulatif, pas de validation nécessaire
        isValid = true;
        break;
    }
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const files = event.target.files;
    if (files) {
      if (isCover) {
        setCoverImage(files[0]);
      } else {
        const newImages = Array.from(files);
        const totalImages = images.length + newImages.length;
        if (totalImages <= 6) {
          setImages([...images, ...newImages]);
        } else {
          alert(`Vous ne pouvez ajouter que ${6 - images.length} photo(s) supplémentaire(s)`);
        }
      }
    }
  };

  const removeImage = (index: number, isCover: boolean = false) => {
    if (isCover) {
      setCoverImage(null);
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const calculateDiscount = () => {
    const price = watch('price');
    const originalPrice = watch('originalPrice');
    if (price && originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const onSubmitForm = (data: HebergementFormData, saveAsDraft = false) => {
    const formDataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage
    };
    onSubmit(formDataWithImages, saveAsDraft);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hotel className="w-5 h-5" />
                  <span>Informations de base</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Le titre est obligatoire" })}
                    placeholder="Ex: Appartement 2 chambres proche Haram"
                  />
                  {errors.title && <span className="text-destructive text-sm">{errors.title.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "La description est obligatoire" })}
                    placeholder="Décrivez votre hébergement en détail..."
                    rows={4}
                  />
                  {errors.description && <span className="text-destructive text-sm">{errors.description.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "Veuillez sélectionner une ville" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="makkah">Makkah (La Mecque)</SelectItem>
                            <SelectItem value="medina">Médine</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.city && <span className="text-destructive text-sm">{errors.city.message}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accommodationType">Type d'hébergement *</Label>
                    <Controller
                      name="accommodationType"
                      control={control}
                      rules={{ required: "Veuillez sélectionner un type" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hotel">Hôtel</SelectItem>
                            <SelectItem value="apartment">Appartement</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.accommodationType && <span className="text-destructive text-sm">{errors.accommodationType.message}</span>}
                  </div>
                </div>

                {/* Nom uniquement pour les hôtels */}
                {watchedAccommodationType === 'hotel' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de l'hôtel *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: watchedAccommodationType === 'hotel' ? "Le nom de l'hôtel est obligatoire" : false })}
                      placeholder="Ex: Hôtel Hilton Makkah"
                    />
                    {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Dates et détails</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceToMosque">
                    Distance en mètres jusqu'à {watchedCity === 'medina' ? 'la mosquée du Prophète' : 'la mosquée Al-Haram'}
                  </Label>
                  <Input
                    id="distanceToMosque"
                    {...register("distanceToMosque")}
                    placeholder="Ex: 500"
                    type="number"
                  />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="availableFrom">Disponible à partir du</Label>
                     <Input
                       type="date"
                       id="availableFrom"
                       {...register("availableFrom", {
                         validate: {
                           beforeEndDate: (value) => {
                             const availableTo = watch('availableTo');
                             if (value && availableTo) {
                               return new Date(value) <= new Date(availableTo) || "La date de début doit être antérieure à la date de fin";
                             }
                             return true;
                           }
                         }
                       })}
                     />
                     {errors.availableFrom && <span className="text-destructive text-sm">{errors.availableFrom.message}</span>}
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="availableTo">Disponible jusqu'au</Label>
                     <Input
                       type="date"
                       id="availableTo"
                       {...register("availableTo", {
                         validate: {
                           afterStartDate: (value) => {
                             const availableFrom = watch('availableFrom');
                             if (value && availableFrom) {
                               return new Date(value) >= new Date(availableFrom) || "La date de fin doit être postérieure à la date de début";
                             }
                             return true;
                           }
                         }
                       })}
                     />
                     {errors.availableTo && <span className="text-destructive text-sm">{errors.availableTo.message}</span>}
                   </div>
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Chambres uniquement pour les appartements */}
                  {watchedAccommodationType === 'apartment' && (
                    <div className="space-y-2">
                      <Label htmlFor="roomsCount">Nombre de chambres *</Label>
                      <Input
                        type="number"
                        id="roomsCount"
                        {...register("roomsCount", { min: 1, required: watchedAccommodationType === 'apartment' ? "Le nombre de chambres est obligatoire" : false })}
                        min="1"
                        placeholder="1"
                      />
                      {errors.roomsCount && <span className="text-destructive text-sm">{errors.roomsCount.message}</span>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bedsCount">Nombre de lits *</Label>
                    <Input
                      type="number"
                      id="bedsCount"
                      {...register("bedsCount", { min: 1, required: "Le nombre de lits est obligatoire" })}
                      min="1"
                      placeholder="1"
                    />
                    {errors.bedsCount && <span className="text-destructive text-sm">{errors.bedsCount.message}</span>}
                  </div>

                  {/* Salon uniquement pour les appartements */}
                  {watchedAccommodationType === 'apartment' && (
                    <div className="flex items-center space-x-2 mt-8">
                      <Controller
                        name="hasLivingRoom"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="hasLivingRoom"
                          />
                        )}
                      />
                      <Label htmlFor="hasLivingRoom" className="text-sm">Salon disponible</Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {watchedAccommodationType === 'apartment' ? 'Commodités disponibles' : 'Informations supplémentaires'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchedAccommodationType === 'apartment' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Controller
                          name="hasWifi"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="hasWifi"
                            />
                          )}
                        />
                        <Label htmlFor="hasWifi" className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4" />
                          <span>Wi-Fi gratuit</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="hasAc"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="hasAc"
                            />
                          )}
                        />
                        <Label htmlFor="hasAc" className="flex items-center space-x-2">
                          <Snowflake className="w-4 h-4" />
                          <span>Climatisation</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="hasTv"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="hasTv"
                            />
                          )}
                        />
                        <Label htmlFor="hasTv" className="flex items-center space-x-2">
                          <Tv className="w-4 h-4" />
                          <span>Télévision</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="hasFridge"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="hasFridge"
                            />
                          )}
                        />
                        <Label htmlFor="hasFridge" className="flex items-center space-x-2">
                          <Refrigerator className="w-4 h-4" />
                          <span>Réfrigérateur</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="hasWashingMachine"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="hasWashingMachine"
                            />
                          )}
                        />
                        <Label htmlFor="hasWashingMachine" className="flex items-center space-x-2">
                          <WashingMachine className="w-4 h-4" />
                          <span>Lave-linge</span>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <Label htmlFor="videoUrl" className="flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>Lien vidéo (YouTube/Vimeo)</span>
                      </Label>
                      <Input
                        id="videoUrl"
                        {...register("videoUrl")}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-sm text-muted-foreground">
                        Ajoutez un lien vers une vidéo de présentation de votre appartement
                      </p>
                    </div>
                  </>
                )}

                {watchedAccommodationType === 'hotel' && (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Aucune information supplémentaire n'est requise pour les hôtels.</p>
                    <p>Cliquez sur "Suivant" pour continuer.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Photos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Photo de couverture * (obligatoire)</Label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border p-6">
                      <div className="text-center">
                        {coverImage ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(coverImage)}
                              alt="Couverture"
                              className="mx-auto h-32 w-48 object-cover rounded-lg"
                            />
                            <Button
                              onClick={() => removeImage(0, true)}
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                              <label
                                htmlFor="cover-upload"
                                className="relative cursor-pointer rounded-md bg-background font-semibold text-primary hover:text-primary/80"
                              >
                                <span>Télécharger une photo</span>
                                <input
                                  id="cover-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                              </label>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF jusqu'à 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Photos supplémentaires (maximum 6)</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Photo ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <Button
                            onClick={() => removeImage(index)}
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      {images.length < 6 && (
                        <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border hover:border-primary">
                          <div className="text-center">
                            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                            <span className="mt-1 text-xs text-muted-foreground">Ajouter</span>
                          </div>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e)}
                          />
                        </label>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {images.length}/6 photos ajoutées
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Prix et publication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix de vente (€) *</Label>
                    <Input
                      type="number"
                      id="price"
                      {...register("price", { required: "Le prix est obligatoire", min: 1 })}
                      min="1"
                      step="0.01"
                      placeholder="150"
                    />
                    {errors.price && <span className="text-destructive text-sm">{errors.price.message}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Prix original (€)</Label>
                    <Input
                      type="number"
                      id="originalPrice"
                      {...register("originalPrice", { min: 1 })}
                      min="1"
                      step="0.01"
                      placeholder="200"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optionnel - pour afficher une réduction
                    </p>
                  </div>
                </div>

                {calculateDiscount() > 0 && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        -{calculateDiscount()}%
                      </Badge>
                      <span className="text-sm font-medium">
                        Réduction de {calculateDiscount()}% affichée
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Controller
                    name="isPromotion"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isPromotion"
                      />
                    )}
                  />
                  <Label htmlFor="isPromotion">Marquer comme promotion temporaire</Label>
                </div>

                {watch('isPromotion') && (
                  <div className="space-y-2">
                    <Label htmlFor="promotionEndDate">Date de fin de promotion</Label>
                    <Input
                      type="datetime-local"
                      id="promotionEndDate"
                      {...register("promotionEndDate")}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="publishEndDate">Date de fin de publication *</Label>
                  <Input
                    type="date"
                    id="publishEndDate"
                    {...register("publishEndDate", { required: "La date de fin est obligatoire" })}
                  />
                  <p className="text-xs text-muted-foreground">
                    L'annonce sera automatiquement supprimée après cette date
                  </p>
                  {errors.publishEndDate && <span className="text-destructive text-sm">{errors.publishEndDate.message}</span>}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Informations de contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="showEmail"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="showEmail"
                          />
                        )}
                      />
                      <Label htmlFor="showEmail">Afficher l'email (recommandé)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="showPhone"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="showPhone"
                          />
                        )}
                      />
                      <Label htmlFor="showPhone">Afficher le téléphone</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hotel className="w-5 h-5" />
                  <span>Récapitulatif de votre annonce</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informations générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Titre</Label>
                      <p className="font-medium">{watch('title') || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Ville</Label>
                      <p className="font-medium">
                        {watch('city') === 'makkah' ? 'Makkah (La Mecque)' : watch('city') === 'medina' ? 'Médine' : 'Non sélectionnée'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Type d'hébergement</Label>
                      <p className="font-medium">
                        {watch('accommodationType') === 'hotel' ? 'Hôtel' : watch('accommodationType') === 'apartment' ? 'Appartement' : 'Non sélectionné'}
                      </p>
                    </div>
                    {watchedAccommodationType === 'hotel' && watch('name') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Nom de l'hôtel</Label>
                        <p className="font-medium">{watch('name')}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="font-medium">{watch('description') || 'Non renseignée'}</p>
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Détails et disponibilités</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {watch('distanceToMosque') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Distance jusqu'à {watchedCity === 'medina' ? 'la mosquée du Prophète' : 'la mosquée Al-Haram'}
                        </Label>
                        <p className="font-medium">{watch('distanceToMosque')} mètres</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm text-muted-foreground">Nombre de lits</Label>
                      <p className="font-medium">{watch('bedsCount') || 'Non renseigné'}</p>
                    </div>
                    {watchedAccommodationType === 'apartment' && watch('roomsCount') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Nombre de chambres</Label>
                        <p className="font-medium">{watch('roomsCount')}</p>
                      </div>
                    )}
                    {watch('availableFrom') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Disponible du</Label>
                        <p className="font-medium">{watch('availableFrom')} au {watch('availableTo') || 'Non définie'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commodités (seulement pour appartements) */}
                {watchedAccommodationType === 'apartment' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg">Commodités</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {watch('hasLivingRoom') && <Badge variant="secondary">Salon</Badge>}
                      {watch('hasWifi') && <Badge variant="secondary">Wi-Fi</Badge>}
                      {watch('hasAc') && <Badge variant="secondary">Climatisation</Badge>}
                      {watch('hasTv') && <Badge variant="secondary">Télévision</Badge>}
                      {watch('hasFridge') && <Badge variant="secondary">Réfrigérateur</Badge>}
                      {watch('hasWashingMachine') && <Badge variant="secondary">Lave-linge</Badge>}
                    </div>
                    {watch('videoUrl') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Lien vidéo</Label>
                        <p className="font-medium">{watch('videoUrl')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Prix */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Prix et publication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Prix de vente</Label>
                      <p className="font-medium text-lg">{watch('price')}€</p>
                    </div>
                    {watch('originalPrice') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Prix original</Label>
                        <p className="font-medium line-through">{watch('originalPrice')}€</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm text-muted-foreground">Date de fin de publication</Label>
                      <p className="font-medium">{watch('publishEndDate')}</p>
                    </div>
                    {watch('isPromotion') && watch('promotionEndDate') && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Promotion jusqu'au</Label>
                        <p className="font-medium">{watch('promotionEndDate')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Informations de contact</h3>
                  <div className="flex gap-4">
                    {watch('showEmail') && <Badge variant="outline">Email affiché</Badge>}
                    {watch('showPhone') && <Badge variant="outline">Téléphone affiché</Badge>}
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Photos</h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      {coverImage ? '1 photo de couverture' : 'Aucune photo de couverture'}
                    </Badge>
                    <Badge variant="secondary">
                      {images.length} photo{images.length > 1 ? 's' : ''} supplémentaire{images.length > 1 ? 's' : ''}
                    </Badge>
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

  return (
    <div className="space-y-6 pb-24">
      {renderStep()}
      
      <div className="flex justify-end pt-6">
        <div className="space-x-2">
          {currentStep === totalSteps ? (
            <>
              <Button 
                onClick={handleSubmit((data) => onSubmitForm(data, true))} 
                variant="outline"
              >
                Sauvegarder brouillon
              </Button>
              <Button onClick={handleSubmit((data) => onSubmitForm(data, false))}>
                Publier l'annonce
              </Button>
            </>
          ) : (
            <Button onClick={nextStep}>
              Suivant
            </Button>
          )}
        </div>
      </div>

      <ProgressBar 
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />
    </div>
  );
};

export default HebergementFormMultiStep;