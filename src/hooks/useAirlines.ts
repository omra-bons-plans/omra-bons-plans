import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const searchAirlines = async (query: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling airlines-search function with query:', query);
      
      const { data, error: functionError } = await supabase.functions.invoke('airlines-search', {
        body: {
          query,
          popular_only: true // Recherche d'abord les populaires
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Erreur lors de l\'appel de la fonction');
      }

      if (data && data.airlines) {
        setAirlines(data.airlines);
        console.log(`Received ${data.airlines.length} airlines from ${data.source}`);
      } else {
        throw new Error('Données invalides reçues');
      }
      
    } catch (err) {
      console.error('Erreur dans useAirlines:', err);
      setError('Erreur lors de la récupération des compagnies aériennes');
      
      // Fallback avec liste statique en cas d'erreur
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
      
      setAirlines(staticAirlines.filter(airline => 
        query === '' || 
        airline.name.toLowerCase().includes(query.toLowerCase()) ||
        airline.iata.toLowerCase().includes(query.toLowerCase())
      ));
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