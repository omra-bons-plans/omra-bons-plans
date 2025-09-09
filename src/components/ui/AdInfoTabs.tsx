import { Home, User, Plane, Calendar, Car, Baby, MapPin, Users, Languages, Clock, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent } from './card';
import { Badge } from './badge';

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

interface AdInfoTabsProps {
  description: string;
  category: string;
  categoryDetails?: any;
}

export const AdInfoTabs = ({ description, category, categoryDetails }: AdInfoTabsProps) => {
  const formatLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) return '';
    return languages
      .filter(lang => lang && typeof lang === 'string')
      .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
      .join(', ');
  };

  const formatCity = (city: string) => {
    if (!city || typeof city !== 'string') return '';
    return city.charAt(0).toUpperCase() + city.slice(1);
  };

  const DetailItem = ({ icon, label, value, children }: {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-start space-x-3 py-3">
      <div className="text-primary mt-0.5">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">{label}:</span>
          {value && <span className="text-muted-foreground">{value}</span>}
        </div>
        {children}
      </div>
    </div>
  );

  const renderCategoryDetails = () => {
    if (!categoryDetails) return null;

    switch (category) {
      case 'guides':
        return (
          <div className="space-y-0 divide-y divide-border/20">
            {categoryDetails.gender && (
              <DetailItem
                icon={<User className="w-5 h-5" />}
                label="Genre"
                value={categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}
              />
            )}
            
            {categoryDetails.city && (
              <DetailItem
                icon={<MapPin className="w-5 h-5" />}
                label="Ville"
                value={formatCity(categoryDetails.city)}
              />
            )}

            {categoryDetails.years_experience && (
              <DetailItem
                icon={<Clock className="w-5 h-5" />}
                label="Expérience"
                value={`${categoryDetails.years_experience} ans`}
              />
            )}

            {categoryDetails.languages && categoryDetails.languages.length > 0 && (
              <DetailItem
                icon={<Languages className="w-5 h-5" />}
                label="Langues"
                value={formatLanguages(categoryDetails.languages)}
              />
            )}

            <DetailItem
              icon={<Eye className="w-5 h-5" />}
              label="Services proposés"
            >
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryDetails.offers_omra_guidance && (
                  <Badge variant="outline" className="text-xs">🕋 Guidage Omra</Badge>
                )}
                {categoryDetails.offers_omra_badal && (
                  <Badge variant="outline" className="text-xs">🤲 Omra Badal</Badge>
                )}
                {categoryDetails.offers_visits && (
                  <Badge variant="outline" className="text-xs">🏛️ Visites</Badge>
                )}
                {categoryDetails.offers_courses && (
                  <Badge variant="outline" className="text-xs">📚 Cours</Badge>
                )}
                {categoryDetails.offers_wheelchair_help && (
                  <Badge variant="outline" className="text-xs">♿ Aide mobilité</Badge>
                )}
                {categoryDetails.offers_other && (
                  <Badge variant="outline" className="text-xs">➕ Autres services</Badge>
                )}
              </div>
              {categoryDetails.other_services_description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {categoryDetails.other_services_description}
                </p>
              )}
            </DetailItem>
          </div>
        );

      case 'chauffeurs':
        return (
          <div className="space-y-0 divide-y divide-border/20">
            {categoryDetails.gender && (
              <DetailItem
                icon={<User className="w-5 h-5" />}
                label="Genre"
                value={categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}
              />
            )}

            {categoryDetails.city && (
              <DetailItem
                icon={<MapPin className="w-5 h-5" />}
                label="Zones de service"
                value={
                  Array.isArray(categoryDetails.city) 
                    ? categoryDetails.city.map(formatCity).join(', ')
                    : formatCity(categoryDetails.city)
                }
              />
            )}

            {categoryDetails.vehicle_seats && (
              <DetailItem
                icon={<Users className="w-5 h-5" />}
                label="Capacité"
                value={`${categoryDetails.vehicle_seats} personnes`}
              />
            )}

            {categoryDetails.languages && categoryDetails.languages.length > 0 && (
              <DetailItem
                icon={<Languages className="w-5 h-5" />}
                label="Langues"
                value={formatLanguages(categoryDetails.languages)}
              />
            )}
          </div>
        );

      case 'babysitting':
        return (
          <div className="space-y-0 divide-y divide-border/20">
            {categoryDetails.gender && (
              <DetailItem
                icon={<User className="w-5 h-5" />}
                label="Genre"
                value={categoryDetails.gender === 'male' ? 'Homme' : 'Femme'}
              />
            )}

            {categoryDetails.city && (
              <DetailItem
                icon={<MapPin className="w-5 h-5" />}
                label="Ville"
                value={formatCity(categoryDetails.city)}
              />
            )}

            {categoryDetails.languages && categoryDetails.languages.length > 0 && (
              <DetailItem
                icon={<Languages className="w-5 h-5" />}
                label="Langues"
                value={formatLanguages(categoryDetails.languages)}
              />
            )}
          </div>
        );

      case 'vols':
        return (
          <div className="space-y-0 divide-y divide-border/20">
            {categoryDetails.airline && (
              <DetailItem
                icon={<Plane className="w-5 h-5" />}
                label="Compagnie"
                value={getAirlineName(categoryDetails.airline)}
              />
            )}
            
            {categoryDetails.departure_airport && categoryDetails.arrival_airport && (
              <DetailItem
                icon={<MapPin className="w-5 h-5" />}
                label="Trajet"
                value={`${categoryDetails.departure_airport} → ${categoryDetails.arrival_airport}`}
              />
            )}

            {categoryDetails.departure_date && (
              <DetailItem
                icon={<Calendar className="w-5 h-5" />}
                label="Départ"
                value={new Date(categoryDetails.departure_date).toLocaleDateString('fr-FR')}
              />
            )}

            {categoryDetails.return_date && (
              <DetailItem
                icon={<Calendar className="w-5 h-5" />}
                label="Retour"
                value={new Date(categoryDetails.return_date).toLocaleDateString('fr-FR')}
              />
            )}

            <DetailItem
              icon={<Clock className="w-5 h-5" />}
              label="Escales"
              value={categoryDetails.has_stopover ? 'Avec escale(s)' : 'Sans escale'}
            />

            {categoryDetails.has_stopover && categoryDetails.stopover_details && (
              <DetailItem
                icon={<MapPin className="w-5 h-5" />}
                label="Détails des escales"
              >
                <div className="mt-2 space-y-1">
                  {categoryDetails.stopover_details.split(' | ').map((detail: string, index: number) => (
                    <p key={index} className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {detail}
                    </p>
                  ))}
                </div>
              </DetailItem>
            )}

            {(categoryDetails.checked_bags_count || categoryDetails.checked_bags_weight) && (
              <DetailItem
                icon={<Eye className="w-5 h-5" />}
                label="Bagages en soute"
              >
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {categoryDetails.checked_bags_count && (
                    <p>• {categoryDetails.checked_bags_count} bagage(s)</p>
                  )}
                  {categoryDetails.checked_bags_weight && (
                    <p>• {categoryDetails.checked_bags_weight} kg par bagage</p>
                  )}
                </div>
              </DetailItem>
            )}
          </div>
        );

      // Add other category cases as needed...
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
          <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
          <TabsTrigger value="details" className="rounded-lg">Détails</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-6 pt-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="details" className="p-6 pt-4">
          {categoryDetails ? (
            renderCategoryDetails()
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun détail spécifique disponible pour cette annonce.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};