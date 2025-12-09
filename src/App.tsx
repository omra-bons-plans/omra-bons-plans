import React, { lazy, Suspense } from 'react';
// App v2.1.0 - Security review completed
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ScrollToTop from "./components/ui/ScrollToTop";
import BackToTopButton from "./components/ui/BackToTopButton";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import CanonicalRedirect from "./components/SEO/CanonicalRedirect";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const MyAds = lazy(() => import("./pages/MyAds"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
const CategorySelection = lazy(() => import("./pages/publish/CategorySelection"));
const FormulaSelection = lazy(() => import("./pages/publish/FormulaSelection"));
const SejourDetails = lazy(() => import("./pages/publish/SejourDetails"));
const VolDetails = lazy(() => import("./pages/publish/VolDetails"));
const GuideDetails = lazy(() => import("./pages/publish/GuideDetails"));
const ChauffeurDetails = lazy(() => import("./pages/publish/ChauffeurDetails"));
const BabysittingDetails = lazy(() => import("./pages/publish/BabysittingDetails"));
const HebergementDetails = lazy(() => import("./pages/publish/HebergementDetails"));
const PlaceholderDetails = lazy(() => import("./pages/publish/PlaceholderDetails"));
const AdSummary = lazy(() => import("./pages/AdSummary"));
const AdDetails = lazy(() => import("./pages/AdDetails"));
const AdminAds = lazy(() => import("./pages/AdminAds"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrayerTimes = lazy(() => import("./pages/PrayerTimes"));
const IslamicCalendar = lazy(() => import("./pages/IslamicCalendar"));
const RamadanHajjDates = lazy(() => import("./pages/RamadanHajjDates"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AgencesListe = lazy(() => import("./pages/AgencesListe"));
const AgenceDetails = lazy(() => import("./pages/AgenceDetails"));
const ComparatifVisuel = lazy(() => import("./pages/ComparatifVisuel"));
const ComparatifAgences = lazy(() => import("./pages/ComparatifAgences"));
const Discussions = lazy(() => import("./pages/Discussions"));
const AdminTopicRequests = lazy(() => import("./pages/AdminTopicRequests"));
const AdminSecurityAudit = lazy(() => import("./pages/AdminSecurityAudit"));
const Search = lazy(() => import("./pages/Search"));
const ComparateurOmra = lazy(() => import("./pages/ComparateurOmra"));
const AdminScrapers = lazy(() => import("./pages/AdminScrapers"));
const AdminOmraOffers = lazy(() => import("./pages/AdminOmraOffers"));
const AdminOmraManagement = lazy(() => import("./pages/AdminOmraManagement"));
const Favoris = lazy(() => import("./pages/Favoris"));
const AdminAgencies = lazy(() => import("./pages/AdminAgencies"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <CanonicalRedirect>
                  <Routes>
                  <Route path="/" element={<ComparateurOmra />} />
                  <Route path="/bons-plans" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-ads" element={
                    <ProtectedRoute>
                      <MyAds />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish" element={
                    <ProtectedRoute>
                      <CategorySelection />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/formula" element={
                    <ProtectedRoute>
                      <FormulaSelection />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/sejours" element={
                    <ProtectedRoute>
                      <SejourDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/vols" element={
                    <ProtectedRoute>
                      <VolDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/guides" element={
                    <ProtectedRoute>
                      <GuideDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/chauffeurs" element={
                    <ProtectedRoute>
                      <ChauffeurDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/babysitting" element={
                    <ProtectedRoute>
                      <BabysittingDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/hebergement" element={
                    <ProtectedRoute>
                      <HebergementDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/publish/placeholder" element={
                    <ProtectedRoute>
                      <PlaceholderDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/ad-summary/:id" element={
                    <ProtectedRoute>
                      <AdSummary />
                    </ProtectedRoute>
                  } />
                  <Route path="/ad/:id" element={<AdDetails />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/profile/:slug" element={<PublicProfile />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:category" element={<Blog />} />
                  <Route path="/blog/:category/:slug" element={<BlogPost />} />
                  <Route path="/discussions" element={<Discussions />} />
                  <Route path="/admin/topic-requests" element={
                    <ProtectedRoute>
                      <AdminTopicRequests />
                    </ProtectedRoute>
                  } />
                   <Route path="/admin/security-audit" element={
                     <ProtectedRoute>
                       <AdminSecurityAudit />
                     </ProtectedRoute>
                   } />
                   <Route path="/admin/scrapers" element={
                     <ProtectedRoute>
                       <AdminScrapers />
                     </ProtectedRoute>
                   } />
                   <Route path="/admin/omra-offers" element={
                     <ProtectedRoute>
                       <AdminOmraOffers />
                     </ProtectedRoute>
                   } />
                   <Route path="/admin/omra-management" element={
                     <ProtectedRoute>
                       <AdminOmraManagement />
                     </ProtectedRoute>
                   } />
                   <Route path="/admin/agencies" element={
                     <ProtectedRoute>
                       <AdminAgencies />
                     </ProtectedRoute>
                   } />
                   <Route path="/admin/ads" element={
                    <ProtectedRoute>
                      <AdminAds />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blog" element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blog/new" element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blog/edit/:id" element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/prayer-times" element={<PrayerTimes />} />
                  <Route path="/islamic-calendar" element={<IslamicCalendar />} />
                  <Route path="/ramadan-hajj-dates" element={<RamadanHajjDates />} />
                  <Route path="/comparatif-agences" element={<ComparatifAgences />} />
                  <Route path="/agences-liste" element={<AgencesListe />} />
                  <Route path="/agence-details/:agencyName" element={<AgenceDetails />} />
                   <Route path="/comparatif-visuel" element={<ComparatifVisuel />} />
                   <Route path="/search" element={<Search />} />
                   <Route path="/favoris" element={<Favoris />} />
                   <Route path="/comparateur-omra" element={<Navigate to="/" replace />} />
                   
                   {/* Redirections vers les URLs françaises */}
                  <Route path="/a-propos" element={<Navigate to="/about" replace />} />
                  <Route path="/calendrier-islamique" element={<Navigate to="/islamic-calendar" replace />} />
                  <Route path="/dates-ramadan-hajj" element={<Navigate to="/ramadan-hajj-dates" replace />} />
                  <Route path="/horaires-prieres" element={<Navigate to="/prayer-times" replace />} />
                  
                  {/* Redirections des services vers les catégories */}
                  <Route path="/services/babysitting-omra" element={<Navigate to="/category/babysitting" replace />} />
                  <Route path="/services/guides-omra" element={<Navigate to="/category/guides" replace />} />
                  <Route path="/services/hebergement-omra" element={<Navigate to="/category/hebergement" replace />} />
                  <Route path="/services/sejours-omra" element={<Navigate to="/category/sejours" replace />} />
                  <Route path="/services/transport-omra" element={<Navigate to="/category/chauffeurs" replace />} />
                  <Route path="/services/vols-omra" element={<Navigate to="/category/vols" replace />} />
                  
                  {/* Redirections pour les anciennes URLs obsolètes */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/test" element={<Navigate to="/" replace />} />
                  <Route path="/checkout" element={<Navigate to="/" replace />} />
                  <Route path="/all-ads" element={<Navigate to="/" replace />} />
                  
                  {/* Anciennes archives de blog */}
                  <Route path="/2019" element={<Navigate to="/blog" replace />} />
                  <Route path="/2019/06" element={<Navigate to="/blog" replace />} />
                  <Route path="/2019/07" element={<Navigate to="/blog" replace />} />
                  
                  {/* Anciens articles de blog en anglais vers blog */}
                  <Route path="/competitive-analysis-for-entrepreneurs" element={<Navigate to="/blog" replace />} />
                  <Route path="/five-ways-to-create-your-classified-ad-that-will-stand-out" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-choose-best-laptops-under-30000-in-2018" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-create-listing-that-gets-traffic" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-do-market-research-for-to-sell-faster" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-explode-your-leads-with-local-search" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-leverage-contests-to-generate-thousands-of-leads-10" element={<Navigate to="/blog" replace />} />
                  <Route path="/how-to-place-an-ad-for-immigration-advertising" element={<Navigate to="/blog" replace />} />
                  <Route path="/increase-your-business-leads-with-classified-advertising" element={<Navigate to="/blog" replace />} />
                  <Route path="/three-powerful-tricks-for-online-classified-advertising" element={<Navigate to="/blog" replace />} />
                  <Route path="/use-the-right-partner-to-sell-your-products" element={<Navigate to="/blog" replace />} />
                  <Route path="/why-online-free-classified-sites-are-essential-for-marketing" element={<Navigate to="/blog" replace />} />
                  
                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                   <Route path="*" element={<NotFound />} />
                   </Routes>
                 </CanonicalRedirect>
               </Suspense>
               <BackToTopButton />
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;