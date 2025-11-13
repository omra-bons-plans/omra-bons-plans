import React, { useState, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useTopics } from '@/hooks/useTopics';
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { SEOHead } from "@/components/SEO/SEOHead";
import FeedbackForm from "@/components/ui/FeedbackForm";
import { HeroSection } from "@/components/home/HeroSection";

// Lazy load sections non-critiques
const FlashSalesSection = lazy(() => import("@/components/home/FlashSalesSection").then(m => ({ default: m.FlashSalesSection })));
const AllServicesSection = lazy(() => import("@/components/home/AllServicesSection").then(m => ({ default: m.AllServicesSection })));
const ForumSection = lazy(() => import("@/components/home/ForumSection").then(m => ({ default: m.ForumSection })));

// Loading fallback minimal
const SectionLoader = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Force rebuild - 2025-01-13 18:50
const IndexOptimized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Limite réduite pour mobile
  const adsLimit = isMobile ? 6 : 15;
  const { formattedListings, loading, hasMore, loadMore } = useAds(adsLimit, 0);
  const { topics } = useTopics();

  const handleSearch = () => {
    navigate('/search', {
      state: {
        searchQuery,
        selectedCity,
        selectedCategory: selectedCategory !== 'all' ? selectedCategory : undefined
      }
    });
  };

  return (
    <>
      <SEOHead
        title="Omra Bons Plans - Comparateur de services pour votre Omra"
        description="Trouvez et comparez les meilleurs séjours, vols, guides et services pour votre Omra. Prix transparents, avis vérifiés."
        canonical="https://omrabonsplans.fr"
      />

      <ResponsiveLayout>
        <div className="min-h-screen bg-background">
          {/* Hero - Critical, chargé immédiatement */}
          <HeroSection
            searchQuery={searchQuery}
            selectedCity={selectedCity}
            onSearchChange={setSearchQuery}
            onCityChange={setSelectedCity}
            onSearch={handleSearch}
          />

          {/* Content Container */}
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Flash Sales - Lazy loaded */}
            <Suspense fallback={<SectionLoader />}>
              <FlashSalesSection
                listings={formattedListings}
                isMobile={isMobile}
                viewMode={viewMode}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </Suspense>

            {/* All Services - Lazy loaded */}
            <Suspense fallback={<SectionLoader />}>
              <AllServicesSection
                listings={formattedListings}
                isMobile={isMobile}
                viewMode={viewMode}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onViewModeChange={setViewMode}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
              />
            </Suspense>

            {/* Forum - Lazy loaded */}
            <Suspense fallback={<SectionLoader />}>
              <ForumSection
                topics={topics}
                selectedTopicId={selectedTopicId}
                onTopicSelect={setSelectedTopicId}
              />
            </Suspense>

            {/* Feedback Form - Lazy loaded */}
            <Suspense fallback={null}>
              <div className="mt-12">
                <FeedbackForm />
              </div>
            </Suspense>
          </div>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default IndexOptimized;
