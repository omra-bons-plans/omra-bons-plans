import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Languages, Calendar, Car, Baby, User, Plane, Home, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import ImageWithFallback from "./ImageWithFallback";
import { useState, useEffect } from "react";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Combine cover image and gallery images
  const allImages = [
    ...(ad.cover_image ? [ad.cover_image] : []),
    ...(ad.images || [])
  ];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImageIndex]);
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
           <ImageWithFallback
             src={getImageUrl(ad.cover_image)}
             alt={ad.title}
             className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
             onClick={() => openLightbox(0)}
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
              {ad.images.map((image, index) => {
                const imageIndex = ad.cover_image ? index + 1 : index; // Adjust index if cover image exists
                return (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                     <ImageWithFallback
                       src={getImageUrl(image)}
                       alt={`Image ${index + 1}`}
                       className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                       onClick={() => openLightbox(imageIndex)}
                     />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-16 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Current image */}
            {selectedImageIndex !== null && allImages[selectedImageIndex] && (
              <div className="w-full h-full p-8 flex items-center justify-center">
                <ImageWithFallback
                  src={getImageUrl(allImages[selectedImageIndex])}
                  alt={`Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Image counter */}
            {allImages.length > 1 && selectedImageIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdDetailsDisplay;