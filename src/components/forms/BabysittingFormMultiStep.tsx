import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdPreview from "@/components/ui/AdPreview";

interface BabysittingFormData {
  title: string;
  description: string;
  gender: string;
  city: string;
  languages: string[];
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
}

interface BabysittingFormMultiStepProps {
  onSubmit: (data: BabysittingFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
}

const BabysittingFormMultiStep = ({ onSubmit, onBack }: BabysittingFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['francais']);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<BabysittingFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      showWhatsapp: false,
      showProfessionalPhone: false,
      languages: ['francais'],
    }
  });

  const totalSteps = 4;

  // Scroll vers le haut quand l'étape change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  const availableLanguages = [
    { id: 'francais', name: 'Français' },
    { id: 'arabe', name: 'Arabe' },
    { id: 'anglais', name: 'Anglais' },
    { id: 'espagnol', name: 'Espagnol' },
    { id: 'allemand', name: 'Allemand' },
    { id: 'italien', name: 'Italien' },
    { id: 'turc', name: 'Turc' },
    { id: 'urdu', name: 'Urdu' },
  ];

  const handleLanguageToggle = (languageId: string) => {
    const updatedLanguages = selectedLanguages.includes(languageId)
      ? selectedLanguages.filter(lang => lang !== languageId)
      : [...selectedLanguages, languageId];
    
    setSelectedLanguages(updatedLanguages);
    setValue('languages', updatedLanguages);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && !coverImage) {
      setCoverImage(files[0]);
      setImages(files.slice(1, 7));
    } else {
      setImages(prev => [...prev, ...files].slice(0, 6));
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof BabysittingFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'description'];
        break;
      case 2:
        fieldsToValidate = ['gender', 'city'];
        break;
      case 4:
        // Récapitulatif - pas de validation nécessaire
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

  const handlePublish = (data: BabysittingFormData) => {
    const formDataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage,
    };
    
    onSubmit(formDataWithImages, false);
  };

  const handleSaveDraft = (data: BabysittingFormData) => {
    const formDataWithImages = {
      ...data,
      images: images,
      coverImage: coverImage,
    };
    
    onSubmit(formDataWithImages, true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Informations de base
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
                  placeholder="Ex: Garde d'enfants expérimentée - Makkah"
                  maxLength={80}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{errors.title?.message}</span>
                  <span>{watch('title')?.length || 0}/80</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description de vos services *</Label>
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
                  placeholder="Présentez votre expérience avec les enfants, votre approche éducative, vos qualifications..."
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
              <CardTitle className="text-center">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Genre *</Label>
                <Select 
                  onValueChange={(value) => setValue("gender", value)} 
                  value={watch("gender")}
                  {...register("gender", { required: "Le genre est requis" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                </Select>
                {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville d'exercice *</Label>
                <Select 
                  onValueChange={(value) => setValue("city", value)} 
                  value={watch("city")}
                  {...register("city", { required: "La ville d'exercice est requise" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                    <SelectItem value="makkah">Makkah</SelectItem>
                    <SelectItem value="medina">Médine</SelectItem>
                    <SelectItem value="jeddah">Jeddah</SelectItem>
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Langues parlées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableLanguages.map((language) => (
                    <div key={language.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={language.id}
                        checked={selectedLanguages.includes(language.id)}
                        onCheckedChange={() => handleLanguageToggle(language.id)}
                      />
                      <Label htmlFor={language.id} className="text-sm">{language.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Photo de profil (obligatoire)</Label>
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
                              alt="Profile" 
                              className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                            <p className="text-sm text-muted-foreground">{coverImage.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Cliquez pour ajouter votre photo</p>
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

                  <div className="space-y-4 mt-8">
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
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 px-6 py-8 text-center rounded-2xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Vérifiez votre annonce
              </h1>
              <p className="text-gray-600">
                Voici ce que les parents verront. Assurez-vous que tout est correct.
              </p>
            </div>

            {/* Preview Card */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Image Section */}
              <div className="relative h-64 bg-gray-200">
                {coverImage ? (
                  <div className="relative h-full">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Photo de profil"
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
                {/* Title */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {watch('title') || 'Titre de votre annonce'}
                  </h2>
                </div>

                {/* Details Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Détails</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {watch('gender') === 'male' ? 'Homme' : watch('gender') === 'female' ? 'Femme' : 'Genre'}</li>
                    {watch('city') && (
                      <li>• Ville: {watch('city') === 'makkah' ? 'Makkah' : watch('city') === 'medina' ? 'Médine' : watch('city') === 'jeddah' ? 'Jeddah' : watch('city')}</li>
                    )}
                    {selectedLanguages && selectedLanguages.length > 0 && (
                      <li>• Langues: {selectedLanguages.map(lang => 
                        availableLanguages.find(l => l.id === lang)?.name
                      ).join(', ')}</li>
                    )}
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
            <div className="hidden md:block max-w-2xl mx-auto">
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h3 className="font-semibold text-lg">Informations complémentaires</h3>
                
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Genre:</span>
                    <p className="font-medium">
                      {watch('gender') === 'male' ? 'Homme' : watch('gender') === 'female' ? 'Femme' : 'Non renseigné'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Langues parlées:</span>
                    <p className="font-medium">
                      {selectedLanguages && selectedLanguages.length > 0 
                        ? selectedLanguages.map(lang => 
                            availableLanguages.find(l => l.id === lang)?.name
                          ).join(', ')
                        : 'Français'
                      }
                    </p>
                  </div>
                </div>
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
          <div>
            <h1 className="text-3xl font-bold">Services de Baby-sitting</h1>
            <p className="text-muted-foreground">Garde d'enfants professionnelle</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
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
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 sm:pt-8 bg-background/95 backdrop-blur-sm border-t border-border/40 p-4 rounded-lg">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 1 ? onBack : handlePrevious}
                  className="w-full sm:w-auto"
                >
                  {currentStep === 1 ? 'Retour' : 'Précédent'}
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
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

export default BabysittingFormMultiStep;