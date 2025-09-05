import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Upload, MapPin, Languages, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GuideFormData {
  title: string;
  description: string;
  price: number;
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
  publishEndDate: string;
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

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<GuideFormData>({
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
        fieldsToValidate = ['title', 'description', 'gender', 'city', 'yearsExperience'];
        break;
      case 2:
        // Languages and services - no required validation needed
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

  const handleFormSubmit = (data: GuideFormData) => {
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">Genre *</Label>
                  <Select onValueChange={(value) => setValue("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Années d'expérience *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
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
                <Select onValueChange={(value) => setValue("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makkah">Makkah</SelectItem>
                    <SelectItem value="medina">Médine</SelectItem>
                    <SelectItem value="both">Makkah et Médine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="w-5 h-5" />
                  <span>Langues parlées</span>
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
                <CardTitle className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Services proposés</span>
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
          </div>
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Tarifs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Tarif journalier (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { required: "Le tarif est requis", valueAsNumber: true })}
                    placeholder="Ex: 45"
                  />
                  {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
                  <p className="text-sm text-muted-foreground">
                    Indiquez votre tarif par jour de service
                  </p>
                </div>
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

export default GuideFormMultiStep;