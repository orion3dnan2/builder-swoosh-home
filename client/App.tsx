import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import Products from "./pages/Products";
import Store from "./pages/Store";
import Companies from "./pages/Companies";
import Company from "./pages/Company";
import Jobs from "./pages/Jobs";
import Services from "./pages/Services";
import Restaurants from "./pages/Restaurants";
import Restaurant from "./pages/Restaurant";
import Ads from "./pages/Ads";
import StoreDetails from "./pages/StoreDetails";
import StoreVisit from "./pages/StoreVisit";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ThemeShowcase from "./pages/ThemeShowcase";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import AdminStores from "./pages/admin/Stores";
import AdminUsers from "./pages/admin/Users";
import AdminAppearance from "./pages/admin/Appearance";
import AdminSystem from "./pages/admin/System";
import AdminContent from "./pages/admin/Content";
import AdminActivity from "./pages/admin/Activity";
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantProducts from "./pages/merchant/Products";
import NewProduct from "./pages/merchant/NewProduct";
import ClearDemoProducts from "./pages/ClearDemoProducts";
import ClearAllProducts from "./pages/ClearAllProducts";
import MerchantAnalytics from "./pages/merchant/Analytics";
import MerchantOrders from "./pages/merchant/Orders";
import MerchantSettings from "./pages/merchant/Settings";
import Profile from "./pages/Profile";
import DebugProducts from "./pages/DebugProducts";
import AddSampleProducts from "./pages/AddSampleProducts";
import PWAInfo from "./pages/PWAInfo";
import { SuperAdminRoute, MerchantRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { TextCleaner } from "./components/SafeText";
import { SafeToaster as Toaster } from "./components/ui/safe-toaster";
import { PWAManager } from "./components/PWAManager";
import "./global.css";

function App() {
  return (
    <PWAManager>
      <ThemeProvider>
        <AuthProvider>
          <TextCleaner>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/theme-showcase" element={<ThemeShowcase />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <SuperAdminRoute>
                      <AdminDashboard />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <SuperAdminRoute>
                      <AdminSettings />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/stores"
                  element={
                    <SuperAdminRoute>
                      <AdminStores />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <SuperAdminRoute>
                      <AdminUsers />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/appearance"
                  element={
                    <SuperAdminRoute>
                      <AdminAppearance />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/system"
                  element={
                    <SuperAdminRoute>
                      <AdminSystem />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <SuperAdminRoute>
                      <AdminContent />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admin/activity"
                  element={
                    <SuperAdminRoute>
                      <AdminActivity />
                    </SuperAdminRoute>
                  }
                />

                {/* Merchant Routes */}
                <Route
                  path="/merchant/dashboard"
                  element={
                    <MerchantRoute>
                      <MerchantDashboard />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/products"
                  element={
                    <MerchantRoute>
                      <MerchantProducts />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/products/new"
                  element={
                    <MerchantRoute>
                      <NewProduct />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/products/:id/edit"
                  element={
                    <MerchantRoute>
                      <NewProduct />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/analytics"
                  element={
                    <MerchantRoute>
                      <MerchantAnalytics />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/orders"
                  element={
                    <MerchantRoute>
                      <MerchantOrders />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/settings"
                  element={
                    <MerchantRoute>
                      <MerchantSettings />
                    </MerchantRoute>
                  }
                />

                {/* Public Routes */}
                <Route
                  path="/clear-demo-products"
                  element={<ClearDemoProducts />}
                />
                <Route
                  path="/clear-all-products"
                  element={<ClearAllProducts />}
                />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/products" element={<Products />} />
                <Route path="/store/:id" element={<Store />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/company/:id" element={<Company />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pwa" element={<PWAInfo />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/ads" element={<Ads />} />
                <Route path="/store/:id" element={<StoreDetails />} />
                <Route path="/store/:id/visit" element={<StoreVisit />} />
                <Route path="/debug/products/:id" element={<DebugProducts />} />
                <Route
                  path="/admin/add-sample-products"
                  element={<AddSampleProducts />}
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </TextCleaner>
        </AuthProvider>
      </ThemeProvider>
    </PWAManager>
  );
}

export default App;
