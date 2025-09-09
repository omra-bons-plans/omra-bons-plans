import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from './button';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AdHeaderProps {
  title: string;
  description: string;
}

export const AdHeader = ({ title, description }: AdHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const fromCategory = location.state?.fromCategory;
    const fromAdmin = location.state?.fromAdmin;
    if (fromAdmin) {
      navigate('/admin/ads');
    } else if (fromCategory) {
      navigate(`/category/${fromCategory}`);
    } else {
      navigate('/');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/20 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-12 w-12 rounded-full hover:bg-muted/80"
            aria-label="Retour"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex-1 text-center px-4">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-12 w-12 rounded-full hover:bg-muted/80"
            aria-label="Partager"
          >
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};