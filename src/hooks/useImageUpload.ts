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

      // Validate file type (inclure HEIC pour iPhone)
      const isImage = file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic');
      if (!isImage) {
        toast.error('Veuillez sélectionner un fichier image');
        return null;
      }

      // Validate file size (10MB avant compression)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La taille du fichier ne doit pas dépasser 10MB');
        return null;
      }

      const originalSizeKB = file.size / 1024;
      console.log(`📤 Upload de ${file.name} (${originalSizeKB.toFixed(1)}KB)`);

      // Compresser SYSTÉMATIQUEMENT toutes les images avec paramètres ultra-agressifs
      let processedFile = file;
      toast.info('🗜️ Optimisation de l\'image...');
      
      // Détection HEIC (photos iPhone)
      if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
        console.log('📱 Photo iPhone HEIC détectée, conversion en cours...');
        toast.info('Conversion de la photo iPhone...');
        // Note: Pour une vraie conversion HEIC, il faudrait une lib externe
        // Pour l'instant on laisse passer et la compression gérera
      }
      
      // Définir les paramètres selon le contexte et le type d'image
      const isCover = folder.includes('cover') || folder === '';
      
      if (bucketName === 'blog-images') {
        // Blog: compression ULTRA-AGRESSIVE pour SEO
        processedFile = await compressImage(file, {
          maxWidth: isCover ? 1200 : 800,
          maxHeight: isCover ? 800 : 600,
          quality: 0.7,
          maxSizeKB: isCover ? 100 : 80, // 100KB max pour couvertures, 80KB pour autres
          format: 'auto' // AVIF prioritaire
        });
      } else {
        // Annonces: compression agressive mais moins drastique
        processedFile = await compressImage(file, {
          maxWidth: isCover ? 1400 : 1000,
          maxHeight: isCover ? 900 : 750,
          quality: 0.7,
          maxSizeKB: isCover ? 150 : 120, // 150KB max pour couvertures, 120KB pour supplémentaires
          format: 'auto' // AVIF prioritaire
        });
      }
      
      const newSizeKB = processedFile.size / 1024;
      const compressionRatio = ((originalSizeKB - newSizeKB) / originalSizeKB * 100).toFixed(1);
      
      console.log(`✅ Optimisation: ${originalSizeKB.toFixed(1)}KB → ${newSizeKB.toFixed(1)}KB (-${compressionRatio}%)`);
      
      if (parseFloat(compressionRatio) > 5) {
        toast.success(`✨ Image optimisée: -${compressionRatio}% (${newSizeKB.toFixed(0)}KB)`);
      }
      
      // Alerter si l'image est encore trop grosse
      if (newSizeKB > 200) {
        console.warn(`⚠️ Image encore volumineuse: ${newSizeKB.toFixed(1)}KB`);
        toast.warning(`Image volumineuse (${newSizeKB.toFixed(0)}KB), considérez une résolution inférieure`);
      }

      // Generate unique filename with correct extension
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

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