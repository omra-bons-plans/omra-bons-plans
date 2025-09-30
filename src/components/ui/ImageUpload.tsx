import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import UniversalImage from './UniversalImage';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  bucketName?: string;
  firstImageLabel?: string;
}

export const ImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  className = '',
  bucketName = 'ad-images',
  firstImageLabel = 'Image principale'
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, uploading } = useImageUpload(bucketName);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s)`);
    }

    const newImages: string[] = [];

    for (const file of filesToUpload) {
      const folder = bucketName === 'blog-images' ? 'blog' : 'ads';
      const result = await uploadImage(file, folder);
      if (result) {
        newImages.push(result.url);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) ajoutée(s)`);
    }

    // Reset input
    event.target.value = '';
  };

  const handleRemoveImage = async (index: number) => {
    setDeletingIndex(index);
    
    try {
      const imageUrl = images[index];
      // Extract path from URL for deletion
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === bucketName);
      const path = urlParts.slice(bucketIndex + 1).join('/');
      
      await deleteImage(path);
      
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Image supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || images.length >= maxImages}
        className="w-full h-20 border-dashed"
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-6 h-6" />
            <span className="text-sm">
              Ajouter des images ({images.length}/{maxImages})
            </span>
          </div>
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <UniversalImage
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  optimize={{ width: 400, height: 300, quality: 70 }}
                />
                
                {/* Overlay with delete button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    disabled={deletingIndex === index}
                    className="flex items-center space-x-1"
                  >
                    {deletingIndex === index ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span className="text-xs">Supprimer</span>
                  </Button>
                </div>

                {/* First image indicator */}
                {index === 0 && firstImageLabel && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {firstImageLabel}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <Card className="p-8 text-center border-dashed">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Aucune image ajoutée. Cliquez sur le bouton ci-dessus pour ajouter des images.
          </p>
        </Card>
      )}
    </div>
  );
};