import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import Products from "./pages/Products";
import Companies from "./pages/Companies";
import Jobs from "./pages/Jobs";
import Services from "./pages/Services";
import Ads from "./pages/Ads";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ThemeShowcase from "./pages/ThemeShowcase";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantProducts from "./pages/merchant/Products";
import NewProduct from "./pages/merchant/NewProduct";
import MerchantAnalytics from "./pages/merchant/Analytics";
import { SuperAdminRoute, MerchantRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./global.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/theme-showcase" element={<ThemeShowcase />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <SuperAdminRoute>
                <AdminDashboard />
              </SuperAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <SuperAdminRoute>
                <AdminSettings />
              </SuperAdminRoute>
            } />
            
            {/* Merchant Routes */}
            <Route path="/merchant/dashboard" element={
              <MerchantRoute>
                <MerchantDashboard />
              </MerchantRoute>
            } />
            <Route path="/merchant/products" element={
              <MerchantRoute>
                <MerchantProducts />
              </MerchantRoute>
            } />
            <Route path="/merchant/products/new" element={
              <MerchantRoute>
                <NewProduct />
              </MerchantRoute>
            } />
            <Route path="/merchant/analytics" element={
              <MerchantRoute>
                <MerchantAnalytics />
              </MerchantRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products" element={<Products />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ads" element={<Ads />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
