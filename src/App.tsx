import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { AuthRoutes } from "./pages/auth/AuthRoutes";
import Index from "./pages/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/buyer/*" element={<Index />} />
          <Route path="/farmer/*" element={<Index />} />
          <Route path="/admin/*" element={<Index />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

