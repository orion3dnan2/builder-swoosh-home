export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  permissions: Permission[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export type UserRole = "super_admin" | "merchant" | "customer";

export interface UserProfile {
  name: string;
  phone?: string;
  avatar?: string;
  language: "ar" | "en";
  address?: Address;
  businessInfo?: BusinessInfo;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  taxId?: string;
  description: string;
  logo?: string;
  coverImage?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface Store {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  category: string;
  status: "active" | "inactive" | "pending" | "suspended";
  settings: StoreSettings;
  analytics: StoreAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    layout: "grid" | "list";
  };
  notifications: {
    newOrders: boolean;
    lowStock: boolean;
    reviews: boolean;
  };
  shipping: {
    freeShippingThreshold?: number;
    shippingRates: ShippingRate[];
  };
}

export interface ShippingRate {
  zone: string;
  rate: number;
  estimatedDays: number;
}

export interface StoreAnalytics {
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  views: number;
  orders: number;
  revenue: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: {
    quantity: number;
    sku: string;
    lowStockThreshold: number;
  };
  specifications?: Record<string, string>;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AppSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: "modern" | "classic" | "minimal";
  };
  branding: {
    appName: string;
    logo: string;
    favicon: string;
    heroBackground: string;
    tagline: string;
  };
  features: {
    enableMarketplace: boolean;
    enableProducts: boolean;
    enableCompanies: boolean;
    enableJobs: boolean;
    enableServices: boolean;
    enableAds: boolean;
    enableReviews: boolean;
    enableChat: boolean;
  };
  navigation: {
    visibleSections: string[];
    customOrder: string[];
  };
  localization: {
    defaultLanguage: "ar" | "en";
    supportedLanguages: string[];
    rtlSupport: boolean;
  };
  policies: {
    termsOfService: string;
    privacyPolicy: string;
    refundPolicy: string;
  };
}
