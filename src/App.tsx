import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import RentSettlement from "./pages/RentSettlement";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SellProperty from "./pages/SellProperty";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/rent-settlement" element={<RentSettlement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sell" element={<SellProperty />} />
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
