import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface FormatSupport {
  avif: boolean;
  webp: boolean;
  jpeg: boolean;
  testing: boolean;
}

export const ImageFormatTester = () => {
  const [formatSupport, setFormatSupport] = useState<FormatSupport>({
    avif: false,
    webp: false,
    jpeg: true, // JPEG toujours supporté
    testing: true
  });

  useEffect(() => {
    testFormats();
  }, []);

  const testFormats = async () => {
    setFormatSupport(prev => ({ ...prev, testing: true }));

    // Test AVIF
    const avifSupported = await testImageFormat('avif');
    
    // Test WebP
    const webpSupported = await testImageFormat('webp');

    setFormatSupport({
      avif: avifSupported,
      webp: webpSupported,
      jpeg: true,
      testing: false
    });

    console.log('📊 Support des formats:', {
      AVIF: avifSupported ? '✅' : '❌',
      WebP: webpSupported ? '✅' : '❌',
      JPEG: '✅'
    });
  };

  const testImageFormat = (format: 'avif' | 'webp'): Promise<boolean> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }

      // Dessiner un pixel
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(0, 0, 1, 1);

      // Tester la conversion
      canvas.toBlob(
        (blob) => {
          if (blob && blob.type === `image/${format}`) {
            // Vérifier que l'image peut être chargée
            const img = new Image();
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
              URL.revokeObjectURL(url);
              resolve(true);
            };
            
            img.onerror = () => {
              URL.revokeObjectURL(url);
              resolve(false);
            };
            
            img.src = url;
          } else {
            resolve(false);
          }
        },
        `image/${format}`,
        0.5
      );

      // Timeout après 2 secondes
      setTimeout(() => resolve(false), 2000);
    });
  };

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = 'Inconnu';
    
    if (ua.includes('Firefox')) browserName = 'Firefox';
    else if (ua.includes('Chrome') && !ua.includes('Edg')) browserName = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browserName = 'Safari';
    else if (ua.includes('Edg')) browserName = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browserName = 'Opera';

    return browserName;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Test des Formats d'Images
            </CardTitle>
            <CardDescription className="mt-2">
              Validation du support AVIF/WebP/JPEG dans votre navigateur
            </CardDescription>
          </div>
          <Button 
            onClick={testFormats} 
            variant="outline" 
            size="sm"
            disabled={formatSupport.testing}
          >
            {formatSupport.testing ? 'Test en cours...' : 'Re-tester'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info navigateur */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Navigateur détecté:</span> {getBrowserInfo()}
          </p>
        </div>

        {/* Résultats des tests */}
        <div className="space-y-3">
          {/* AVIF */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">AVIF</p>
                <p className="text-xs text-muted-foreground">
                  Format next-gen (50% plus léger que WebP)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formatSupport.avif ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <Badge variant="default" className="bg-green-500">Supporté</Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <Badge variant="destructive">Non supporté</Badge>
                </>
              )}
            </div>
          </div>

          {/* WebP */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">WebP</p>
                <p className="text-xs text-muted-foreground">
                  Format moderne (30% plus léger que JPEG)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formatSupport.webp ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <Badge variant="default" className="bg-green-500">Supporté</Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <Badge variant="destructive">Non supporté</Badge>
                </>
              )}
            </div>
          </div>

          {/* JPEG */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">JPEG</p>
                <p className="text-xs text-muted-foreground">
                  Format universel (fallback)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <Badge variant="default" className="bg-green-500">Supporté</Badge>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Comment ça fonctionne:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>L'élément <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;picture&gt;</code> propose plusieurs sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Le navigateur choisit automatiquement le meilleur format supporté</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Fallback JPEG si aucun format moderne n'est supporté</span>
            </li>
          </ul>
        </div>

        {/* Stats de compatibilité */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {formatSupport.avif && formatSupport.webp ? '100%' : formatSupport.webp ? '66%' : '33%'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Compatibilité</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {formatSupport.avif ? '~80%' : formatSupport.webp ? '~65%' : '0%'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Économie estimée</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              {formatSupport.avif ? 'AVIF' : formatSupport.webp ? 'WebP' : 'JPEG'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Format utilisé</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
