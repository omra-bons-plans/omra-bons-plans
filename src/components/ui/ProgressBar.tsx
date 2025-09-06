import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressBar = ({ currentStep, totalSteps, steps }: ProgressBarProps) => {
  // Don't show 100% until actually completed - show progress based on steps
  const progress = Math.min(((currentStep - 1) / totalSteps) * 100, 85);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/40 p-2 z-40">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Étape {currentStep} sur {totalSteps}</span>
          <Progress value={progress} className="h-1 flex-1 mx-4" />
          <span>{Math.round(progress)}% complété</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;