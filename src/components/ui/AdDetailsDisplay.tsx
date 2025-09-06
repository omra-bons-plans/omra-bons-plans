import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Languages, Calendar, Car, Baby, User, Plane, Home, Clock } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

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
      .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
      .join(', ');
  };

  const formatCity = (city: string) => {
    return city?.charAt(0).toUpperCase() + city?.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {ad.cover_image && (
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src={getImageUrl(ad.cover_image) || '/ad-placeholder.jpg'}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/ad-placeholder.jpg';
            }}
          />
        </div>
      )}

      {/* Title and Category */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {getCategoryIcon()}
          <Badge variant="secondary">{getCategoryName()}</Badge>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold">{ad.title}</h1>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{ad.location}</span>
        </div>
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
                    <span>{formatCity(ad.categoryDetails.city)}</span>
                  </div>
                )}

                {ad.categoryDetails.vehicle_seats && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Places:</span>
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

            {/* Add other categories as needed */}
          </CardContent>
        </Card>
      )}

      {/* Images Gallery */}
      {ad.images && ad.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ad.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(image) || '/ad-placeholder.jpg'}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = '/ad-placeholder.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdDetailsDisplay;