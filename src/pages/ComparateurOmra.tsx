import { Helmet } from "react-helmet-async";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Card } from "@/components/ui/card";

const ComparateurOmra = () => {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur de Séjours Omra | Omra Bons Plans</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Comparateur de séjours Omra</h1>
        <h2 className="text-2xl font-semibold mb-6">Filtres et résultats</h2>
        
        <Card className="p-8">
          <p className="text-lg">Page de comparaison en cours de chargement...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Si vous voyez ce message, la page fonctionne correctement.
          </p>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default ComparateurOmra;
