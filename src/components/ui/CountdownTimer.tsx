import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate, className = "" }: CountdownTimerProps) => {
  // Si aucune date n'est fournie, utiliser 24h à partir de maintenant
  const defaultTarget = new Date();
  defaultTarget.setHours(defaultTarget.getHours() + 24);
  
  const finalTarget = targetDate || defaultTarget;
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +finalTarget - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [finalTarget]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className={`glass p-4 rounded-2xl border border-border/30 ${className}`}>
        <div className="text-center">
          <span className="text-destructive font-bold text-lg">Vente terminée</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass p-4 rounded-2xl border border-border/30 shadow-medium ${className}`}>
      <div className="text-center mb-2">
        <span className="text-sm font-semibold text-muted-foreground">Se termine dans</span>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {timeLeft.days > 0 && (
          <>
            <div className="bg-gradient-primary rounded-lg px-3 py-2 min-w-[50px]">
              <div className="text-white font-bold text-lg leading-none">{formatNumber(timeLeft.days)}</div>
              <div className="text-white/80 text-xs font-medium">jours</div>
            </div>
            <span className="text-muted-foreground font-bold">:</span>
          </>
        )}
        
        <div className="bg-gradient-primary rounded-lg px-3 py-2 min-w-[50px] animate-pulse">
          <div className="text-white font-bold text-lg leading-none">{formatNumber(timeLeft.hours)}</div>
          <div className="text-white/80 text-xs font-medium">h</div>
        </div>
        
        <span className="text-muted-foreground font-bold animate-pulse">:</span>
        
        <div className="bg-gradient-primary rounded-lg px-3 py-2 min-w-[50px] animate-pulse">
          <div className="text-white font-bold text-lg leading-none">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-white/80 text-xs font-medium">min</div>
        </div>
        
        <span className="text-muted-foreground font-bold animate-pulse">:</span>
        
        <div className="bg-gradient-primary rounded-lg px-3 py-2 min-w-[50px] animate-pulse">
          <div className="text-white font-bold text-lg leading-none">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-white/80 text-xs font-medium">sec</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;