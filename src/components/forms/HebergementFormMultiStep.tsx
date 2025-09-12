import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Hotel, Upload, Calendar, DollarSign, MapPin, Bed, Wifi, Snowflake, Tv, Refrigerator, WashingMachine, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressBar from "@/components/ui/ProgressBar";
import { getImageUrl } from "@/utils/imageUtils";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { compressImage, isImageFile, formatFileSize } from "@/utils/imageCompression";
import { toast } from "sonner";

// Component pour l'aperçu vidéo
const VideoPreview = ({ url }: { url: string }) => {
  const getVideoEmbed = (url: string) => {
    // YouTube patterns (including Shorts)
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <div className="aspect-[9/16] w-full max-w-xs mx-auto">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    }

    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <div className="aspect-[9/16] w-full max-w-xs mx-auto">
          <iframe
            width="100%"
            height="100%"
            src={`https://player.vimeo.com/video/${videoId}`}
            title="Vimeo video preview"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    }

    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-muted-foreground">
        <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>URL vidéo non reconnue. Veuillez utiliser un lien YouTube ou Vimeo valide.</p>
      </div>
    );
  };

  return getVideoEmbed(url);
};

interface HebergementFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  city: string;
  accommodationType: string;
  name: string;
  distanceToMosque?: string;
  walkingMinutes?: number;
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
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
  isPromotion: boolean;
  promotionEndDate?: string;
}

interface HebergementFormMultiStepProps {
  onSubmit: (data: HebergementFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const HebergementFormMultiStep = ({ onSubmit, onBack, initialData, isEditing }: HebergementFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger, control, reset } = useForm<HebergementFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      showWhatsapp: false,
      showProfessionalPhone: false,
      isPromotion: false,
      hasLivingRoom: false,
      hasWifi: false,
      hasAc: false,
      hasTv: false,
      hasFridge: false,
      hasWashingMachine: false,
      accommodationType: 'hotel',
      roomsCount: 1,
      bedsCount: 1,
      ...initialData
    }
  });

  // Handle initial data for editing
  useEffect(() => {
    if (initialData && isEditing) {
      reset({
        showEmail: true,
        showPhone: false,
        showWhatsapp: false,
        showProfessionalPhone: false,
        isPromotion: false,
        hasLivingRoom: false,
        hasWifi: false,
        hasAc: false,
        hasTv: false,
        hasFridge: false,
        hasWashingMachine: false,
        accommodationType: 'hotel',
        roomsCount: 1,
        bedsCount: 1,
        ...initialData
      });
      
      if (initialData.existingImages) {
        setExistingImages(initialData.existingImages);
      }
    }
  }, [initialData, isEditing, reset]);

  const watchedCity = watch('city');
  const watchedAccommodationType = watch('accommodationType');

  const totalSteps = 6;
  const steps = ["Informations de base", "Dates et détails", "Commodités", "Photos et médias", "Prix et publication", "Récapitulatif"];

  // Scroll vers le haut quand l'étape change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

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
    
    if (isValid) {
      // Pour les hôtels, passer de l'étape 2 directement à l'étape 4 (photos)
      if (currentStep === 2 && watchedAccommodationType === 'hotel') {
        setCurrentStep(4);
      } else if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Pour les hôtels, passer de l'étape 4 directement à l'étape 2 (sauter l'étape 3)
      if (currentStep === 4 && watchedAccommodationType === 'hotel') {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    try {
      if (isCover) {
        const file = files[0];
        if (!isImageFile(file)) {
          toast.error('Veuillez sélectionner un fichier image valide');
          return;
        }
        
        toast.loading('Compression de l\'image en cours...');
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeKB: 1024
        });
        
        toast.dismiss();
        toast.success(`Image compressée : ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
        setCoverImage(compressedFile);
      } else {
        const newFiles = Array.from(files);
        const totalImages = images.length + newFiles.length;
        
        if (totalImages > 6) {
          toast.error(`Vous ne pouvez ajouter que ${6 - images.length} photo(s) supplémentaire(s)`);
          return;
        }
        
        // Vérifier que tous les fichiers sont des images
        const invalidFiles = newFiles.filter(file => !isImageFile(file));
        if (invalidFiles.length > 0) {
          toast.error('Certains fichiers ne sont pas des images valides');
          return;
        }
        
        toast.loading(`Compression de ${newFiles.length} image(s) en cours...`);
        
        const compressedFiles = await Promise.all(
          newFiles.map(file => 
            compressImage(file, {
              maxWidth: 1920,
              maxHeight: 1920,
              quality: 0.8,
              maxSizeKB: 1024
            })
          )
        );
        
        toast.dismiss();
        
        const originalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
        const compressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
        
        toast.success(`${newFiles.length} image(s) compressée(s) : ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`);
        setImages([...images, ...compressedFiles]);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors de la compression de l\'image');
      console.error('Erreur de compression:', error);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
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
      coverImage: coverImage,
      existingImages: existingImages,
      coverImageUrl: initialData?.coverImageUrl
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
                <CardTitle className="text-center">
                  Informations de base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    {...register("title", { 
                      required: "Le titre est obligatoire",
                      minLength: {
                        value: 10,
                        message: "Le titre doit contenir au moins 10 caractères"
                      },
                      maxLength: {
                        value: 20,
                        message: "Le titre ne peut pas dépasser 20 caractères"
                      }
                    })}
                    placeholder="Ex: Appart proche Haram"
                    maxLength={20}
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      setValue('title', upperValue, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                    <span className={errors.title ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {errors.title?.message}
                    </span>
                    <span className="text-muted-foreground text-right">{watch('title')?.length || 0}/20</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description", { 
                      required: "La description est obligatoire",
                      minLength: {
                        value: 20,
                        message: "La description doit contenir au moins 20 caractères"
                      },
                      maxLength: {
                        value: 500,
                        message: "La description ne peut pas dépasser 500 caractères"
                      }
                    })}
                    placeholder="Décrivez votre hébergement en détail..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                    <span className={errors.description ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {errors.description?.message || "La description doit contenir au moins 20 caractères"}
                    </span>
                    <span className="text-muted-foreground text-right">{watch('description')?.length || 0}/500</span>
                  </div>
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
                <CardTitle className="text-center">
                  Dates et détails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="walkingMinutes">
                      Combien de minutes à pied
                    </Label>
                    <Input
                      id="walkingMinutes"
                      {...register("walkingMinutes")}
                      placeholder="Ex: 10"
                      type="number"
                    />
                  </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="availableFrom">Disponible à partir du</Label>
                      <Input
                        type="date"
                        id="availableFrom"
                        min={new Date().toISOString().split('T')[0]}
                        {...register("availableFrom", {
                          validate: {
                            notInPast: (value) => {
                              if (value) {
                                const today = new Date().toISOString().split('T')[0];
                                if (value < today) {
                                  return "La date ne peut pas être antérieure à aujourd'hui";
                                }
                              }
                              return true;
                            },
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
                        min={watch('availableFrom') || new Date().toISOString().split('T')[0]}
                        {...register("availableTo", {
                          validate: {
                            notInPast: (value) => {
                              if (value) {
                                const today = new Date().toISOString().split('T')[0];
                                if (value < today) {
                                  return "La date ne peut pas être antérieure à aujourd'hui";
                                }
                              }
                              return true;
                            },
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
        // Afficher l'étape commodités seulement pour les appartements
        if (watchedAccommodationType !== 'apartment') {
          return null; // Ne rien afficher si ce n'est pas un appartement
        }
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commodités disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Controller
                    name="hasWifi"
                    control={control}
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className="h-20 flex-col space-y-2 relative"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Wifi className="w-6 h-6" />
                        <span className="text-sm">Wi-Fi gratuit</span>
                        {field.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    )}
                  />

                  <Controller
                    name="hasAc"
                    control={control}
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className="h-20 flex-col space-y-2 relative"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Snowflake className="w-6 h-6" />
                        <span className="text-sm">Climatisation</span>
                        {field.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    )}
                  />

                  <Controller
                    name="hasTv"
                    control={control}
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className="h-20 flex-col space-y-2 relative"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Tv className="w-6 h-6" />
                        <span className="text-sm">Télévision</span>
                        {field.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    )}
                  />

                  <Controller
                    name="hasFridge"
                    control={control}
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className="h-20 flex-col space-y-2 relative"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Refrigerator className="w-6 h-6" />
                        <span className="text-sm">Réfrigérateur</span>
                        {field.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    )}
                  />

                  <Controller
                    name="hasWashingMachine"
                    control={control}
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        className="h-20 flex-col space-y-2 relative"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <WashingMachine className="w-6 h-6" />
                        <span className="text-sm">Lave-linge</span>
                        {field.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    )}
                  />
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
                  
                  {/* Video Preview */}
                  {watch('videoUrl') && (
                    <div className="mt-4">
                      <Label className="text-sm text-muted-foreground">Aperçu de la vidéo</Label>
                      <VideoPreview url={watch('videoUrl')} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Photos
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
                        ) : initialData?.coverImageUrl ? (
                          <div className="relative">
                            <ImageWithFallback
                              src={getImageUrl(initialData.coverImageUrl)}
                              alt="Couverture existante"
                              className="mx-auto h-32 w-48 object-cover rounded-lg"
                            />
                            <div className="mt-2">
                              <label
                                htmlFor="cover-upload-replace"
                                className="inline-flex cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                              >
                                <span>Remplacer</span>
                                <input
                                  id="cover-upload-replace"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                              </label>
                            </div>
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
                      {/* Existing images from database */}
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <ImageWithFallback
                            src={getImageUrl(imageUrl)}
                            alt={`Photo existante ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <Button
                            onClick={() => removeExistingImage(index)}
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                          <Badge className="absolute bottom-1 left-1 text-xs">
                            Existante
                          </Badge>
                        </div>
                      ))}
                      
                      {/* New images to upload */}
                      {images.map((image, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Nouvelle photo ${index + 1}`}
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
                          <Badge className="absolute bottom-1 left-1 text-xs bg-green-500">
                            Nouvelle
                          </Badge>
                        </div>
                      ))}
                      
                      {(existingImages.length + images.length) < 6 && (
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
                <CardTitle className="text-center">
                  Prix et publication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {watchedAccommodationType === 'apartment' ? 'Prix à la nuitée (€) *' : 'Prix de la location (€) *'}
                    </Label>
                    <Input
                      type="number"
                      id="price"
                      {...register("price", { 
                        required: "Le prix est obligatoire", 
                        min: { value: 1, message: "Le prix doit être supérieur à 0" },
                        validate: {
                          lowerThanOriginal: (value) => {
                            const originalPrice = watch('originalPrice');
                            if (originalPrice && value && parseFloat(String(value)) >= parseFloat(String(originalPrice))) {
                              return "Le prix de location doit être inférieur au prix original";
                            }
                            return true;
                          }
                        }
                      })}
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
                      {...register("originalPrice", { 
                        min: { value: 1, message: "Le prix doit être supérieur à 0" },
                        validate: {
                          higherThanSale: (value) => {
                            const salePrice = watch('price');
                            if (value && salePrice && parseFloat(String(value)) <= parseFloat(String(salePrice))) {
                              return "Le prix original doit être supérieur au prix de location";
                            }
                            return true;
                          }
                        }
                      })}
                      min="1"
                      step="0.01"
                      placeholder="200"
                    />
                    {errors.originalPrice && <span className="text-destructive text-sm">{errors.originalPrice.message}</span>}
                    <p className="text-xs text-muted-foreground">
                      Optionnel - pour afficher une réduction
                    </p>
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
                    min={new Date().toISOString().split('T')[0]}
                    {...register("publishEndDate", { 
                      required: "La date de fin est obligatoire",
                      validate: (value) => {
                        const today = new Date().toISOString().split('T')[0];
                        if (value && value < today) {
                          return "La date de fin de publication ne peut pas être antérieure à aujourd'hui";
                        }
                        return true;
                      }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    L'annonce sera automatiquement supprimée après cette date
                  </p>
                  {errors.publishEndDate && <span className="text-destructive text-sm">{errors.publishEndDate.message}</span>}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Informations de contact</h4>
                   <div className="space-y-6">
                     <div className="flex items-center justify-between">
                       <Label htmlFor="showEmail" className="text-sm font-medium">Afficher l'email (recommandé)</Label>
                       <Controller
                         name="showEmail"
                         control={control}
                         render={({ field }) => (
                           <Switch
                             checked={field.value}
                             onCheckedChange={field.onChange}
                             id="showEmail"
                           />
                         )}
                       />
                     </div>

                     <div className="flex items-center justify-between">
                       <Label htmlFor="showPhone" className="text-sm font-medium">Afficher le téléphone portable</Label>
                       <Controller
                         name="showPhone"
                         control={control}
                         render={({ field }) => (
                           <Switch
                             checked={field.value}
                             onCheckedChange={field.onChange}
                             id="showPhone"
                           />
                         )}
                       />
                     </div>

                     <div className="flex items-center justify-between">
                       <Label htmlFor="showWhatsapp" className="text-sm font-medium">Afficher WhatsApp</Label>
                       <Controller
                         name="showWhatsapp"
                         control={control}
                         render={({ field }) => (
                           <Switch
                             checked={field.value}
                             onCheckedChange={field.onChange}
                             id="showWhatsapp"
                           />
                         )}
                       />
                     </div>

                     <div className="flex items-center justify-between">
                       <Label htmlFor="showProfessionalPhone" className="text-sm font-medium">Afficher le téléphone fixe (professionnel)</Label>
                       <Controller
                         name="showProfessionalPhone"
                         control={control}
                         render={({ field }) => (
                           <Switch
                             checked={field.value}
                             onCheckedChange={field.onChange}
                             id="showProfessionalPhone"
                           />
                         )}
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
          <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 px-6 py-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Vérifiez votre annonce
              </h1>
              <p className="text-gray-600">
                Voici ce que les voyageurs verront. Assurez-vous que tout est correct.
              </p>
            </div>

            {/* Preview Card */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-6 mx-6">
              {/* Image Section */}
              <div className="relative h-64 bg-gray-200">
                {coverImage ? (
                  <div className="relative h-full">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Photo de couverture"
                      className="w-full h-full object-cover"
                    />
                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {images.map((_, index) => (
                        <div key={index} className="w-2 h-2 bg-white/60 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Upload className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Title and Distance */}
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    {watch('title') || 'Titre de votre annonce'}
                  </h2>
                  {watch('distanceToMosque') && (
                    <span className="text-sm text-gray-500">
                      {watch('distanceToMosque')} mètres
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {watch('price') || '0'}€
                  </span>
                  {watch('originalPrice') && watch('originalPrice') > watch('price') && (
                    <span className="text-lg text-red-500 line-through">
                      {watch('originalPrice')}€
                    </span>
                  )}
                </div>

                {/* Date Section */}
                {(watch('availableFrom') || watch('availableTo')) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Date</span>
                    </div>
                    <p className="text-gray-600">
                      {watch('availableFrom') && watch('availableTo') 
                        ? `Du ${new Date(watch('availableFrom')).toLocaleDateString('fr-FR')} au ${new Date(watch('availableTo')).toLocaleDateString('fr-FR')}`
                        : watch('availableFrom')
                        ? `À partir du ${new Date(watch('availableFrom')).toLocaleDateString('fr-FR')}`
                        : watch('availableTo')
                        ? `Jusqu'au ${new Date(watch('availableTo')).toLocaleDateString('fr-FR')}`
                        : 'Dates à définir'
                      }
                      {watch('availableFrom') && watch('availableTo') && (
                        <span className="ml-1">
                          ({Math.ceil((new Date(watch('availableTo')).getTime() - new Date(watch('availableFrom')).getTime()) / (1000 * 3600 * 24))} Jours)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Details Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Détails</h3>
                  <ul className="space-y-1 text-gray-600">
                    {watch('bedsCount') && (
                      <li>• {watch('bedsCount')} Lit{watch('bedsCount') > 1 ? 's' : ''}</li>
                    )}
                    {watchedAccommodationType === 'apartment' && watch('roomsCount') && (
                      <li>• {watch('roomsCount')} Chambre{watch('roomsCount') > 1 ? 's' : ''}</li>
                    )}
                    {watchedAccommodationType === 'apartment' && watch('hasLivingRoom') && (
                      <li>• Salon</li>
                    )}
                    {watch('hasWifi') && <li>• Wifi</li>}
                    {watch('hasAc') && <li>• Climatiseur</li>}
                    {watch('hasTv') && <li>• Télévision</li>}
                    {watch('hasFridge') && <li>• Réfrigérateur</li>}
                    {watch('hasWashingMachine') && <li>• Lave-linge</li>}
                  </ul>
                </div>

                {/* Contact Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Contact</h3>
                  <div className="space-y-2">
                    {watch('showEmail') && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">@ utilisateur@example.com</span>
                      </div>
                    )}
                    {watch('showPhone') ? (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">📱 +33 X XX XX XX XX</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        <span className="text-sm">Afficher votre numéro de téléphone dans votre annonce.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Section */}
                {watch('description') && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {watch('description')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info for larger screens */}
            <div className="hidden md:block max-w-2xl mx-auto mt-8 px-6">
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h3 className="font-semibold text-lg">Informations complémentaires</h3>
                
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Ville:</span>
                    <p className="font-medium">
                      {watch('city') === 'makkah' ? 'Makkah (La Mecque)' : watch('city') === 'medina' ? 'Médine' : 'Non sélectionnée'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium">
                      {watch('accommodationType') === 'hotel' ? 'Hôtel' : watch('accommodationType') === 'apartment' ? 'Appartement' : 'Non sélectionné'}
                    </p>
                  </div>
                  
                  {watchedAccommodationType === 'hotel' && watch('name') && (
                    <div>
                      <span className="text-gray-500">Nom de l'hôtel:</span>
                      <p className="font-medium">{watch('name')}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-500">Publication jusqu'au:</span>
                    <p className="font-medium">{watch('publishEndDate')}</p>
                  </div>
                </div>

                {watch('videoUrl') && (
                  <div className="pt-4 border-t">
                    <span className="text-gray-500">Vidéo de présentation:</span>
                    <p className="font-medium text-blue-600 break-all">{watch('videoUrl')}</p>
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
    <div className="space-y-6 pb-32 md:pb-8">
      {renderStep()}
      
      <div className="flex justify-between pt-6">
        {currentStep === totalSteps ? (
          /* Étape récapitulatif - Choix final */
          <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-background border-t md:border-t-0 p-4 md:p-0 w-full space-y-4 z-50 md:z-auto">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Que souhaitez-vous faire ?</h3>
              <p className="text-sm text-muted-foreground">Choisissez une action pour votre annonce</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                type="button"
                onClick={prevStep} 
                variant="outline"
                className="w-full sm:w-auto h-12 px-6"
              >
                ← Modifier
              </Button>
              
              <Button 
                onClick={handleSubmit((data) => onSubmitForm(data, true))} 
                variant="secondary"
                className="px-6 w-full sm:w-auto h-12"
              >
                💾 Sauvegarder comme brouillon
              </Button>
              
              <Button 
                onClick={handleSubmit((data) => onSubmitForm(data, false))}
                className="btn-modern px-8 w-full sm:w-auto h-12"
              >
                🚀 Publier maintenant
              </Button>
            </div>
          </div>
        ) : (
          /* Étapes normales */
          <>
            <div>
              {currentStep > 1 && (
                <Button onClick={prevStep} variant="outline">
                  Précédent
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button onClick={nextStep}>
                Suivant
              </Button>
            </div>
          </>
        )}
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