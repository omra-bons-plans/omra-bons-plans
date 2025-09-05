import { useState, useEffect } from 'react';

export interface Airline {
  icao: string;
  iata: string;
  name: string;
  country: string;
  fleet_average_age?: number;
  fleet_size?: number;
}

export const useAirlines = () => {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compagnies populaires pour les vols France-Arabie Saoudite
  const popularAirlines = [
    'Air France', 'Saudia', 'Emirates', 'Qatar Airways', 
    'Turkish Airlines', 'Lufthansa', 'KLM', 'British Airways',
    'Etihad Airways', 'Royal Jordanian', 'EgyptAir'
  ];

  const searchAirlines = async (query: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      let allAirlines: Airline[] = [];
      
      // Recherche par les compagnies populaires d'abord
      for (const popularName of popularAirlines) {
        if (query === '' || popularName.toLowerCase().includes(query.toLowerCase())) {
          try {
            const response = await fetch(`https://api.api-ninjas.com/v1/airlines?name=${encodeURIComponent(popularName)}`, {
              headers: {
                'X-Api-Key': 'YOUR_API_KEY' // À remplacer par votre clé API
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data)) {
                allAirlines.push(...data);
              }
            }
          } catch (err) {
            console.log(`Erreur pour ${popularName}:`, err);
          }
        }
      }
      
      // Fallback avec liste statique si API indisponible
      if (allAirlines.length === 0) {
        const staticAirlines = [
          { icao: 'AFR', iata: 'AF', name: 'Air France', country: 'France' },
          { icao: 'SVA', iata: 'SV', name: 'Saudia', country: 'Saudi Arabia' },
          { icao: 'UAE', iata: 'EK', name: 'Emirates', country: 'United Arab Emirates' },
          { icao: 'QTR', iata: 'QR', name: 'Qatar Airways', country: 'Qatar' },
          { icao: 'THY', iata: 'TK', name: 'Turkish Airlines', country: 'Turkey' },
          { icao: 'DLH', iata: 'LH', name: 'Lufthansa', country: 'Germany' },
          { icao: 'KLM', iata: 'KL', name: 'KLM Royal Dutch Airlines', country: 'Netherlands' },
          { icao: 'BAW', iata: 'BA', name: 'British Airways', country: 'United Kingdom' },
          { icao: 'ETD', iata: 'EY', name: 'Etihad Airways', country: 'United Arab Emirates' },
          { icao: 'RJA', iata: 'RJ', name: 'Royal Jordanian', country: 'Jordan' },
          { icao: 'MSR', iata: 'MS', name: 'EgyptAir', country: 'Egypt' }
        ];
        
        allAirlines = staticAirlines.filter(airline => 
          query === '' || 
          airline.name.toLowerCase().includes(query.toLowerCase()) ||
          airline.iata.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Supprimer les doublons et trier
      const uniqueAirlines = allAirlines.reduce((acc: Airline[], current) => {
        const exists = acc.find(airline => airline.iata === current.iata);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setAirlines(uniqueAirlines.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError('Erreur lors de la récupération des compagnies aériennes');
      console.error('Erreur API Airlines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchAirlines();
  }, []);

  return {
    airlines,
    loading,
    error,
    searchAirlines
  };
};