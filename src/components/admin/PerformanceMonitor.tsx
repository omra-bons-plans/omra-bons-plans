import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Eye, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';

interface WebVitals {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  resourcesLoaded: number;
  totalPageSize: number;
  imageCount: number;
  avgImageSize: number;
  largeImages: number;
}

export const PerformanceMonitor = () => {
  const [webVitals, setWebVitals] = useState<WebVitals>({});
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Collecter les Core Web Vitals
    if ('web-vitals' in window || typeof window !== 'undefined') {
      measureWebVitals();
    }

    // Collecter les métriques de performance
    if (window.performance && window.performance.timing) {
      measurePerformanceMetrics();
    }

    setIsMonitoring(true);
  }, []);

  const measureWebVitals = () => {
    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      setWebVitals(prev => ({ ...prev, lcp: lastEntry.renderTime || lastEntry.loadTime }));
    });
    
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP not supported');
    }

    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setWebVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
      });
    });

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID not supported');
    }

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setWebVitals(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS not supported');
    }

    // FCP & TTFB depuis Navigation Timing
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      setWebVitals(prev => ({
        ...prev,
        fcp: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
        ttfb: navTiming.responseStart - navTiming.requestStart
      }));
    }
  };

  const measurePerformanceMetrics = () => {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    // Temps de chargement de la page
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

    // Analyser les ressources chargées
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const images = resources.filter(r => r.initiatorType === 'img' || r.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i));
    
    const totalImageSize = images.reduce((sum, img) => sum + (img.transferSize || 0), 0);
    const avgImageSize = images.length > 0 ? totalImageSize / images.length : 0;
    const largeImages = images.filter(img => (img.transferSize || 0) > 200 * 1024).length;

    const totalPageSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

    setMetrics({
      pageLoadTime: pageLoadTime / 1000,
      domContentLoaded: domContentLoaded / 1000,
      resourcesLoaded: resources.length,
      totalPageSize: totalPageSize / (1024 * 1024),
      imageCount: images.length,
      avgImageSize: avgImageSize / 1024,
      largeImages
    });

    // Alerter si images trop grosses
    if (largeImages > 0) {
      console.warn(`⚠️ ${largeImages} image(s) > 200KB détectée(s) !`);
    }
  };

  const getVitalScore = (metric: keyof WebVitals, value: number | undefined) => {
    if (!value) return { label: 'N/A', color: 'gray', status: 'unknown' };

    const thresholds: Record<keyof WebVitals, { good: number; needsImprovement: number }> = {
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      fcp: { good: 1800, needsImprovement: 3000 },
      ttfb: { good: 800, needsImprovement: 1800 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) {
      return { label: 'Bon', color: 'green', status: 'good' };
    } else if (value <= threshold.needsImprovement) {
      return { label: 'À améliorer', color: 'orange', status: 'needsImprovement' };
    } else {
      return { label: 'Mauvais', color: 'red', status: 'poor' };
    }
  };

  const formatValue = (metric: keyof WebVitals, value: number | undefined) => {
    if (!value) return 'N/A';
    
    if (metric === 'cls') {
      return value.toFixed(3);
    }
    return `${value.toFixed(0)}ms`;
  };

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Core Web Vitals
              </CardTitle>
              <CardDescription className="mt-2">
                Métriques de performance en temps réel
              </CardDescription>
            </div>
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? (
                <>
                  <Zap className="w-3 h-3 mr-1 animate-pulse" />
                  Actif
                </>
              ) : (
                'Inactif'
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* LCP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">LCP - Largest Contentful Paint</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{formatValue('lcp', webVitals.lcp)}</span>
                <Badge 
                  variant={getVitalScore('lcp', webVitals.lcp).status === 'good' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {getVitalScore('lcp', webVitals.lcp).label}
                </Badge>
              </div>
            </div>
            <Progress 
              value={webVitals.lcp ? Math.min((webVitals.lcp / 4000) * 100, 100) : 0} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Cible: &lt;2.5s (Bon) | 2.5-4s (À améliorer) | &gt;4s (Mauvais)
            </p>
          </div>

          {/* FID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">FID - First Input Delay</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{formatValue('fid', webVitals.fid)}</span>
                <Badge 
                  variant={getVitalScore('fid', webVitals.fid).status === 'good' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {getVitalScore('fid', webVitals.fid).label}
                </Badge>
              </div>
            </div>
            <Progress 
              value={webVitals.fid ? Math.min((webVitals.fid / 300) * 100, 100) : 0} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Cible: &lt;100ms (Bon) | 100-300ms (À améliorer) | &gt;300ms (Mauvais)
            </p>
          </div>

          {/* CLS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">CLS - Cumulative Layout Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{formatValue('cls', webVitals.cls)}</span>
                <Badge 
                  variant={getVitalScore('cls', webVitals.cls).status === 'good' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {getVitalScore('cls', webVitals.cls).label}
                </Badge>
              </div>
            </div>
            <Progress 
              value={webVitals.cls ? Math.min((webVitals.cls / 0.25) * 100, 100) : 0} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Cible: &lt;0.1 (Bon) | 0.1-0.25 (À améliorer) | &gt;0.25 (Mauvais)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {metrics && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Métriques de Performance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temps de chargement</p>
                <p className="text-2xl font-bold">{metrics.pageLoadTime.toFixed(2)}s</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">DOM Content Loaded</p>
                <p className="text-2xl font-bold">{metrics.domContentLoaded.toFixed(2)}s</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille de la page</p>
                <p className="text-2xl font-bold">{metrics.totalPageSize.toFixed(2)}MB</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Images chargées</p>
                <p className="text-2xl font-bold">{metrics.imageCount}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille moy. image</p>
                <p className="text-2xl font-bold">{metrics.avgImageSize.toFixed(0)}KB</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Images &gt;200KB</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{metrics.largeImages}</p>
                  {metrics.largeImages > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            {metrics.largeImages > 0 && (
              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-700 dark:text-orange-400">
                      Alerte: Images volumineuses détectées
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {metrics.largeImages} image(s) dépassent 200KB. Considérez l'optimisation avec la fonction de migration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
