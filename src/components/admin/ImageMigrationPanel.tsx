import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  HardDrive,
  Zap
} from 'lucide-react';

interface MigrationStats {
  totalFiles: number;
  successCount: number;
  errorCount: number;
  totalOriginalSize: number;
  totalNewSize: number;
  totalSavings: string;
}

export const ImageMigrationPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [progress, setProgress] = useState(0);

  const runMigration = async () => {
    try {
      setIsRunning(true);
      setProgress(10);
      toast.info('🚀 Démarrage de la migration des images...');

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Session expirée, veuillez vous reconnecter');
        return;
      }

      setProgress(30);

      const response = await supabase.functions.invoke('migrate-optimize-images', {
        body: { 
          action: 'migrate',
          buckets: ['ad-images', 'blog-images']
        }
      });

      setProgress(90);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.success) {
        setStats(response.data.stats);
        setProgress(100);
        toast.success(`✅ Migration terminée : ${response.data.stats.successCount} images optimisées !`);
      } else {
        throw new Error('Migration échouée');
      }

    } catch (error) {
      console.error('Erreur migration:', error);
      toast.error('Erreur lors de la migration : ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const getStorageStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Session expirée');
        return;
      }

      const response = await supabase.functions.invoke('migrate-optimize-images', {
        body: { action: 'stats' }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const stats = response.data.stats;
      const totalSize = (stats['ad-images'].totalSize + stats['blog-images'].totalSize) / (1024 * 1024);
      
      toast.info(`📊 Stockage total: ${totalSize.toFixed(1)}MB | ${stats['ad-images'].count + stats['blog-images'].count} fichiers`);
    } catch (error) {
      console.error('Erreur stats:', error);
      toast.error('Erreur lors de la récupération des stats');
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Migration et Optimisation des Images
            </CardTitle>
            <CardDescription className="mt-2">
              Recompression AVIF ultra-agressive de toutes les images existantes
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            Phase 2
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats avant migration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taille actuelle</p>
                  <p className="text-2xl font-bold">~15-20MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Objectif</p>
                  <p className="text-2xl font-bold text-green-500">~3-4MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gain attendu</p>
                  <p className="text-2xl font-bold text-blue-500">80-85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={runMigration}
            disabled={isRunning}
            className="flex-1"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migration en cours...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Lancer la migration
              </>
            )}
          </Button>

          <Button
            onClick={getStorageStats}
            variant="outline"
            size="lg"
          >
            <HardDrive className="w-4 h-4 mr-2" />
            Stats
          </Button>
        </div>

        {/* Progress bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Résultats */}
        {stats && (
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                    Migration terminée avec succès !
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Images traitées</p>
                      <p className="font-semibold">{stats.totalFiles}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Succès</p>
                      <p className="font-semibold text-green-600">{stats.successCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taille originale</p>
                      <p className="font-semibold">
                        {(stats.totalOriginalSize / (1024 * 1024)).toFixed(1)}MB
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nouvelle taille</p>
                      <p className="font-semibold text-green-600">
                        {(stats.totalNewSize / (1024 * 1024)).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Économie totale</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalSavings}</p>
                  </div>
                  {stats.errorCount > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{stats.errorCount} erreur(s) détectée(s)</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Les images seront converties en AVIF (50% plus léger que WebP)</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Qualité optimisée à 70% (imperceptible à l'œil)</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Taille cible : 80-150KB par image selon contexte</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Sauvegarde automatique avant conversion</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
