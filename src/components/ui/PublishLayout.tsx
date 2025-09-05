import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";

interface PublishLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onClose?: () => void;
}

const PublishLayout = ({ 
  children, 
  currentStep, 
  totalSteps, 
  steps, 
  onClose 
}: PublishLayoutProps) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleClose}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">O</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">omrabonsplans.fr</span>
              <span className="text-lg font-bold text-foreground sm:hidden">OBP</span>
            </div>
            
            {/* Progress indicator - Hidden on mobile, shown on larger screens */}
            <div className="hidden md:flex items-center space-x-2 bg-accent/30 rounded-full px-4 py-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground text-sm sm:text-base"
              onClick={handleClose}
            >
              <span className="hidden sm:inline">✕ Fermer</span>
              <span className="sm:hidden">✕</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-6 sm:py-12 px-4 sm:px-6 pb-72">
        <div className="container mx-auto max-w-4xl">
          {children}
        </div>
      </main>
      
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />
    </div>
  );
};

export default PublishLayout;