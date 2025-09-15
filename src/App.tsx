import React from 'react';
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
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyAds from "./pages/MyAds";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import CategorySelection from "./pages/publish/CategorySelection";
import FormulaSelection from "./pages/publish/FormulaSelection";
import SejourDetails from "./pages/publish/SejourDetails";
import VolDetails from "./pages/publish/VolDetails";
import GuideDetails from "./pages/publish/GuideDetails";
import ChauffeurDetails from "./pages/publish/ChauffeurDetails";
import BabysittingDetails from "./pages/publish/BabysittingDetails";
import HebergementDetails from "./pages/publish/HebergementDetails";
import PlaceholderDetails from "./pages/publish/PlaceholderDetails";
import AdSummary from "./pages/AdSummary";
import AdDetails from "./pages/AdDetails";
import AdminAds from "./pages/AdminAds";
import AdminBlog from "./pages/AdminBlog";
import BlogEditor from "./pages/BlogEditor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PublicProfile from "./pages/PublicProfile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrayerTimes from "./pages/PrayerTimes";
import IslamicCalendar from "./pages/IslamicCalendar";
import RamadanHajjDates from "./pages/RamadanHajjDates";
import CategoryPage from "./pages/CategoryPage";
import AgencesListe from "./pages/AgencesListe";
import AgenceDetails from "./pages/AgenceDetails";
import ComparatifVisuel from "./pages/ComparatifVisuel";
import ComparatifAgences from "./pages/ComparatifAgences";
import Discussions from "./pages/Discussions";
import AdminTopicRequests from "./pages/AdminTopicRequests";

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
              <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="/blog/:category/:id" element={<BlogPost />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/admin/topic-requests" element={
              <ProtectedRoute>
                <AdminTopicRequests />
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
            
            {/* Redirections vers les URLs françaises */}
            <Route path="/a-propos" element={<About />} />
            <Route path="/calendrier-islamique" element={<IslamicCalendar />} />
            <Route path="/dates-ramadan-hajj" element={<RamadanHajjDates />} />
            <Route path="/horaires-prieres" element={<PrayerTimes />} />
            
            {/* Routes des services */}
            <Route path="/services/babysitting-omra" element={<CategoryPage />} />
            <Route path="/services/guides-omra" element={<CategoryPage />} />
            <Route path="/services/hebergement-omra" element={<CategoryPage />} />
            <Route path="/services/sejours-omra" element={<CategoryPage />} />
            <Route path="/services/transport-omra" element={<CategoryPage />} />
            <Route path="/services/vols-omra" element={<CategoryPage />} />
            
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
              <BackToTopButton />
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
