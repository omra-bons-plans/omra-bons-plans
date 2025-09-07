import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={scrollToTop}
        size="sm"
        className={cn(
          "rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-300 ease-in-out",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "border border-primary/20 backdrop-blur-sm",
          isVisible 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}
        aria-label="Retourner en haut de la page"
      >
        <ChevronUp className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default BackToTopButton;