import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Upload, MapPin, Languages, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdPreview from "@/components/ui/AdPreview";

interface GuideFormData {
  title: string;
  description: string;
  gender: string;
  city: string;
  yearsExperience: number;
  languages: string[];
  offersOmraGuidance: boolean;
  offersVisits: boolean;
  offersCourses: boolean;
  offersOmraBadal: boolean;
  offersWheelchairHelp: boolean;
  offersOther: boolean;
  otherServicesDescription?: string;
  showEmail: boolean;
  showPhone: boolean;
}

interface GuideFormMultiStepProps {
  onSubmit: (data: GuideFormData, saveAsDraft?: boolean) => void;
  onBack: () => void;
}

const GuideFormMultiStep = ({ onSubmit, onBack }: GuideFormMultiStepProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['francais']);

  const { register, handleSubmit, watch, setValue, control, formState: { errors }, trigger } = useForm<GuideFormData>({
    defaultValues: {
      showEmail: true,
      showPhone: false,
      languages: ['francais'],
      offersOmraGuidance: false,
      offersVisits: false,
      offersCourses: false,
      offersOmraBadal: false,
      offersWheelchairHelp: false,
      offersOther: false,
    }
  });

  const totalSteps = 4;
  const offersOther = watch('offersOther');

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
    let fieldsToValidate: (keyof GuideFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'description'];
        break;
      case 2:
        fieldsToValidate = ['gender', 'city', 'yearsExperience'];
        break;
      case 3:
        // Vérifier qu'une photo de profil est présente (obligatoire)
        if (!coverImage) {
          alert("Une photo de profil est obligatoire");
          return;
        }
        // Pour l'étape 3, pas d'autres validations de formulaire nécessaires
        break;
      case 4:
        // Récapitulatif - pas de validation nécessaire
        break;
    }

    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (data: GuideFormData) => {
    onSubmit(data, false);
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
                  {...register("title", { required: "Le titre est requis" })}
                  placeholder="Ex: Guide expérimenté - Français/Arabe"
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description de vos services *</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "La description est requise" })}
                  placeholder="Présentez votre expérience, votre approche, vos qualifications..."
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
              <CardTitle className="text-center">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">Genre *</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Le genre est requis" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                          <SelectItem value="male">Homme</SelectItem>
                          <SelectItem value="female">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Années d'expérience *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    step="1"
                    {...register("yearsExperience", { 
                      required: "L'expérience est requise", 
                      valueAsNumber: true,
                      min: { value: 0, message: "L'expérience doit être positive" }
                    })}
                    placeholder="Ex: 8"
                  />
                  {errors.yearsExperience && <p className="text-destructive text-sm">{errors.yearsExperience.message}</p>}
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville d'exercice *</Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "La ville est requise" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la ville" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
                          <SelectItem value="makkah">Makkah</SelectItem>
                          <SelectItem value="medina">Médine</SelectItem>
                          <SelectItem value="both">Makkah et Médine</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
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
                  Services proposés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersOmraGuidance"
                      {...register("offersOmraGuidance")}
                    />
                    <Label htmlFor="offersOmraGuidance">Accompagnement Omra</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersVisits"
                      {...register("offersVisits")}
                    />
                    <Label htmlFor="offersVisits">Visites guidées</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersCourses"
                      {...register("offersCourses")}
                    />
                    <Label htmlFor="offersCourses">Cours religieux</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersOmraBadal"
                      {...register("offersOmraBadal")}
                    />
                    <Label htmlFor="offersOmraBadal">Omra Badal</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersWheelchairHelp"
                      {...register("offersWheelchairHelp")}
                    />
                    <Label htmlFor="offersWheelchairHelp">Aide fauteuil roulant</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offersOther"
                      checked={offersOther}
                      onCheckedChange={(checked) => setValue("offersOther", !!checked)}
                    />
                    <Label htmlFor="offersOther">Autres services</Label>
                  </div>
                </div>

                {offersOther && (
                  <div className="space-y-2">
                    <Label htmlFor="otherServicesDescription">Décrivez vos autres services</Label>
                    <Textarea
                      id="otherServicesDescription"
                      {...register("otherServicesDescription")}
                      placeholder="Précisez les autres services que vous proposez..."
                      rows={3}
                    />
                  </div>
                )}
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
                        <Label htmlFor="showPhone">Afficher le téléphone</Label>
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
                Voici ce que les voyageurs verront. Assurez-vous que tout est correct.
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
                {/* Title and City */}
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    {watch('title') || 'Titre de votre annonce'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {watch('city') === 'makkah' ? 'Makkah' : watch('city') === 'medina' ? 'Médine' : watch('city') === 'both' ? 'Makkah et Médine' : 'Ville'}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Détails</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {watch('gender') === 'male' ? 'Homme' : watch('gender') === 'female' ? 'Femme' : 'Genre'}</li>
                    <li>• {watch('yearsExperience') || 0} années d'expérience</li>
                    {selectedLanguages && selectedLanguages.length > 0 && (
                      <li>• Langues: {selectedLanguages.map(lang => 
                        availableLanguages.find(l => l.id === lang)?.name
                      ).join(', ')}</li>
                    )}
                  </ul>
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Services proposés</h3>
                  <ul className="space-y-1 text-gray-600">
                    {watch('offersOmraGuidance') && <li>• Accompagnement Omra</li>}
                    {watch('offersVisits') && <li>• Visites guidées</li>}
                    {watch('offersCourses') && <li>• Cours religieux</li>}
                    {watch('offersOmraBadal') && <li>• Omra Badal</li>}
                    {watch('offersWheelchairHelp') && <li>• Aide fauteuil roulant</li>}
                    {watch('offersOther') && <li>• Autres services</li>}
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

                {/* Other Services Description */}
                {watch('offersOther') && watch('otherServicesDescription') && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Autres services</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {watch('otherServicesDescription')}
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
                    <span className="text-gray-500">Expérience:</span>
                    <p className="font-medium">
                      {watch('yearsExperience') || 0} années
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Ville d'exercice:</span>
                    <p className="font-medium">
                      {watch('city') === 'makkah' ? 'Makkah' : watch('city') === 'medina' ? 'Médine' : watch('city') === 'both' ? 'Makkah et Médine' : 'Non renseignée'}
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-large">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Services de Guide</h1>
            <p className="text-muted-foreground">Accompagnement spirituel et culturel</p>
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
              <>
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
                
                <Button 
                  type="submit" 
                  className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
                >
                  Publier l'annonce
                </Button>
              </>
            )}
            
            {currentStep < totalSteps && (
              <Button 
                type="button" 
                onClick={handleNext}
                className="btn-modern px-6 sm:px-8 w-full sm:w-auto"
              >
                Suivant
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default GuideFormMultiStep;