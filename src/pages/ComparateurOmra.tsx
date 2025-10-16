import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const ComparateurOmra = () => {
  const { data: offersCount, isLoading } = useQuery({
    queryKey: ['omra-offers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('omra_offers')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count;
    },
    retry: false,
  });

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur de Séjours Omra - Meilleurs Prix | Omra Bons Plans</title>
        <meta name="description" content="Comparez les offres de séjours Omra de plusieurs agences." />
        <link rel="canonical" href="https://omrabonsplans.fr/comparateur-omra" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Comparateur de séjours Omra</h1>
          <p className="text-muted-foreground text-lg">
            Page en cours de développement
          </p>
        </div>

        <Card className="p-12 text-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement...</p>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Comparateur Omra</h2>
              <p className="text-lg mb-4">
                {offersCount !== null ? `${offersCount} offres dans la base de données` : 'Base de données accessible'}
              </p>
              <p className="text-muted-foreground">
                Le comparateur sera bientôt disponible. En attendant, consultez notre{' '}
                <a href="/agences-liste" className="text-primary underline">liste d'agences</a>.
              </p>
            </>
          )}
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default ComparateurOmra;