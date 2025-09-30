import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Network,
  Code,
  Zap,
  Clock
} from 'lucide-react';

interface LCPElement {
  element: string;
  url?: string;
  size: number;
  loadTime: number;
}

export const LCPDiagnostic = () => {
  const [lcpElement, setLcpElement] = useState<LCPElement | null>(null);
  const [lcpTime, setLcpTime] = useState<number | null>(null);
  const [resourceTimings, setResourceTimings] = useState<PerformanceResourceTiming[]>([]);

  useEffect(() => {
    // Observer le LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        const time = lastEntry.renderTime || lastEntry.loadTime;
        setLcpTime(time);
        
        setLcpElement({
          element: lastEntry.element?.tagName || 'Unknown',
          url: lastEntry.url || lastEntry.element?.currentSrc || lastEntry.element?.src,
          size: lastEntry.size || 0,
          loadTime: time
        });
      }
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // Analyser les ressources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const images = resources.filter(r => 
      r.initiatorType === 'img' || 
      r.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
    );
    
    // Trier par durée de chargement
    const sortedImages = images.sort((a, b) => b.duration - a.duration);
    setResourceTimings(sortedImages.slice(0, 10));

    return () => lcpObserver.disconnect();
  }, []);

  const getLCPStatus = (time: number | null) => {
    if (!time) return { status: 'unknown', label: 'N/A', color: 'gray' };
    if (time <= 2500) return { status: 'good', label: 'Bon', color: 'green' };
    if (time <= 4000) return { status: 'needsImprovement', label: 'À améliorer', color: 'orange' };
    return { status: 'poor', label: 'Mauvais', color: 'red' };
  };

  const status = getLCPStatus(lcpTime);

  const diagnostics = [
    {
      title: 'Élément LCP identifié',
      passed: lcpElement !== null,
      description: lcpElement ? 
        `${lcpElement.element}${lcpElement.url ? ` - ${new URL(lcpElement.url).pathname}` : ''}` : 
        'Élément LCP non encore détecté',
      icon: Code
    },
    {
      title: 'Temps de chargement',
      passed: (lcpTime || 0) <= 2500,
      description: lcpTime ? 
        `${(lcpTime / 1000).toFixed(2)}s - ${status.label}` : 
        'En cours de mesure...',
      icon: Clock
    },
    {
      title: 'Images optimisées',
      passed: resourceTimings.every(r => r.transferSize < 100 * 1024),
      description: `${resourceTimings.filter(r => r.transferSize < 100 * 1024).length}/${resourceTimings.length} images < 100KB`,
      icon: ImageIcon
    },
    {
      title: 'Connexion précoce',
      passed: document.querySelectorAll('link[rel="preconnect"]').length >= 2,
      description: `${document.querySelectorAll('link[rel="preconnect"]').length} connexions pré-établies`,
      icon: Network
    }
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Diagnostic LCP en Temps Réel
            </CardTitle>
            <CardDescription className="mt-2">
              Analyse de l'élément le plus large visible
            </CardDescription>
          </div>
          <Badge 
            variant={status.status === 'good' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {lcpTime ? `${(lcpTime / 1000).toFixed(2)}s` : 'Mesure...'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score LCP */}
        {lcpTime && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score LCP</span>
              <span className={`text-sm font-bold ${
                status.status === 'good' ? 'text-green-600' : 
                status.status === 'needsImprovement' ? 'text-orange-600' : 
                'text-red-600'
              }`}>
                {status.label}
              </span>
            </div>
            <Progress 
              value={Math.min((lcpTime / 4000) * 100, 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Objectif: &lt;2.5s (Bon) | 2.5-4s (À améliorer) | &gt;4s (Mauvais)
            </p>
          </div>
        )}

        {/* Diagnostics */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Vérifications</h4>
          {diagnostics.map((diagnostic, idx) => {
            const Icon = diagnostic.icon;
            const StatusIcon = diagnostic.passed ? CheckCircle2 : XCircle;
            
            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{diagnostic.title}</p>
                    <StatusIcon className={`w-4 h-4 ${
                      diagnostic.passed ? 'text-green-500' : 'text-red-500'
                    }`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{diagnostic.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top 5 images les plus lentes */}
        {resourceTimings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Images les plus lentes
            </h4>
            <div className="space-y-2">
              {resourceTimings.slice(0, 5).map((resource, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-xs truncate font-mono">
                      {new URL(resource.name).pathname.split('/').pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(resource.transferSize / 1024).toFixed(1)}KB • {resource.duration.toFixed(0)}ms
                    </p>
                  </div>
                  {resource.transferSize > 200 * 1024 && (
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations */}
        {lcpTime && lcpTime > 2500 && (
          <Alert className="border-orange-500/50 bg-orange-500/5">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <AlertDescription>
              <p className="font-semibold text-sm mb-2">Recommandations pour améliorer le LCP :</p>
              <ul className="text-xs space-y-1 ml-4 list-disc">
                {lcpElement?.url && (
                  <li>Optimiser l'image LCP : {new URL(lcpElement.url).pathname}</li>
                )}
                <li>Utiliser CDN pour les images statiques</li>
                <li>Activer la compression Brotli sur le serveur</li>
                <li>Réduire les requêtes bloquantes JavaScript/CSS</li>
                <li>Utiliser les images de nouvelle génération (AVIF, WebP)</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
