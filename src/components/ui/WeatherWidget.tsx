import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  humidity?: number | null;
  windSpeed?: number | null;
}

interface WeatherWidgetProps {
  makkahWeather?: WeatherData;
  madinahWeather?: WeatherData;
  eurToSar?: number;
  loading?: boolean;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('pluie')) return CloudRain;
  if (desc.includes('cloud') || desc.includes('nuage')) return Cloud;
  if (desc.includes('snow') || desc.includes('neige')) return CloudSnow;
  if (desc.includes('wind') || desc.includes('vent')) return Wind;
  return Sun;
};

const translateDescription = (description: string): string => {
  const translations: { [key: string]: string } = {
    'sunny': 'Ensoleillé',
    'clear': 'Dégagé',
    'partly cloudy': 'Partiellement nuageux',
    'cloudy': 'Nuageux',
    'overcast': 'Couvert',
    'rain': 'Pluie',
    'light rain': 'Pluie légère',
    'heavy rain': 'Pluie forte',
    'thunderstorm': 'Orage',
    'snow': 'Neige',
    'fog': 'Brouillard',
    'mist': 'Brume',
    'windy': 'Venteux'
  };
  
  const lowerDesc = description.toLowerCase();
  return translations[lowerDesc] || description;
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  makkahWeather,
  madinahWeather,
  eurToSar,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none backdrop-blur-sm">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted/50 rounded w-32"></div>
            <div className="h-8 bg-muted/50 rounded w-24"></div>
            <div className="h-4 bg-muted/50 rounded w-28"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Météo des Lieux Saints</h3>
          <p className="text-sm text-muted-foreground">Conditions actuelles</p>
        </div>

        {/* Weather Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Makkah */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-1 text-primary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Makkah</span>
            </div>
            
            {makkahWeather ? (
              <>
                <div className="flex items-center justify-center">
                  {React.createElement(getWeatherIcon(makkahWeather.description), {
                    className: "w-8 h-8 text-amber-500"
                  })}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {makkahWeather.temperature}°C
                </div>
                <p className="text-xs text-muted-foreground">
                  {translateDescription(makkahWeather.description)}
                </p>
                {makkahWeather.humidity && (
                  <p className="text-xs text-muted-foreground">
                    {makkahWeather.humidity}% humidité
                  </p>
                )}
              </>
            ) : (
              <div className="text-muted-foreground text-sm">Données indisponibles</div>
            )}
          </div>

          {/* Madinah */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-1 text-primary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Madinah</span>
            </div>
            
            {madinahWeather ? (
              <>
                <div className="flex items-center justify-center">
                  {React.createElement(getWeatherIcon(madinahWeather.description), {
                    className: "w-8 h-8 text-amber-500"
                  })}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {madinahWeather.temperature}°C
                </div>
                <p className="text-xs text-muted-foreground">
                  {translateDescription(madinahWeather.description)}
                </p>
                {madinahWeather.humidity && (
                  <p className="text-xs text-muted-foreground">
                    {madinahWeather.humidity}% humidité
                  </p>
                )}
              </>
            ) : (
              <div className="text-muted-foreground text-sm">Données indisponibles</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50"></div>

        {/* Exchange Rate */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">Taux de Change</p>
          <div className="text-xl font-bold text-primary">
            1 EUR = {eurToSar ? `${eurToSar} SAR` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Mis à jour en temps réel</p>
        </div>
      </div>
    </Card>
  );
};