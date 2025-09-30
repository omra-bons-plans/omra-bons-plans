import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Network,
  ArrowRight
} from 'lucide-react';

export const LCPOptimizationGuide = () => {
  const optimizations = [
    {
      category: 'Images Hero',
      status: 'implemented',
      icon: ImageIcon,
      items: [
        {
          title: 'Images preload avec fetchpriority="high"',
          description: 'Les images hero sont préchargées dans index.html avec priorité élevée',
          status: 'done'
        },
        {
          title: 'Conversion background CSS en <img>',
          description: 'Images hero converties de background CSS vers balises <img> avec loading="eager"',
          status: 'done'
        },
        {
          title: 'Suppression de background-attachment: fixed',
          description: 'Améliore les performances de scroll et rendu initial',
          status: 'done'
        }
      ]
    },
    {
      category: 'Fonts',
      status: 'implemented',
      icon: FileText,
      items: [
        {
          title: 'Preload des fonts critiques',
          description: 'Google Fonts Inter préchargée avec display=swap',
          status: 'done'
        },
        {
          title: 'Chargement asynchrone des fonts',
          description: 'Fonts chargées en print puis basculées en all pour ne pas bloquer le rendu',
          status: 'done'
        }
      ]
    },
    {
      category: 'Réseau',
      status: 'implemented',
      icon: Network,
      items: [
        {
          title: 'DNS Prefetch pour Supabase',
          description: 'Résolution DNS anticipée pour les ressources externes',
          status: 'done'
        },
        {
          title: 'Preconnect pour Google Fonts',
          description: 'Connexion anticipée aux serveurs de fonts',
          status: 'done'
        }
      ]
    }
  ];

  const recommendations = [
    {
      priority: 'high',
      title: 'Convertir les images PNG en WebP/AVIF',
      description: 'Les images hero optimized.png peuvent être converties en WebP ou AVIF pour réduire leur poids de 40-60%',
      action: 'Utiliser le panneau de migration d\'images dans l\'admin'
    },
    {
      priority: 'medium',
      title: 'Lazy load des images below-the-fold',
      description: 'S\'assurer que les images non visibles initialement utilisent loading="lazy"',
      action: 'Vérifier les composants AdCard et autres cartes'
    },
    {
      priority: 'medium',
      title: 'Optimiser le bundle JavaScript',
      description: 'Code splitting et lazy loading des routes non critiques',
      action: 'Déjà implémenté avec React.lazy() dans App.tsx'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Guide d'Optimisation LCP
              </CardTitle>
              <CardDescription className="mt-2">
                Optimisations implémentées pour améliorer le Largest Contentful Paint (LCP)
              </CardDescription>
            </div>
            <Badge variant="default" className="text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Actif
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Optimisations implémentées */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">✅ Optimisations Actives</h3>
            
            {optimizations.map((optimization, idx) => {
              const Icon = optimization.icon;
              return (
                <div key={idx} className="border border-border/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">{optimization.category}</h4>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {optimization.items.length} optimisations
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 ml-7">
                    {optimization.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommandations supplémentaires */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recommandations Supplémentaires
            </h3>
            
            {recommendations.map((rec, idx) => (
              <Alert key={idx} className={
                rec.priority === 'high' 
                  ? 'border-orange-500/50 bg-orange-500/5' 
                  : 'border-blue-500/50 bg-blue-500/5'
              }>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority === 'high' ? 'Priorité Haute' : 'Priorité Moyenne'}
                      </Badge>
                      <span className="font-semibold text-sm">{rec.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium">{rec.action}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Objectif LCP */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Objectif LCP</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Pour un score "Bon" selon Google, le LCP doit être inférieur à 2.5 secondes.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="font-bold text-green-700 dark:text-green-400">Bon</div>
                <div className="text-muted-foreground">&lt; 2.5s</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                <div className="font-bold text-orange-700 dark:text-orange-400">À améliorer</div>
                <div className="text-muted-foreground">2.5s - 4s</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                <div className="font-bold text-red-700 dark:text-red-400">Mauvais</div>
                <div className="text-muted-foreground">&gt; 4s</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
