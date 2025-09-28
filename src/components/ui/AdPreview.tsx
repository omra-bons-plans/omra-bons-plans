import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Languages, Calendar, Car, Baby, User, Plane, Building } from "lucide-react";

interface AdPreviewProps {
  data: any;
  coverImage?: File | null;
  category: 'babysitting' | 'chauffeurs' | 'guides' | 'vols' | 'sejours';
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
      case 'vols':
        return <Plane className="w-5 h-5" />;
      case 'sejours':
        return <Building className="w-5 h-5" />;
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
      case 'vols':
        return 'Vol';
      case 'sejours':
        return 'Séjour Omra';
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
          {/* Informations pour les services (guides, chauffeurs, babysitting) */}
          {(category === 'guides' || category === 'chauffeurs' || category === 'babysitting') && (
            <>
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
                     <span className="font-medium">Sièges:</span> {data.vehicleSeats} personnes
                   </span>
                 </div>
               )}
            </>
          )}

          {/* Informations pour les vols et séjours */}
          {(category === 'vols' || category === 'sejours') && (
            <>
              {/* Compagnie aérienne */}
              {data.airline && (
                <div className="flex items-center space-x-2">
                  <Plane className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Compagnie:</span> {data.airline}
                  </span>
                </div>
              )}

              {/* Aéroports */}
              {(data.departureAirport || data.arrivalAirport) && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Trajet:</span> {data.departureAirport} → {data.arrivalAirport}
                  </span>
                </div>
              )}

              {/* Dates */}
              {(data.departureDate || data.returnDate) && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Dates:</span> {data.departureDate} - {data.returnDate}
                  </span>
                </div>
              )}

              {/* Nuits (pour séjours) */}
              {category === 'sejours' && (data.nightsMedina || data.nightsMecca) && (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Nuits:</span> {data.nightsMedina || 0} Médine, {data.nightsMecca || 0} Makkah
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bagages (pour vols et séjours) */}
        {(category === 'vols' || category === 'sejours') && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Bagages inclus</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Bagages en soute:</span> {data.checkedBagsCount || 0} bagage(s) de {data.checkedBagsWeight || 20}kg
              </div>
              <div>
                <span className="font-medium">Bagages à main:</span> {data.carryOnBagsCount || 1} bagage(s) de {data.carryOnBagsWeight || 10}kg
              </div>
            </div>
          </div>
        )}

        {/* Langues (pour services) */}
        {(category === 'guides' || category === 'chauffeurs' || category === 'babysitting') && data.languages && data.languages.length > 0 && (
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

        {/* Tarifs (pour chauffeurs) */}
        {category === 'chauffeurs' && data.pricing && Object.keys(data.pricing).some(key => data.pricing[key]) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Tarifs</h4>
            <div className="space-y-1 text-xs">
              {data.pricing.airportJeddahToMakkah && (
                <div className="flex justify-between">
                  <span>Aéroport Jeddah → Makkah:</span>
                  <span className="font-medium">{data.pricing.airportJeddahToMakkah} SAR</span>
                </div>
              )}
              {data.pricing.airportJeddahToMedina && (
                <div className="flex justify-between">
                  <span>Aéroport Jeddah → Médine:</span>
                  <span className="font-medium">{data.pricing.airportJeddahToMedina} SAR</span>
                </div>
              )}
              {data.pricing.airportMedinaToMedina && (
                <div className="flex justify-between">
                  <span>Aéroport Médine → Médine:</span>
                  <span className="font-medium">{data.pricing.airportMedinaToMedina} SAR</span>
                </div>
              )}
              {data.pricing.makkahToMedina && (
                <div className="flex justify-between">
                  <span>Makkah → Médine:</span>
                  <span className="font-medium">{data.pricing.makkahToMedina} SAR</span>
                </div>
              )}
              {data.pricing.medinaToMakkah && (
                <div className="flex justify-between">
                  <span>Médine → Makkah:</span>
                  <span className="font-medium">{data.pricing.medinaToMakkah} SAR</span>
                </div>
              )}
              {data.pricing.visitMedina && (
                <div className="flex justify-between">
                  <span>Visite de Médine:</span>
                  <span className="font-medium">{data.pricing.visitMedina} SAR</span>
                </div>
              )}
              {data.pricing.visitMakkah && (
                <div className="flex justify-between">
                  <span>Visite de Makkah:</span>
                  <span className="font-medium">{data.pricing.visitMakkah} SAR</span>
                </div>
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