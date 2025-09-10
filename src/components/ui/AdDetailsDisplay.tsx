import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageDisplay } from './ImageDisplay';
import VideoPlayer from './VideoPlayer';
import { MapPin, Users, Languages, Calendar, Car, Baby, User, Plane, Home, Clock } from 'lucide-react';

// Function to convert airline IATA code to full name
const getAirlineName = (code: string): string => {
  const airlines: { [key: string]: string } = {
    'AF': 'Air France',
    'SV': 'Saudia',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'TK': 'Turkish Airlines',
    'LH': 'Lufthansa',
    'KL': 'KLM Royal Dutch Airlines',
    'BA': 'British Airways',
    'EY': 'Etihad Airways',
    'RJ': 'Royal Jordanian',
    'MS': 'EgyptAir',
    'HV': 'Transavia',
    'W6': 'Wizz Air',
    'VF': 'Ajet'
  };
  
  return airlines[code] || code;
};

interface AdDetailsDisplayProps {
  ad: {
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    category: string;
    images: string[];
    cover_image: string | null;
    categoryDetails?: any;
  };
}

const AdDetailsDisplay = ({ ad }: AdDetailsDisplayProps) => {
  const getCategoryIcon = () => {
    switch (ad.category) {
      case 'babysitting':
        return <Baby className="w-5 h-5" />;
      case 'chauffeurs':
        return <Car className="w-5 h-5" />;
      case 'guides':
        return <User className="w-5 h-5" />;
      case 'vols':
        return <Plane className="w-5 h-5" />;
      case 'hebergements':
        return <Home className="w-5 h-5" />;
      case 'sejours':
        return <Calendar className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getCategoryName = () => {
    switch (ad.category) {
      case 'babysitting':
        return 'Baby-sitting';
      case 'chauffeurs':
        return 'Chauffeur';
      case 'guides':
        return 'Guide';
      case 'vols':
        return 'Vol';
      case 'hebergements':
        return 'Hébergement';
      case 'sejours':
        return 'Séjour';
      default:
        return 'Service';
    }
  };

  const formatLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) return '';
    return languages
      .filter(lang => lang && typeof lang === 'string') // S'assurer que lang est une string
      .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
      .join(', ');
  };

  const formatCity = (city: string) => {
    try {
      if (!city || typeof city !== 'string') return '';
      return city.charAt(0).toUpperCase() + city.slice(1);
    } catch (error) {
      console.error('Error formatting city:', error, city);
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <ImageDisplay
        images={ad.images || []}
        coverImage={ad.cover_image}
        title={ad.title}
      />

      {/* Title and Category */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {getCategoryIcon()}
          <Badge variant="secondary">{getCategoryName()}</Badge>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold">{ad.title}</h1>
        
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {ad.description}
          </p>
        </CardContent>
      </Card>

      {/* Category Specific Details */}
      {ad.categoryDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Détails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Guides */}
            {ad.category === 'guides' && (
              <>
                {ad.categoryDetails.gender && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Genre:</span>
                    <span>{ad.categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}</span>
                  </div>
                )}
                
                {ad.categoryDetails.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ville:</span>
                    <span>{formatCity(ad.categoryDetails.city)}</span>
                  </div>
                )}

                {ad.categoryDetails.years_experience && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Expérience:</span>
                    <span>{ad.categoryDetails.years_experience} ans</span>
                  </div>
                )}

                {ad.categoryDetails.languages && ad.categoryDetails.languages.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Langues:</span>
                    <span>{formatLanguages(ad.categoryDetails.languages)}</span>
                  </div>
                )}

                {/* Services offerts */}
                <div>
                  <h4 className="font-medium mb-2">Services proposés:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ad.categoryDetails.offers_omra_guidance && (
                      <Badge variant="outline">Guidage Omra</Badge>
                    )}
                    {ad.categoryDetails.offers_omra_badal && (
                      <Badge variant="outline">Omra Badal</Badge>
                    )}
                    {ad.categoryDetails.offers_visits && (
                      <Badge variant="outline">Visites</Badge>
                    )}
                    {ad.categoryDetails.offers_courses && (
                      <Badge variant="outline">Cours</Badge>
                    )}
                    {ad.categoryDetails.offers_wheelchair_help && (
                      <Badge variant="outline">Aide fauteuil roulant</Badge>
                    )}
                    {ad.categoryDetails.offers_other && (
                      <Badge variant="outline">Autres services</Badge>
                    )}
                  </div>
                  {ad.categoryDetails.other_services_description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {ad.categoryDetails.other_services_description}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Chauffeurs */}
            {ad.category === 'chauffeurs' && (
              <>
                {ad.categoryDetails.gender && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Genre:</span>
                    <span>{ad.categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}</span>
                  </div>
                )}

                {ad.categoryDetails.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ville:</span>
                    <span>
                      {(() => {
                        try {
                          return Array.isArray(ad.categoryDetails.city) 
                            ? ad.categoryDetails.city.filter(city => city).map(formatCity).join(', ')
                            : formatCity(ad.categoryDetails.city);
                        } catch (error) {
                          console.error('Error processing city data:', error);
                          return 'Information non disponible';
                        }
                      })()}
                    </span>
                  </div>
                )}

                 {ad.categoryDetails.vehicle_seats && (
                   <div className="flex items-center space-x-2">
                     <Users className="w-4 h-4 text-muted-foreground" />
                     <span className="font-medium">Sièges:</span>
                     <span>{ad.categoryDetails.vehicle_seats} personnes</span>
                   </div>
                 )}

                {ad.categoryDetails.languages && ad.categoryDetails.languages.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Langues:</span>
                    <span>{formatLanguages(ad.categoryDetails.languages)}</span>
                  </div>
                )}
              </>
            )}

            {/* Babysitting */}
            {ad.category === 'babysitting' && (
              <>
                {ad.categoryDetails.gender && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Genre:</span>
                    <span>{ad.categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}</span>
                  </div>
                )}

                {ad.categoryDetails.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ville:</span>
                    <span>{formatCity(ad.categoryDetails.city)}</span>
                  </div>
                )}

                {ad.categoryDetails.languages && ad.categoryDetails.languages.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Langues:</span>
                    <span>{formatLanguages(ad.categoryDetails.languages)}</span>
                  </div>
                )}
              </>
            )}

            {/* Vols */}
            {ad.category === 'vols' && (
              <>
                {ad.categoryDetails.airline && (
                  <div className="flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Compagnie aérienne:</span>
                    <span>{getAirlineName(ad.categoryDetails.airline)}</span>
                  </div>
                )}
                
                {ad.categoryDetails.departure_airport && ad.categoryDetails.arrival_airport && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Trajet:</span>
                    <span>{ad.categoryDetails.departure_airport} → {ad.categoryDetails.arrival_airport}</span>
                  </div>
                )}

                {ad.categoryDetails.departure_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Date de départ:</span>
                    <span>{new Date(ad.categoryDetails.departure_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                {ad.categoryDetails.return_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Date de retour:</span>
                    <span>{new Date(ad.categoryDetails.return_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Escales:</span>
                  <span>{ad.categoryDetails.has_stopover ? 'Avec escale(s)' : 'Sans escale'}</span>
                </div>

                {ad.categoryDetails.has_stopover && ad.categoryDetails.stopover_details && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-medium">Détails des escales:</span>
                      {ad.categoryDetails.stopover_details.split(' | ').map((detail: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informations bagages */}
                {(ad.categoryDetails.checked_bags_count || ad.categoryDetails.checked_bags_weight) && (
                  <div className="space-y-2">
                    <span className="font-medium">Bagages en soute:</span>
                    {ad.categoryDetails.checked_bags_count && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.checked_bags_count} bagage(s)</span>
                      </div>
                    )}
                    {ad.categoryDetails.checked_bags_weight && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.checked_bags_weight} kg par bagage</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Séjours */}
            {ad.category === 'sejours' && (
              <>
                {ad.categoryDetails.formula_type && (
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      Formule {ad.categoryDetails.formula_type}
                    </Badge>
                  </div>
                )}
                
                {ad.categoryDetails.airline && (
                  <div className="flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Compagnie aérienne:</span>
                    <span>{getAirlineName(ad.categoryDetails.airline)}</span>
                  </div>
                )}

                {ad.categoryDetails.departure_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Date de départ:</span>
                    <span>{new Date(ad.categoryDetails.departure_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                {ad.categoryDetails.return_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Date de retour:</span>
                    <span>{new Date(ad.categoryDetails.return_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                {(ad.categoryDetails.nights_mecca || ad.categoryDetails.nights_medina) && (
                  <div className="space-y-2">
                    <span className="font-medium">Durée du séjour:</span>
                    {ad.categoryDetails.nights_mecca && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.nights_mecca} nuits à La Mecque</span>
                      </div>
                    )}
                    {ad.categoryDetails.nights_medina && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.nights_medina} nuits à Médine</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hôtels */}
                {(ad.categoryDetails.mecca_hotel_name || ad.categoryDetails.medina_hotel_name) && (
                  <div className="space-y-2">
                    <span className="font-medium">Hébergements:</span>
                    {ad.categoryDetails.mecca_hotel_name && (
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">La Mecque:</span>
                          <span className="text-sm">{ad.categoryDetails.mecca_hotel_name}</span>
                        </div>
                        {ad.categoryDetails.mecca_hotel_distance && (
                          <div className="text-xs text-muted-foreground ml-6">
                            Distance: {ad.categoryDetails.mecca_hotel_distance}m du Haram
                          </div>
                        )}
                      </div>
                    )}
                    {ad.categoryDetails.medina_hotel_name && (
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Médine:</span>
                          <span className="text-sm">{ad.categoryDetails.medina_hotel_name}</span>
                        </div>
                        {ad.categoryDetails.medina_hotel_distance && (
                          <div className="text-xs text-muted-foreground ml-6">
                            Distance: {ad.categoryDetails.medina_hotel_distance}m de la Mosquée du Prophète
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Informations bagages */}
                {(ad.categoryDetails.checked_bags_count || ad.categoryDetails.checked_bags_weight) && (
                  <div className="space-y-2">
                    <span className="font-medium">Bagages en soute:</span>
                    {ad.categoryDetails.checked_bags_count && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.checked_bags_count} bagage(s)</span>
                      </div>
                    )}
                    {ad.categoryDetails.checked_bags_weight && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm">• {ad.categoryDetails.checked_bags_weight} kg par bagage</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Hébergements */}
            {(ad.category === 'hebergements' || ad.category === 'hebergement') && (
              <>
                {ad.categoryDetails.accommodation_type && (
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Type:</span>
                    <span>{ad.categoryDetails.accommodation_type}</span>
                  </div>
                )}

                {ad.categoryDetails.name && ad.categoryDetails.name !== ad.title && (
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Nom de l'établissement:</span>
                    <span>{ad.categoryDetails.name}</span>
                  </div>
                )}

                {ad.categoryDetails.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ville:</span>
                    <span>{formatCity(ad.categoryDetails.city)}</span>
                  </div>
                )}

                {/* Dates de disponibilité */}
                {(ad.categoryDetails.available_from || ad.categoryDetails.available_to) && (
                  <div className="space-y-2">
                    <span className="font-medium">Disponibilité:</span>
                    {ad.categoryDetails.available_from && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Du {new Date(ad.categoryDetails.available_from).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {ad.categoryDetails.available_to && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Jusqu'au {new Date(ad.categoryDetails.available_to).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                )}

                {(ad.categoryDetails.rooms_count || ad.categoryDetails.beds_count) && (
                  <div className="flex items-center space-x-4">
                    {ad.categoryDetails.rooms_count && (
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        <span>{ad.categoryDetails.rooms_count} chambres</span>
                      </div>
                    )}
                    {ad.categoryDetails.beds_count && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{ad.categoryDetails.beds_count} lits</span>
                      </div>
                    )}
                  </div>
                )}

                {ad.categoryDetails.distance_to_mosque && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Distance à la mosquée:</span>
                    <span>{ad.categoryDetails.distance_to_mosque}m</span>
                  </div>
                )}

                {/* Équipements */}
                {(ad.categoryDetails.has_wifi || ad.categoryDetails.has_ac || ad.categoryDetails.has_tv || 
                  ad.categoryDetails.has_fridge || ad.categoryDetails.has_washing_machine || ad.categoryDetails.has_living_room) && (
                  <div>
                    <h4 className="font-medium mb-2">Équipements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ad.categoryDetails.has_wifi && (
                        <Badge variant="outline">WiFi</Badge>
                      )}
                      {ad.categoryDetails.has_ac && (
                        <Badge variant="outline">Climatisation</Badge>
                      )}
                      {ad.categoryDetails.has_tv && (
                        <Badge variant="outline">Télévision</Badge>
                      )}
                      {ad.categoryDetails.has_fridge && (
                        <Badge variant="outline">Réfrigérateur</Badge>
                      )}
                      {ad.categoryDetails.has_washing_machine && (
                        <Badge variant="outline">Lave-linge</Badge>
                      )}
                      {ad.categoryDetails.has_living_room && (
                        <Badge variant="outline">Salon</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Vidéo */}
                {ad.categoryDetails.video_url && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Visite virtuelle:</h4>
                    <VideoPlayer 
                      videoUrl={ad.categoryDetails.video_url}
                      title="Visite virtuelle de l'hébergement"
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdDetailsDisplay;