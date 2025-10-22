import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, FileJson, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminOmraImport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [medinVoyagesData, setMedinVoyagesData] = useState<any[]>([]);
  const [omraSounnahData, setOmraSounnahData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Charger les données depuis les fichiers JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        const [medinResponse, omraResponse] = await Promise.all([
          fetch('/temp-medin-data.json'),
          fetch('/temp-omrasounnah-data.json')
        ]);
        
        const medinData = await medinResponse.json();
        const omraData = await omraResponse.json();
        
        setMedinVoyagesData(medinData);
        setOmraSounnahData(omraData);
        
        console.log('✅ Données chargées:', {
          medin: medinData.length,
          omra: omraData.length
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "⚠️ Erreur de chargement",
          description: "Impossible de charger les fichiers JSON",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [toast]);

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
        description: `${agencyName}: ${responseData.imported} importées, ${responseData.updated} mises à jour, ${responseData.enriched || 0} enrichies, ${responseData.skipped} ignorées`,
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

  const handleScrapeAll = async () => {
    try {
      setIsImporting(true);
      setResult(null);

      toast({
        title: "🚀 Scraping HTML en cours",
        description: "Récupération basique des données de toutes les agences...",
      });

      const { data: responseData, error: invokeError } = await supabase.functions.invoke('scrape-all-agencies');

      if (invokeError) throw invokeError;

      setResult(responseData);
      toast({
        title: "✅ Scraping HTML terminé",
        description: `${responseData.totalImported} offres importées depuis ${responseData.agencies?.length} agences`,
      });
    } catch (err: any) {
      console.error('Scraping error:', err);
      toast({
        title: "❌ Erreur de scraping",
        description: `Erreur: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleScrapeWithFirecrawl = async () => {
    try {
      setIsImporting(true);
      setResult(null);

      toast({
        title: "🔥 Firecrawl en cours",
        description: "Scraping robuste avec JavaScript rendering...",
      });

      const { data: responseData, error: invokeError } = await supabase.functions.invoke('scrape-with-firecrawl');

      if (invokeError) throw invokeError;

      setResult(responseData);
      toast({
        title: "✅ Firecrawl terminé",
        description: `${responseData.totalImported} offres importées avec ${responseData.totalErrors} erreurs`,
      });

      // Afficher les résultats détaillés dans la console
      console.log('📊 Résultats Firecrawl par agence:', responseData.agencies);
    } catch (err: any) {
      console.error('Firecrawl error:', err);
      toast({
        title: "❌ Erreur Firecrawl",
        description: `Erreur: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setIsImporting(true);
      
      const { data: responseData, error: invokeError } = await supabase.functions.invoke('cleanup-old-omra-offers');

      if (invokeError) throw invokeError;

      toast({
        title: "✅ Nettoyage réussi",
        description: `${responseData.deleted} anciennes offres supprimées`,
      });
    } catch (err: any) {
      console.error('Cleanup error:', err);
      toast({
        title: "❌ Erreur de nettoyage",
        description: `Erreur: ${err.message}`,
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
        description: `${data.imported} offres importées, ${data.updated} mises à jour, ${data.enriched || 0} enrichies par scraping, ${data.skipped} ignorées`,
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
            {isLoadingData ? (
              <Alert>
                <AlertDescription>
                  ⏳ Chargement des fichiers JSON...
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="mb-4 pb-4 border-b">
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleCleanup}
                      disabled={isImporting}
                      variant="destructive"
                      className="flex items-center gap-2 w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      🗑️ Nettoyer les anciennes offres
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleScrapeAll}
                        disabled={isImporting}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        🌐 Scraper HTML
                      </Button>
                      <Button
                        onClick={handleScrapeWithFirecrawl}
                        disabled={isImporting}
                        variant="default"
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        <Upload className="h-4 w-4" />
                        🔥 Firecrawl (Robuste)
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>HTML:</strong> Scraping basique rapide. <strong>Firecrawl:</strong> Scraping robuste avec rendering JavaScript (recommandé)
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleQuickImport(medinVoyagesData, 'Medin Voyages')}
                    disabled={isImporting || medinVoyagesData.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importer Medin Voyages ({medinVoyagesData.length} offres)
                  </Button>
                  <Button
                    onClick={() => handleQuickImport(omraSounnahData, 'Omra Sounnah')}
                    disabled={isImporting || omraSounnahData.length === 0}
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
                    disabled={isImporting || (medinVoyagesData.length === 0 && omraSounnahData.length === 0)}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Tout importer ({medinVoyagesData.length + omraSounnahData.length} offres)
                  </Button>
                </div>
              </>
            )}
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
