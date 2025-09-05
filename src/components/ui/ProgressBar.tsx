import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressBar = ({ currentStep, totalSteps, steps }: ProgressBarProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/40 p-3 sm:p-4 z-40">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          
          <Progress value={progress} className="h-1.5 sm:h-2" />
          
          {/* Show steps only on larger screens */}
          <div className="hidden sm:flex justify-between text-xs">
            {steps.map((step, index) => (
              <span 
                key={index}
                className={`transition-colors ${
                  index + 1 <= currentStep 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
          
          {/* Show current step name on mobile */}
          <div className="sm:hidden text-center">
            <span className="text-xs font-medium text-primary">
              {steps[currentStep - 1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;