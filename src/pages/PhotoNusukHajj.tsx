import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Camera, Loader2, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { toast } from 'sonner';
import { 
  convertToNusukFormat, 
  downloadConvertedPhoto, 
  validateImageFile,
  type ConversionProgress 
} from '@/utils/nusukPhotoConverter';
import SEOHead from '@/components/SEO/SEOHead';

const PhotoNusukHajj = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setConvertedImage(null);
    setConvertedBlob(null);
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide');
      return;
    }
    
    // Store the file for later use
    setOriginalFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setOriginalImage(previewUrl);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleConvert = async () => {
    if (!originalFile) {
      setError('Veuillez d\'abord sélectionner une photo.');
      return;
    }
    
    setIsConverting(true);
    setError(null);
    setProgress({ stage: 'loading', progress: 0 });
    
    try {
      const result = await convertToNusukFormat(originalFile, setProgress);
      
      setConvertedBlob(result);
      setConvertedImage(URL.createObjectURL(result));
      toast.success('Photo convertie avec succès !');
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Erreur lors de la conversion. Veuillez réessayer.');
      toast.error('Erreur lors de la conversion');
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  };

  const handleDownload = () => {
    if (convertedBlob) {
      downloadConvertedPhoto(convertedBlob);
      toast.success('Photo téléchargée !');
    }
  };

  const handleReset = () => {
    // Revoke old URLs to prevent memory leaks
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    if (convertedImage) {
      URL.revokeObjectURL(convertedImage);
    }
    
    setOriginalImage(null);
    setOriginalFile(null);
    setConvertedImage(null);
    setConvertedBlob(null);
    setError(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProgressLabel = () => {
    if (!progress) return '';
    switch (progress.stage) {
      case 'loading':
        return 'Chargement de l\'image...';
      case 'downloading-model':
        return 'Téléchargement du modèle IA (1ère fois)...';
      case 'removing-bg':
        return 'Suppression du fond par IA...';
      case 'processing':
        return 'Traitement en cours...';
      case 'resizing':
        return 'Redimensionnement 200x200...';
      case 'complete':
        return 'Terminé !';
      default:
        return 'Traitement...';
    }
  };

  return (
    <ResponsiveLayout>
      <SEOHead
        title="Photo Nusuk Hajj - Convertisseur Format 200x200"
        description="Outil gratuit pour convertir votre photo d'identité au format officiel Nusuk pour le Hajj et l'Omra. Redimensionnement 200x200 pixels avec recadrage automatique."
        keywords="nusuk, hajj, photo, identité, 200x200, visa, omra, pèlerinage, format photo"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Convertisseur Photo Nusuk Hajj
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Préparez votre photo d'identité au format officiel requis pour le portail Nusuk (Hajj/Omra).
            Notre outil recadre et redimensionne automatiquement votre photo au format 200×200 pixels.
          </p>
        </div>

        {/* Specifications */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription className="flex flex-wrap gap-4">
            <span><strong>Format requis :</strong> 200 × 200 pixels</span>
            <span><strong>Recadrage :</strong> Carré centré</span>
            <span><strong>Fichiers acceptés :</strong> JPG, PNG, WebP (max 10 Mo)</span>
          </AlertDescription>
        </Alert>

        {/* Important Notice */}
        <Alert className="mb-6 border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Nouveau :</strong> Notre IA supprime automatiquement le fond de votre photo et le remplace par un fond blanc !
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo originale
              </CardTitle>
              <CardDescription>
                Téléversez votre photo d'identité
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!originalImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors duration-200
                    ${dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez votre photo ici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={originalImage}
                    alt="Photo originale"
                    className="w-full h-auto rounded-lg max-h-64 object-contain mx-auto"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleReset}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Résultat (200×200)
              </CardTitle>
              <CardDescription>
                Photo au format Nusuk
              </CardDescription>
            </CardHeader>
            <CardContent>
              {convertedImage ? (
                <div className="flex flex-col items-center">
                  <div className="w-[200px] h-[200px] border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-white">
                    <img
                      src={convertedImage}
                      alt="Photo convertie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Aperçu taille réelle : 200×200 pixels
                  </p>
                </div>
              ) : (
                <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/20">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    {isConverting 
                      ? 'Conversion en cours...' 
                      : 'La photo convertie apparaîtra ici'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {isConverting && progress && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{getProgressLabel()}</span>
                  <span>{progress.progress}%</span>
                </div>
                <Progress value={progress.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            onClick={handleConvert}
            disabled={!originalFile || isConverting}
            className="min-w-[200px]"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conversion...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Convertir
              </>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleDownload}
            disabled={!convertedBlob}
            className="min-w-[200px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conseils pour une photo conforme</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Utilisez une photo récente de face, expression neutre</li>
              <li>Privilégiez un fond clair ou blanc pour un meilleur résultat</li>
              <li>Assurez-vous que votre visage est bien visible et centré</li>
              <li>Retirez les accessoires (lunettes de soleil, chapeau) sauf si requis</li>
              <li>Évitez les photos floues ou mal éclairées</li>
              <li>La photo sera automatiquement recadrée au centre en format carré</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default PhotoNusukHajj;
