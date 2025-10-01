import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConversionSummary {
  converted: number;
  failed: number;
  total: number;
  totalOriginalSize: number;
  totalWebpSize: number;
  totalCompression: number;
}

export const BatchImageConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(40);
  const [summary, setSummary] = useState<ConversionSummary | null>(null);

  // Log au montage du composant
  console.log('🟦 BatchImageConverter monté, isConverting:', isConverting);

  const handleBatchConvert = async () => {
    console.log('🔵 handleBatchConvert appelée');
    
    if (!confirm('⚠️ Attention ! Cette opération va convertir TOUTES les images du site en WebP.\n\nCela peut prendre plusieurs minutes.\n\nVoulez-vous continuer ?')) {
      console.log('🔴 Conversion annulée par l\'utilisateur');
      return;
    }

    console.log('🟢 Conversion confirmée, démarrage...');
    setIsConverting(true);
    setSummary(null);

    try {
      toast.info('🚀 Conversion en masse démarrée...', {
        description: 'Cela peut prendre plusieurs minutes selon le nombre d\'images'
      });

      console.log('📡 Appel de l\'edge function avec quality:', quality);
      
      const { data, error } = await supabase.functions.invoke('batch-convert-images', {
        body: { quality }
      });

      console.log('📥 Réponse reçue:', { data, error });

      if (error) {
        console.error('❌ Erreur retournée par l\'edge function:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée retournée par la fonction');
      }

      console.log('✅ Batch conversion result:', data);
      
      setSummary({
        converted: data.converted,
        failed: data.failed,
        total: data.total,
        totalOriginalSize: data.summary.totalOriginalSize,
        totalWebpSize: data.summary.totalWebpSize,
        totalCompression: data.summary.totalCompression
      });

      toast.success(`✅ Conversion terminée !`, {
        description: `${data.converted} images converties avec ${data.summary.totalCompression}% de compression`
      });

    } catch (error) {
      console.error('❌ Batch conversion error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      
      toast.error('Erreur lors de la conversion en masse', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      console.log('🏁 Conversion terminée (succès ou échec)');
      setIsConverting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          ⚡ Conversion en Masse - TOUTES LES IMAGES
        </CardTitle>
        <CardDescription>
          Convertit automatiquement toutes les images du site (annonces, blog, hero) en WebP ultra-compressé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning */}
        <Alert>
          <AlertDescription>
            <strong>⚠️ Attention :</strong> Cette opération va convertir toutes les images PNG/JPG du storage en WebP.
            Les références dans la base de données seront automatiquement mises à jour.
          </AlertDescription>
        </Alert>

        {/* Quality Control */}
        <div className="space-y-2">
          <Label>Qualité WebP (1-100)</Label>
          <div className="flex items-center gap-4">
            <Input 
              type="number"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-24"
              disabled={isConverting}
            />
            <span className="text-sm text-muted-foreground">
              {quality < 30 && '🔥 Ultra-agressif (recommandé pour mobile)'}
              {quality >= 30 && quality < 60 && '✅ Optimal (balance qualité/taille)'}
              {quality >= 60 && '⚠️ Haute qualité (fichiers plus lourds)'}
            </span>
          </div>
        </div>

        {/* Test Button HTML natif */}
        <button 
          onClick={(e) => {
            console.log('🔴 CLICK HTML NATIF DÉTECTÉ!', e);
            handleBatchConvert();
          }}
          disabled={isConverting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {isConverting ? '⏳ Conversion en cours...' : '⚡ CLIQUEZ ICI - Test bouton natif'}
        </button>

        {/* Action Button shadcn */}
        <Button 
          onClick={(e) => {
            console.log('🟣 CLICK SHADCN DÉTECTÉ!', e);
            handleBatchConvert();
          }}
          disabled={isConverting}
          className="w-full"
          size="lg"
          variant="default"
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conversion en cours... (cela peut prendre 5-10 min)
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Lancer la conversion massive (shadcn)
            </>
          )}
        </Button>

        {/* Results Summary */}
        {summary && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Résultats de la conversion
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Images converties</p>
                <p className="text-2xl font-bold text-green-500">{summary.converted}</p>
              </div>
              
              {summary.failed > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Échecs</p>
                  <p className="text-2xl font-bold text-red-500">{summary.failed}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille originale</p>
                <p className="text-xl font-semibold">{summary.totalOriginalSize} MB</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille WebP</p>
                <p className="text-xl font-semibold text-primary">{summary.totalWebpSize} MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compression totale</span>
                <span className="font-bold text-primary">{summary.totalCompression}%</span>
              </div>
              <Progress value={summary.totalCompression} className="h-2" />
            </div>

            <Alert>
              <AlertDescription>
                💾 <strong>Espace économisé :</strong> {summary.totalOriginalSize - summary.totalWebpSize} MB
                <br />
                ⚡ <strong>Impact LCP :</strong> Les images sont maintenant {summary.totalCompression}% plus légères !
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>📋 Ce qui sera fait :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Scan de toutes les images PNG/JPG dans le storage</li>
            <li>Conversion en WebP avec la qualité choisie</li>
            <li>Mise à jour automatique des références dans ads et blog_posts</li>
            <li>Conservation des images originales</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};