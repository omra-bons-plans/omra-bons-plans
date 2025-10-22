import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, FileJson, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminOmraImport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const medinVoyagesData = [
    {"nomAgence":"Medin Voyages","moisOmra":"Octobre","dateDepart":"24 octobre 2025","dateRetour":"03 novembre 2025","nombreJours":"10 jours","prixQuadruple":1799,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-octobre-2025/"},
    {"nomAgence":"Medin Voyages","moisOmra":"Novembre","dateDepart":"06 novembre 2025","dateRetour":"15 novembre 2025","nombreJours":"9 jours","prixQuadruple":999,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":null,"hotelMedine":null,"airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-novembre-2025-promo-999e/"},
    {"nomAgence":"Medin Voyages","moisOmra":"Novembre","dateDepart":"20 novembre 2025","dateRetour":"30 novembre 2025","nombreJours":"10 jours","prixQuadruple":1599,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-novembre-2025/"},
    {"nomAgence":"Medin Voyages","moisOmra":"decembre","dateDepart":"09 décembre 2025","dateRetour":"18 décembre 2025","nombreJours":null,"prixQuadruple":999,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":null,"hotelMedine":null,"airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-decembre-2025-promo-999e/"},
    {"nomAgence":"Medin Voyages","moisOmra":"decembre","dateDepart":"26 décembre 2025","dateRetour":"05 janvier 2026","nombreJours":null,"prixQuadruple":2099,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-decembre-2025/"},
    {"nomAgence":"Medin Voyages","moisOmra":"Janvier","dateDepart":"15 janvier 2026","dateRetour":"24 janvier 2026","nombreJours":"9 jours","prixQuadruple":1499,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-janvier-2026/"},
    {"nomAgence":"Medin Voyages","moisOmra":"fevrier","dateDepart":"05 février 2026","dateRetour":"14 février 2026","nombreJours":null,"prixQuadruple":1599,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":"SAUDIA AIRLINES","detailUrl":"https://medinvoyages.com/omras/omra-fevrier-2026/"},
    {"nomAgence":"Medin Voyages","moisOmra":"Septembre","dateDepart":null,"dateRetour":null,"nombreJours":null,"prixQuadruple":1499,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":null,"detailUrl":"https://medinvoyages.com/omras/omra-septembre-2026/"},
    {"nomAgence":"Medin Voyages","moisOmra":"aout","dateDepart":null,"dateRetour":null,"nombreJours":null,"prixQuadruple":1799,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":null,"detailUrl":"https://medinvoyages.com/omras/omra-aout-2026/"},
    {"nomAgence":"Medin Voyages","moisOmra":"juillet","dateDepart":null,"dateRetour":null,"nombreJours":null,"prixQuadruple":1599,"villeDepart":"de Roissy Charles de Gaulle","hotelMakkah":"Address Jabal Omar (5 étoiles)","hotelMedine":"View Al Madinah (4 étoiles)","airline":null,"detailUrl":"https://medinvoyages.com/omras/omra-juillet-2026/"}
  ];

  const omraSounnahData = [
    {"nomAgence":"Omra Sounnah","moisOmra":"octobre","dateDepart":"23 octobre 2025","dateRetour":"01 novembre 2025","nombreJours":"9 jours","prixQuadruple":1990,"villeDepart":"Paris","hotelMakkah":"hôtel Jumeirah (5 étoiles)","hotelMedine":"hôtel View al madinah (4 étoiles)","airline":null,"detailUrl":"https://www.omrasounnah.com/omra-octobre-pas-cher/"},
    {"nomAgence":"Omra Sounnah","moisOmra":"decembre","dateDepart":"24 décembre 2025","dateRetour":"03 janvier 2025","nombreJours":null,"prixQuadruple":1690,"villeDepart":"Paris","hotelMakkah":"Hôtel 5 étoiles (proche du Haram)","hotelMedine":"Hôtel 5 étoiles (proche Masjid Nabawi)","airline":"Saudia Airlines","detailUrl":"https://www.omrasounnah.com/omra-decembre-pas-cher/"},
    {"nomAgence":"Omra Sounnah","moisOmra":"janvier","dateDepart":"22 janvier 2025","dateRetour":"01 février 2025","nombreJours":null,"prixQuadruple":1690,"villeDepart":"Paris","hotelMakkah":"Hôtel 5 étoiles (proche du Haram)","hotelMedine":"Hôtel 5 étoiles (proche Masjid Nabawi)","airline":"Saudia Airlines","detailUrl":"https://www.omrasounnah.com/omra-janvier-pas-cher/"},
    {"nomAgence":"Omra Sounnah","moisOmra":"fevrier","dateDepart":"17 février 2025","dateRetour":"27 février 2025","nombreJours":null,"prixQuadruple":null,"villeDepart":"Paris","hotelMakkah":"Hôtel 5 étoiles (proche du Haram)","hotelMedine":"Hôtel 5 étoiles (proche Masjid Nabawi)","airline":"Saudia Airlines","detailUrl":"https://www.omrasounnah.com/omra-fevrier-pas-cher/"}
  ];

  const handleQuickImport = async (data: any[], agencyName: string) => {
    try {
      setIsImporting(true);
      setResult(null);

      const { data: responseData, error: invokeError } = await supabase.functions.invoke('import-omra-data', {
        body: { offers: data }
      });

      if (invokeError) throw invokeError;

      setResult(responseData);
      toast({
        title: "✅ Import réussi",
        description: `${agencyName}: ${responseData.summary}`,
      });
    } catch (err: any) {
      console.error('Import error:', err);
      toast({
        title: "❌ Erreur d'import",
        description: `Erreur lors de l'import ${agencyName}: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez coller des données JSON",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const offers = JSON.parse(jsonData);
      
      if (!Array.isArray(offers)) {
        throw new Error("Le JSON doit être un tableau d'offres");
      }

      console.log(`📤 Envoi de ${offers.length} offres à importer...`);

      const { data, error } = await supabase.functions.invoke('import-omra-data', {
        body: { offers },
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: "✅ Import réussi",
        description: `${data.imported} offres importées, ${data.updated} mises à jour, ${data.skipped} ignorées`,
      });

      setJsonData("");
    } catch (error: any) {
      console.error("Erreur d'import:", error);
      toast({
        title: "❌ Erreur d'import",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour Admin
          </Button>
          <h1 className="text-3xl font-bold">Import Offres Omra</h1>
        </div>

        <div className="grid gap-6">
          {/* Quick Import Buttons */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Import rapide</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Utilisez ces boutons pour importer rapidement les offres des agences
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleQuickImport(medinVoyagesData, 'Medin Voyages')}
                disabled={isImporting}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer Medin Voyages ({medinVoyagesData.length} offres)
              </Button>
              <Button
                onClick={() => handleQuickImport(omraSounnahData, 'Omra Sounnah')}
                disabled={isImporting}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer Omra Sounnah ({omraSounnahData.length} offres)
              </Button>
              <Button
                onClick={async () => {
                  await handleQuickImport(medinVoyagesData, 'Medin Voyages');
                  await handleQuickImport(omraSounnahData, 'Omra Sounnah');
                }}
                disabled={isImporting}
                variant="default"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Tout importer
              </Button>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <FileJson className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Instructions</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Copiez les données JSON depuis vos fichiers de scraping (format tableau)</p>
                  <p>2. Collez-les dans la zone de texte ci-dessous</p>
                  <p>3. Cliquez sur "Importer" pour traiter les données</p>
                  <p className="text-xs mt-3 p-3 bg-muted/50 rounded-lg">
                    <strong>Format attendu :</strong> Un tableau JSON avec les champs : nomAgence, moisOmra, dateDepart, 
                    dateRetour, nombreJours, prixQuadruple, villeDepart, hotelMakkah, hotelMedine, airline, detailUrl
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Zone de saisie JSON */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Données JSON à importer
                </label>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder='[{"nomAgence": "Omra Sounnah", "moisOmra": "janvier", ...}]'
                  className="min-h-[400px] font-mono text-xs"
                  disabled={isImporting}
                />
              </div>

              <Button
                onClick={handleImport}
                disabled={isImporting || !jsonData.trim()}
                className="w-full gap-2"
                size="lg"
              >
                <Upload className="h-5 w-5" />
                {isImporting ? "Import en cours..." : "Importer les offres"}
              </Button>
            </div>
          </Card>

          {/* Résultats */}
          {result && (
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Résultats de l'import
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.imported}
                    </div>
                    <div className="text-sm text-muted-foreground">Nouvelles offres</div>
                  </div>

                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.updated}
                    </div>
                    <div className="text-sm text-muted-foreground">Mises à jour</div>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {result.skipped}
                    </div>
                    <div className="text-sm text-muted-foreground">Ignorées</div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="text-2xl font-bold text-primary">
                      {result.total}
                    </div>
                    <div className="text-sm text-muted-foreground">Total traité</div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Les offres importées sont maintenant visibles dans le comparateur Omra.
                    Le système de scraping hebdomadaire continuera de mettre à jour les offres automatiquement.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
