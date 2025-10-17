import { useAntiScraping } from '@/hooks/useAntiScraping';

const AntiScrapingMonitor = () => {
  useAntiScraping({ enabled: true });
  return null;
};

export default AntiScrapingMonitor;
