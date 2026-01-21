// ⚡ PERFORMANCE: Ultra-light shell for instant LCP - no heavy dependencies
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { OptimizedHeroImage } from '@/components/ui/OptimizedHeroImage';
import ResponsiveLayout from '@/components/ResponsiveLayout';

// Static hero section - no data fetching
const HeroSection = () => (
  <section className="relative min-h-[40vh] md:min-h-[50vh] w-full overflow-hidden">
    <OptimizedHeroImage />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
        Comparez les meilleures offres Omra 2025
      </h1>
      <p className="text-lg md:text-xl text-white/90 max-w-2xl">
        Trouvez votre voyage spirituel idéal parmi nos agences partenaires
      </p>
    </div>
  </section>
);

// Static skeleton filters
const FiltersSkeleton = () => (
  <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg mb-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-10 rounded-lg" />
      ))}
    </div>
    <div className="mt-4 flex gap-2">
      <Skeleton className="h-9 w-24 rounded-lg" />
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
  </div>
);

// Static skeleton offer cards
const OffersSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="p-4">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-20 ml-auto" />
            <Skeleton className="h-8 w-24 ml-auto rounded-lg" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default function ComparateurOmraShell() {
  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <FiltersSkeleton />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
          <OffersSkeleton />
        </main>
      </div>
    </ResponsiveLayout>
  );
}
