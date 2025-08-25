import { apiConfigManager } from "./apiConfig";

// خدمة API موحدة للويب والجوال
export class ApiService {
  private static baseURL = import.meta.env.VITE_API_URL || "/api";
  private static platform = "web"; // سيتم تغييرها في التطبيق الجوال
  private static useExternalConfig = false;

  // تعيين منصة التطبيق
  static setPlatform(platform: "web" | "mobile") {
    this.platform = platform;
  }

  // تفعيل/إلغاء استخدام الإعدادات الخارجية
  static setUseExternalConfig(useExternal: boolean) {
    this.useExternalConfig = useExternal;
  }

  // الحصول على رابط الخادم الحالي
  private static getBaseURL(): string {
    if (this.useExternalConfig) {
      const activeConfig = apiConfigManager.getActiveConfig();
      if (activeConfig && activeConfig.isActive) {
        return activeConfig.baseUrl;
      }
    }
    return this.baseURL;
  }

  // الحصول على رابط نقطة النهاية
  private static getEndpointURL(endpoint: string): string {
    const baseUrl = this.getBaseURL();

    if (this.useExternalConfig) {
      const activeConfig = apiConfigManager.getActiveConfig();
      if (activeConfig && activeConfig.endpoints) {
        // Check if we have a custom endpoint mapping
        const endpointMapping: Record<string, string> = {
          "/auth/login": activeConfig.endpoints.auth + "/login",
          "/auth/register": activeConfig.endpoints.auth + "/register",
          "/auth/logout": activeConfig.endpoints.auth + "/logout",
          "/auth/me": activeConfig.endpoints.auth + "/me",
          "/users": activeConfig.endpoints.users || "/users",
          "/stores": activeConfig.endpoints.stores || "/stores",
          "/products": activeConfig.endpoints.products || "/products",
          "/companies": activeConfig.endpoints.companies || "/companies",
          "/jobs": activeConfig.endpoints.jobs || "/jobs",
          "/orders": activeConfig.endpoints.orders || "/orders",
          "/analytics": activeConfig.endpoints.analytics || "/analytics",
        };

        // Find matching endpoint
        for (const [pattern, customEndpoint] of Object.entries(
          endpointMapping,
        )) {
          if (endpoint.startsWith(pattern)) {
            return `${baseUrl}${customEndpoint}${endpoint.substring(pattern.length)}`;
          }
        }
      }
    }

    return `${baseUrl}${endpoint}`;
  }

  // الحصول على العناوين الافتراضية
  private static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Platform": this.platform,
    };

    // إضافة عناوين مخصصة من إعدادات الخادم الخارجي
    if (this.useExternalConfig) {
      const activeConfig = apiConfigManager.getActiveConfig();
      if (activeConfig && activeConfig.headers) {
        Object.assign(headers, activeConfig.headers);
      }

      // إضافة المصادقة المخصصة
      if (activeConfig && activeConfig.authentication && includeAuth) {
        switch (activeConfig.authentication.type) {
          case "apikey":
            if (
              activeConfig.authentication.apiKeyHeader &&
              activeConfig.authentication.apiKeyValue
            ) {
              headers[activeConfig.authentication.apiKeyHeader] =
                activeConfig.authentication.apiKeyValue;
            }
            break;
          case "bearer":
            const token = this.getToken();
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            break;
          case "basic":
            // يمكن إضافة دعم المصادقة الأساسية هنا
            break;
        }
      }
    } else {
      // المصادقة الافتراضية
      if (includeAuth) {
        const token = this.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }

    return headers;
  }

  // إدارة الرموز المميزة
  static setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    // في React Native استخدم AsyncStorage
    // await AsyncStorage.setItem('auth_token', token);
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
    // في React Native:
    // return await AsyncStorage.getItem('auth_token');
  }

  static removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    // في React Native:
    // await AsyncStorage.removeItem('auth_token');
  }

  // طلب HTTP عام
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = this.getEndpointURL(endpoint);

    // الحصول على إعدادات المهلة الزمنية من الإعدادات الخارجية
    let timeout = 10000; // الافتراضي 10 ثواني
    if (this.useExternalConfig) {
      const activeConfig = apiConfigManager.getActiveConfig();
      if (activeConfig && activeConfig.timeout) {
        timeout = activeConfig.timeout;
      }
    }

    // إضافة timeout للطلب
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      console.log("🌐 Making API request:", {
        method: config.method || 'GET',
        url,
        headers: config.headers,
        bodySize: config.body ? config.body.toString().length : 0
      });

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      console.log("📡 API response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorData: any = {};
        let errorText = '';

        try {
          // Try to get response as text first
          errorText = await response.text();
          console.log("Raw error response:", errorText);

          // Try to parse as JSON
          if (errorText) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = { error: errorText || `HTTP ${response.status}` };
        }

        console.error("API Request failed:", {
          status: response.status,
          statusText: response.statusText,
          url,
          rawResponse: errorText,
          errorData,
          parseSuccess: !!errorData.error
        });

        const error = new Error(errorData.error || errorText || `HTTP ${response.status}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).errorData = errorData;
        (error as any).rawResponse = errorText;
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      // التعامل مع أنواع مختلفة من الأخطاء
      if (error.name === "AbortError") {
        console.warn(`Request timeout for ${endpoint}`);
        throw new Error("انتهت مهلة الاتصال");
      }

      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError")
      ) {
        console.warn(`Network error for ${endpoint}`);

        // إذا كان يستخدم خادم خارجي، اقترح التحقق من الإعدادات
        if (this.useExternalConfig) {
          throw new Error(
            "مشكلة في الاتصال بالخادم الخارجي - تحقق من إعدادات الخادم",
          );
        } else {
          throw new Error("مشكلة في الاتصال بالشبكة");
        }
      }

      console.error("API Request failed:", error);
      throw error;
    }
  }

  // تفعيل الاتصال بالخادم الخارجي
  static enableExternalApi(): void {
    this.setUseExternalConfig(true);
  }

  // إلغاء الاتصال بالخادم الخارجي
  static disableExternalApi(): void {
    this.setUseExternalConfig(false);
  }

  // الحصول على ��الة الاتصال الحالية
  static getConnectionStatus(): {
    isExternal: boolean;
    activeConfig: any | null;
    baseUrl: string;
  } {
    const activeConfig = this.useExternalConfig
      ? apiConfigManager.getActiveConfig()
      : null;
    return {
      isExternal: this.useExternalConfig,
      activeConfig,
      baseUrl: this.getBaseURL(),
    };
  }

  // اختبار الاتصال بالخادم الحالي
  static async testConnection(): Promise<{
    success: boolean;
    message: string;
    responseTime?: number;
  }> {
    const startTime = Date.now();

    try {
      const healthEndpoint = this.useExternalConfig ? "/health" : "/health";

      const response = await this.request(healthEndpoint, {
        method: "GET",
      });

      const responseTime = Date.now() - startTime;
      return {
        success: true,
        message: "الاتصال ناجح",
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        message: error.message || "فشل الاتصال",
        responseTime,
      };
    }
  }

  // طلبات المصادقة
  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<any> {
    const response = await this.request<any>("/auth/login", {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({
        ...credentials,
        platform: this.platform,
      }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  static async register(userData: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    accountType: string;
    country?: string;
    city?: string;
    businessName?: string;
    businessType?: string;
  }): Promise<any> {
    const response = await this.request<any>("/auth/register", {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({
        ...userData,
        platform: this.platform,
      }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  static async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
    this.removeToken();
  }

  static async getCurrentUser(): Promise<any> {
    return this.request("/auth/me");
  }

  // طلبات الشركات
  static async getCompanies(filters?: {
    industry?: string;
    country?: string;
    size?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/companies${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request(endpoint);
  }

  static async getCompany(id: string): Promise<any> {
    return this.request(`/companies/${id}`);
  }

  // طلبات المنتجات
  static async getProducts(filters?: {
    category?: string;
    storeId?: string;
    search?: string;
    priceRange?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request(endpoint);
  }

  // طلبات المتاجر
  static async getStores(): Promise<any[]> {
    return this.request("/stores");
  }

  static async getStore(id: string): Promise<any> {
    return this.request(`/stores/${id}`);
  }

  static async createStore(storeData: {
    name: string;
    description?: string;
    category: string;
    phone: string;
    email: string;
    address?: string;
    city: string;
    country?: string;
    workingHours?: {
      start: string;
      end: string;
      days: string[];
    };
    logo?: string;
    banner?: string;
    notificationSettings?: any;
    shippingSettings?: any;
  }): Promise<any> {
    return this.request("/stores", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(storeData),
    });
  }

  static async updateStore(id: string, storeData: any): Promise<any> {
    return this.request(`/stores/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(storeData),
    });
  }

  static async deleteStore(id: string): Promise<any> {
    return this.request(`/stores/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }

  static async getStoreAnalytics(id: string): Promise<any> {
    return this.request(`/stores/${id}/analytics`);
  }

  static async updateStoreStatus(id: string, status: string): Promise<any> {
    return this.request(`/stores/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  static async getProduct(id: string): Promise<any> {
    return this.request(`/products/${id}`);
  }

  // طلبات الوظائ��
  static async getJobs(filters?: {
    category?: string;
    type?: string;
    location?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/jobs${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request(endpoint);
  }

  static async getJob(id: string): Promise<any> {
    return this.request(`/jobs/${id}`);
  }

  // طلبات المتاجر
  static async getStores(filters?: {
    category?: string;
    location?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/stores${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request(endpoint);
  }

  // طلبات الخدمات
  static async getServices(filters?: {
    category?: string;
    location?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/services${params.toString() ? `?${params.toString()}` : ""}`;
    return this.request(endpoint);
  }

  // طلبات خاصة بالجوال
  static async getMobileConfig(): Promise<any> {
    return this.request("/mobile/config");
  }

  static async syncData(): Promise<any> {
    return this.request("/mobile/sync");
  }

  // رفع الملفات
  static async uploadFile(
    file: File | Blob,
    type: "avatar" | "product" | "company",
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const headers: HeadersInit = {
      "X-Platform": this.platform,
    };

    // إضافة المصادقة بناءً على إعدادات الخادم
    if (this.useExternalConfig) {
      const activeConfig = apiConfigManager.getActiveConfig();
      if (activeConfig && activeConfig.authentication) {
        switch (activeConfig.authentication.type) {
          case "bearer":
            const token = this.getToken();
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            break;
          case "apikey":
            if (
              activeConfig.authentication.apiKeyHeader &&
              activeConfig.authentication.apiKeyValue
            ) {
              headers[activeConfig.authentication.apiKeyHeader] =
                activeConfig.authentication.apiKeyValue;
            }
            break;
        }
      }
    } else {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const uploadUrl = this.getEndpointURL("/upload");
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("فشل في رفع الملف");
    }

    return response.json();
  }
}

// هوك React للاستخدام في المكونات
import { useState, useEffect } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, callApi };
};
