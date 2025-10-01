import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const WebPConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [sourcePath, setSourcePath] = useState('lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png');
  const [targetPath, setTargetPath] = useState('lovable-uploads/hero-desktop.webp');
  const [quality, setQuality] = useState(40);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-webp', {
        body: { 
          sourcePath, 
          targetPath, 
          quality,
          width,
          height
        }
      });

      if (error) throw error;

      console.log('✅ Conversion result:', data);
      toast.success(`Image convertie avec succès ! Compression: ${data.compression}%`);
    } catch (error) {
      console.error('❌ Conversion error:', error);
      toast.error('Erreur lors de la conversion');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔄 Convertisseur WebP</CardTitle>
        <CardDescription>
          Convertir les images PNG en WebP ultra-compressé pour optimiser le LCP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Chemin source (dans ad-images)</Label>
          <Input 
            value={sourcePath}
            onChange={(e) => setSourcePath(e.target.value)}
            placeholder="lovable-uploads/image.png"
          />
        </div>

        <div className="space-y-2">
          <Label>Chemin cible</Label>
          <Input 
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            placeholder="lovable-uploads/image.webp"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Qualité (0-100)</Label>
            <Input 
              type="number"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Largeur (px)</Label>
            <Input 
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Hauteur (px)</Label>
            <Input 
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
            />
          </div>
        </div>

        <Button 
          onClick={handleConvert} 
          disabled={isConverting}
          className="w-full"
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conversion en cours...
            </>
          ) : (
            'Convertir en WebP'
          )}
        </Button>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Presets recommandés :</h4>
          <div className="space-y-2 text-sm">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSourcePath('lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png');
                setTargetPath('lovable-uploads/hero-desktop.webp');
                setWidth(1920);
                setHeight(1080);
                setQuality(40);
              }}
            >
              Hero Desktop (1920x1080, Q40)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSourcePath('lovable-uploads/d5128689-bda3-4612-9ae8-6910ed21a8c8-optimized.png');
                setTargetPath('lovable-uploads/hero-mobile.webp');
                setWidth(640);
                setHeight(960);
                setQuality(30);
              }}
            >
              Hero Mobile (640x960, Q30)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};