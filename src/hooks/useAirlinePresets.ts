import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AirlinePreset {
  id: string;
  airline_name: string;
  usage_count: number;
}

export const useAirlinePresets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: airlines = [], isLoading } = useQuery({
    queryKey: ['airline-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airline_presets')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data as AirlinePreset[];
    },
  });

  const saveAirlineMutation = useMutation({
    mutationFn: async (airlineName: string) => {
      const { error } = await supabase.rpc('increment_airline_usage', {
        p_airline_name: airlineName,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airline-presets'] });
    },
    onError: (error) => {
      console.error('Error saving airline:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la compagnie aérienne",
        variant: "destructive",
      });
    },
  });

  const saveAirline = async (airlineName: string) => {
    if (!airlineName.trim()) return;
    await saveAirlineMutation.mutateAsync(airlineName.trim());
  };

  return {
    airlines,
    isLoading,
    saveAirline,
  };
};
