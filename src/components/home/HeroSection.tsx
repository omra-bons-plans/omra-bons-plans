import { memo } from 'react';

/**
 * ⚡ OPTIMIZED HERO SECTION - Critical for LCP
 * - Static render (no useState/useEffect)
 * - AVIF with JPG fallback
 * - Explicit dimensions for CLS prevention
 * - fetchPriority="high" for browser prioritization
 */

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection = memo(({ isMobile }: HeroSectionProps) => {
  return (
    <section 
      className="hero-wrapper relative" 
      style={{ 
        minHeight: isMobile ? '100vh' : '350px', 
        maxHeight: isMobile ? undefined : '400px',
        marginTop: 0,
        paddingTop: 0
      }}
    >
      {/* ⚡ CRITICAL: Single compressed hero image for all devices */}
      <div className="hero-media" style={{ minHeight: isMobile ? '100vh' : '350px' }}>
        <img
          src="/hero-kaaba-optimized.webp"
          alt="Comparateur Omra 2026 & Hajj 2026 - Omra Ramadan et 10 derniers jours du Ramadan"
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'absolute',
            inset: 0
          }}
        />
      </div>
      
      {/* Overlay with hero content */}
      <div className="hero-overlay">
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center justify-center text-center pt-2 pb-8 md:pt-20 md:pb-12">
            <div className="space-y-6 md:space-y-10 w-full px-2">
              <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold leading-tight">
                <span className="text-white text-3xl md:text-5xl lg:text-7xl xl:text-8xl">Comparateur</span><br />
                <span className="gradient-text-secondary font-black text-5xl md:text-7xl lg:text-9xl xl:text-[10rem]">Omra & Hajj 2026</span><br />
                <span className="text-white text-3xl md:text-5xl lg:text-7xl xl:text-8xl">Omra Ramadan & Plus</span>
              </h1>
              
              <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed md:max-w-6xl mx-auto font-medium">
                <span className="text-white">Comparez les offres Omra 2026, Hajj 2026, Omra Ramadan et les 10 derniers jours du Ramadan depuis la France</span>
              </p>

              {/* WhatsApp Button */}
              <div className="mt-6 md:mt-8 max-w-[300px] md:max-w-[320px] mx-auto px-2">
                <a
                  href="https://whatsapp.com/channel/0029VaFFu5P5PO18w7fmTB0M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 md:space-x-3 w-full min-h-[48px]"
                >
                  <div className="relative z-10">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
                    </svg>
                  </div>
                  
                  <div className="relative z-10 flex-1 text-center">
                    <div className="text-xs md:text-sm font-bold leading-tight">Rejoignez la communauté</div>
                    <div className="text-xs md:text-sm font-bold leading-tight">Omra Bons Plans</div>
                  </div>
                </a>
                
                <div className="text-center mt-2 md:mt-3">
                  <p className="text-white/80 text-xs md:text-sm">
                    🔥 +5000 membres pour des bons plans exclusifs !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
