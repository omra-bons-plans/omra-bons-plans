import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Languages, Calendar, Car, Baby, User } from "lucide-react";

interface AdPreviewProps {
  data: any;
  coverImage?: File | null;
  category: 'babysitting' | 'chauffeurs' | 'guides';
  className?: string;
}

const AdPreview = ({ data, coverImage, category, className = "" }: AdPreviewProps) => {
  const getCategoryIcon = () => {
    switch (category) {
      case 'babysitting':
        return <Baby className="w-5 h-5" />;
      case 'chauffeurs':
        return <Car className="w-5 h-5" />;
      case 'guides':
        return <User className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getCategoryName = () => {
    switch (category) {
      case 'babysitting':
        return 'Baby-sitting';
      case 'chauffeurs':
        return 'Chauffeur';
      case 'guides':
        return 'Guide';
      default:
        return 'Service';
    }
  };

  const formatLanguages = (languages: string[]) => {
    const languageMap: { [key: string]: string } = {
      'francais': 'Français',
      'arabe': 'Arabe',
      'anglais': 'Anglais',
      'espagnol': 'Espagnol',
      'allemand': 'Allemand',
      'italien': 'Italien',
      'turc': 'Turc',
      'urdu': 'Urdu',
    };
    
    return languages.map(lang => languageMap[lang] || lang).join(', ');
  };

  const formatCity = (city: string) => {
    switch (city) {
      case 'makkah':
        return 'Makkah';
      case 'medina':
        return 'Médine';
      case 'jeddah':
        return 'Jeddah';
      case 'both':
        return 'Makkah et Médine';
      default:
        return city;
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {getCategoryIcon()}
          <Badge variant="secondary">{getCategoryName()}</Badge>
        </div>
        <CardTitle className="text-xl font-bold">{data.title || "Titre de l'annonce"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Image de couverture */}
        {coverImage && (
          <div className="w-full">
            <img 
              src={URL.createObjectURL(coverImage)} 
              alt="Couverture" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-semibold">Description</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {data.description || "Aucune description fournie"}
          </p>
        </div>

        {/* Informations spécifiques par catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Genre */}
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Genre:</span> {data.gender === 'male' ? 'Homme' : 'Femme'}
            </span>
          </div>

          {/* Ville (pour chauffeurs et guides) */}
          {(category === 'chauffeurs' || category === 'guides') && data.city && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Ville:</span> {formatCity(data.city)}
              </span>
            </div>
          )}

          {/* Expérience (pour guides) */}
          {category === 'guides' && data.yearsExperience !== undefined && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Expérience:</span> {data.yearsExperience} ans
              </span>
            </div>
          )}

          {/* Places véhicule (pour chauffeurs) */}
          {category === 'chauffeurs' && data.vehicleSeats && (
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Places:</span> {data.vehicleSeats} personnes
              </span>
            </div>
          )}
        </div>

        {/* Langues */}
        {data.languages && data.languages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Langues parlées</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.languages.map((lang: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {formatLanguages([lang])}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Services proposés (pour guides) */}
        {category === 'guides' && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Services proposés</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.offersOmraGuidance && <span>✅ Accompagnement Omra</span>}
              {data.offersVisits && <span>✅ Visites guidées</span>}
              {data.offersCourses && <span>✅ Cours religieux</span>}
              {data.offersOmraBadal && <span>✅ Omra Badal</span>}
              {data.offersWheelchairHelp && <span>✅ Aide fauteuil roulant</span>}
              {data.offersOther && data.otherServicesDescription && (
                <span className="col-span-2">✅ Autres: {data.otherServicesDescription}</span>
              )}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Contact</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {data.showEmail && <p>📧 Email visible aux visiteurs</p>}
            {data.showPhone && <p>📞 Téléphone visible aux visiteurs</p>}
            {!data.showEmail && !data.showPhone && (
              <p className="text-destructive">⚠️ Aucun moyen de contact sélectionné</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Votre annonce sera visible aux visiteurs de cette façon
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreview;