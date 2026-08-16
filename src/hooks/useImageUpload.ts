import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { compressImage } from '@/utils/imageCompression';

export interface ImageUploadResult {
  url: string;
  path: string;
}

export const useImageUpload = (bucketName: string = 'ad-images') => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = ''): Promise<ImageUploadResult | null> => {
    try {
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return null;
      }

      // Validate file size (10MB avant compression)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La taille du fichier ne doit pas dépasser 10MB');
        return null;
      }

      // Compresser automatiquement l'image selon le contexte
      let processedFile = file;
      
      // Pour les blogs, compression plus agressive pour le SEO
      if (bucketName === 'blog-images') {
        toast.info('Compression de l\'image en cours...');
        processedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.85,
          maxSizeKB: 500 // Max 500KB pour les images de blog
        });
        
        const compressionRatio = ((file.size - processedFile.size) / file.size * 100).toFixed(1);
        console.log(`Image compressée: ${file.size} -> ${processedFile.size} bytes (${compressionRatio}% de réduction)`);
        
        if (compressionRatio !== '0.0') {
          toast.success(`Image optimisée: ${compressionRatio}% de réduction de taille`);
        }
      } else {
        // Pour les autres images (annonces), compression plus modérée
        if (file.size > 2 * 1024 * 1024) { // Si > 2MB
          toast.info('Optimisation de l\'image...');
          processedFile = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
            maxSizeKB: 1024 // Max 1MB pour les annonces
          });
          
          const compressionRatio = ((file.size - processedFile.size) / file.size * 100).toFixed(1);
          console.log(`Image optimisée: ${file.size} -> ${processedFile.size} bytes (${compressionRatio}% de réduction)`);
          
          if (compressionRatio !== '0.0') {
            toast.success(`Image optimisée: ${compressionRatio}% de réduction de taille`);
          }
        }
      }

      // Generate unique filename with correct extension
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      // Sécurité: chaque upload est isolé dans le dossier de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour envoyer une image');
        return null;
      }

      const filePath = folder
        ? `${folder}/${user.id}/${fileName}`
        : `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, processedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Erreur lors du téléchargement de l\'image');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};