import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Play from 'lucide-react/dist/esm/icons/play';
import Maximize from 'lucide-react/dist/esm/icons/maximize';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

const VideoPlayer = ({ videoUrl, title = "Vidéo", className = "" }: VideoPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Détecter si c'est une vidéo en format 9:16 (YouTube Shorts)
  const isVerticalVideo = (url: string) => {
    return url.includes('youtube.com/shorts/');
  };

  // Convertir l'URL YouTube en format embed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    } else if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  // Obtenir la miniature YouTube
  const getThumbnail = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const thumbnail = getThumbnail(videoUrl);
  const isVertical = isVerticalVideo(videoUrl);

  return (
    <>
      {/* Preview avec bouton play */}
      <div className={`relative group cursor-pointer ${className}`}>
        <div 
          className="aspect-[9/16] sm:aspect-video bg-muted rounded-lg overflow-hidden relative"
          onClick={() => setIsOpen(true)}
        >
          {thumbnail && (
            <img 
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay avec bouton play */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <div className="flex flex-col items-center space-y-2 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <span className="text-sm font-medium">Voir la vidéo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal avec vidéo */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`w-full ${isVertical ? 'max-w-md sm:max-w-lg' : 'max-w-4xl'}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {title}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(videoUrl, '_blank')}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Maximize className="w-4 h-4" />
                <span className="text-xs">Ouvrir dans YouTube</span>
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className={`bg-black rounded-lg overflow-hidden ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoPlayer;