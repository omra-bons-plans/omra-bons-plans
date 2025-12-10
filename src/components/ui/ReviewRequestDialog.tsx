import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, X } from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CQzTthDA4fm6EBM/review';
const STORAGE_KEY = 'review_request_shown_count';
const MAX_SHOWS = 3; // Ne pas afficher plus de 3 fois

interface ReviewRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  offerUrl: string;
}

export const ReviewRequestDialog = ({ isOpen, onClose, onContinue, offerUrl }: ReviewRequestDialogProps) => {
  const handleContinue = () => {
    onContinue();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>Ce site vous a plu ?</span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Merci d'utiliser notre comparateur ! Si ce site vous a aidé à trouver votre Omra, 
            laissez-nous 5 étoiles pour nous aider à être encore plus visibles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className="h-8 w-8 fill-yellow-400 text-yellow-400 mx-0.5" 
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold"
          >
            <a 
              href={GOOGLE_REVIEW_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <Star className="h-4 w-4 mr-2 fill-white" />
              Laisser un avis Google
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleContinue}
            className="w-full"
          >
            Continuer vers l'offre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook pour gérer la logique d'affichage de la popup
export const useReviewRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingOfferUrl, setPendingOfferUrl] = useState<string | null>(null);

  const shouldShowDialog = (): boolean => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    return count < MAX_SHOWS;
  };

  const incrementShowCount = () => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    localStorage.setItem(STORAGE_KEY, String(count + 1));
  };

  const handleOfferClick = (e: React.MouseEvent, offerUrl: string) => {
    if (shouldShowDialog()) {
      e.preventDefault();
      setPendingOfferUrl(offerUrl);
      setIsDialogOpen(true);
      incrementShowCount();
    }
    // Si on a déjà montré MAX_SHOWS fois, laisser le lien fonctionner normalement
  };

  const handleContinue = () => {
    if (pendingOfferUrl) {
      window.open(pendingOfferUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setPendingOfferUrl(null);
  };

  return {
    isDialogOpen,
    pendingOfferUrl,
    handleOfferClick,
    handleContinue,
    handleClose,
  };
};
