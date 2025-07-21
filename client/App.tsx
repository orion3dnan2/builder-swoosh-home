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
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantProducts from "./pages/merchant/Products";
import NewProduct from "./pages/merchant/NewProduct";
import MerchantAnalytics from "./pages/merchant/Analytics";
import { SuperAdminRoute, MerchantRoute } from "./components/ProtectedRoute";
import "./global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
                <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <SuperAdminRoute>
            <AdminDashboard />
          </SuperAdminRoute>
        } />

        {/* Merchant Routes */}
        <Route path="/merchant/dashboard" element={
          <MerchantRoute>
            <MerchantDashboard />
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
  );
}

export default App;
