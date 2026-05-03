import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import Behavior from "./pages/dashboard/Behavior";
import Growth from "./pages/dashboard/Growth";
import Alerts from "./pages/dashboard/Alerts";
import AdminOverview from "./pages/admin/AdminOverview";
import Sensors from "./pages/admin/Sensors";
import Ponds from "./pages/admin/Ponds";
import GrowthAdmin from "./pages/admin/GrowthAdmin";
import AlertHistory from "./pages/admin/AlertHistory";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/behavior" element={<ProtectedRoute><Behavior /></ProtectedRoute>} />
            <Route path="/dashboard/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
            <Route path="/dashboard/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminOverview /></ProtectedRoute>} />
            <Route path="/admin/sensors" element={<ProtectedRoute adminOnly><Sensors /></ProtectedRoute>} />
            <Route path="/admin/ponds" element={<ProtectedRoute adminOnly><Ponds /></ProtectedRoute>} />
            <Route path="/admin/growth" element={<ProtectedRoute adminOnly><GrowthAdmin /></ProtectedRoute>} />
            <Route path="/admin/alerts" element={<ProtectedRoute adminOnly><AlertHistory /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Toaster>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
