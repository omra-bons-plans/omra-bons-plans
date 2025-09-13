import { useEffect } from 'react';

/**
 * Component to inject critical CSS for above-the-fold content
 */
export const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical CSS for initial render performance
    const criticalCSS = `
      /* Critical styles for hero section */
      .hero-overlay {
        background: linear-gradient(135deg, 
          hsl(var(--primary) / 0.9) 0%, 
          hsl(var(--primary) / 0.7) 50%, 
          hsl(var(--secondary) / 0.8) 100%);
      }
      
      .gradient-text-secondary {
        background: linear-gradient(135deg, 
          hsl(var(--secondary)) 0%, 
          hsl(var(--accent)) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .glass-strong {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      .islamic-pattern-modern {
        background-image: radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, hsl(var(--secondary) / 0.1) 0%, transparent 50%);
      }
      
      .float {
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      .btn-modern {
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-variant)) 100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .btn-modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px hsl(var(--primary) / 0.3);
      }
      
      /* Font display optimization */
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;

    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = criticalCSS;
    document.head.appendChild(style);

    return () => {
      // Cleanup critical CSS if component unmounts
      const criticalStyle = document.querySelector('style[data-critical="true"]');
      if (criticalStyle) {
        criticalStyle.remove();
      }
    };
  }, []);

  return null;
};

export default CriticalCSS;