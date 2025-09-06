import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ScrollToTop from "./components/ui/ScrollToTop";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/admin/ads" element={
              <ProtectedRoute>
                <AdminAds />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
