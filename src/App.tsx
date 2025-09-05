import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategorySelection from "./pages/publish/CategorySelection";
import FormulaSelection from "./pages/publish/FormulaSelection";
import SejourDetails from "./pages/publish/SejourDetails";
import VolDetails from "./pages/publish/VolDetails";
import GuideDetails from "./pages/publish/GuideDetails";
import PlaceholderDetails from "./pages/publish/PlaceholderDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/publish" element={<CategorySelection />} />
          <Route path="/publish/formula" element={<FormulaSelection />} />
          <Route path="/publish/sejours" element={<SejourDetails />} />
          <Route path="/publish/vols" element={<VolDetails />} />
          <Route path="/publish/guides" element={<GuideDetails />} />
          <Route path="/publish/placeholder" element={<PlaceholderDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
