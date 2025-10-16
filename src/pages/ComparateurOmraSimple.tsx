import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ComparateurOmraSimple() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        console.log('Fetching offers...');
        const { data, error: fetchError } = await supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active')
          .limit(10);

        console.log('Data:', data);
        console.log('Error:', fetchError);

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setOffers(data || []);
        }
      } catch (err: any) {
        console.error('Caught error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Comparateur Omra (Test)</h1>

        {error && (
          <Card className="p-6 mb-4 border-destructive">
            <p className="text-destructive">Erreur: {error}</p>
          </Card>
        )}

        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">
              {offers.length} offres trouvées
            </p>
            
            {offers.map((offer) => (
              <Card key={offer.id} className="p-4">
                <h3 className="font-bold">{offer.offer_title}</h3>
                <p>Prix: {offer.price_eur}€</p>
                <p>Agence: {offer.agency_name}</p>
                <p>Formule: {offer.formula_type}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
