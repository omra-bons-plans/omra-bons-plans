import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BlogImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const BlogImageUpload = ({ value, onChange, label = "Image de couverture" }: BlogImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const [useManualUrl, setUseManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      console.log('📤 Uploading blog image:', filePath);

      // Upload vers le bucket blog-images
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      // Générer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      console.log('✅ Blog image uploaded successfully:', publicUrl);

      onChange(publicUrl);
      toast.success('Image uploadée avec succès');
    } catch (error) {
      console.error('❌ Error uploading blog image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      uploadImage(file);
    }
  };

  const handleManualUrlSave = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      toast.success('URL mise à jour');
    }
  };

  const clearImage = () => {
    onChange('');
    setManualUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Image Preview */}
      {value && (
        <div className="relative">
          <img 
            src={value} 
            alt="Aperçu" 
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              console.log('❌ Blog image failed to load:', value);
              const target = e.target as HTMLImageElement;
              target.src = '/ad-placeholder.jpg';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearImage}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Upload Method Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={!useManualUrl ? "default" : "outline"}
          onClick={() => setUseManualUrl(false)}
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button
          type="button"
          variant={useManualUrl ? "default" : "outline"}
          onClick={() => setUseManualUrl(true)}
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          URL externe
        </Button>
      </div>

      {/* Upload Interface */}
      {!useManualUrl ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Sélectionner une image
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Formats acceptés: JPG, PNG, WebP. Taille max: 5MB
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleManualUrlSave}
            disabled={!manualUrl.trim()}
          >
            OK
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogImageUpload;