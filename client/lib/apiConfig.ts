import { AppSettings } from "../../shared/types";

// API Configuration Interface
export interface ApiConfiguration {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  endpoints: {
    auth?: string;
    users?: string;
    stores?: string;
    products?: string;
    companies?: string;
    jobs?: string;
    orders?: string;
    analytics?: string;
  };
  headers?: Record<string, string>;
  authentication?: {
    type: "bearer" | "apikey" | "basic" | "none";
    tokenKey?: string;
    apiKeyHeader?: string;
    apiKeyValue?: string;
  };
  timeout?: number;
  retries?: number;
  rateLimiting?: {
    maxRequestsPerMinute: number;
    enabled: boolean;
  };
  healthCheck?: {
    endpoint: string;
    interval: number;
    enabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiConfigurationStats {
  total: number;
  active: number;
  inactive: number;
  healthy: number;
  unhealthy: number;
  lastHealthCheck?: string;
}

export class ApiConfigManager {
  private static readonly STORAGE_KEY = "bayt_al_sudani_api_configs";
  private static readonly ACTIVE_CONFIG_KEY =
    "bayt_al_sudani_active_api_config";
  private static instance: ApiConfigManager;

  private constructor() {
    this.initialize();
  }

  static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager();
    }
    return ApiConfigManager.instance;
  }

  // Default configurations
  private getDefaultConfigs(): ApiConfiguration[] {
    return [
      {
        id: "local-dev",
        name: "خادم التطوير المحلي",
        baseUrl: "/api",
        description: "الخادم المحلي للتطوير والاختبار",
        isActive: true,
        isDefault: true,
        endpoints: {
          auth: "/auth",
          users: "/users",
          stores: "/stores",
          products: "/products",
          companies: "/companies",
          jobs: "/jobs",
          orders: "/orders",
          analytics: "/analytics",
        },
        authentication: {
          type: "bearer",
        },
        timeout: 10000,
        retries: 3,
        rateLimiting: {
          maxRequestsPerMinute: 60,
          enabled: false,
        },
        healthCheck: {
          endpoint: "/health",
          interval: 300000, // 5 minutes
          enabled: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Initialize with default configs if none exist
  private initialize(): void {
    const configs = this.getAllConfigs();
    if (configs.length === 0) {
      this.resetToDefaults();
    }
  }

  // Get all API configurations
  getAllConfigs(): ApiConfiguration[] {
    try {
      const configsStr = localStorage.getItem(ApiConfigManager.STORAGE_KEY);
      if (configsStr) {
        const configs = JSON.parse(configsStr);
        return Array.isArray(configs) ? configs : this.getDefaultConfigs();
      }
      return this.getDefaultConfigs();
    } catch (error) {
      console.error("Error loading API configurations:", error);
      return this.getDefaultConfigs();
    }
  }

  // Get active configuration
  getActiveConfig(): ApiConfiguration | null {
    const configs = this.getAllConfigs();

    // Try to get the stored active config ID
    const activeConfigId = localStorage.getItem(
      ApiConfigManager.ACTIVE_CONFIG_KEY,
    );
    if (activeConfigId) {
      const activeConfig = configs.find(
        (config) => config.id === activeConfigId && config.isActive,
      );
      if (activeConfig) return activeConfig;
    }

    // Fallback to first active or default config
    return (
      configs.find((config) => config.isActive) ||
      configs.find((config) => config.isDefault) ||
      configs[0] ||
      null
    );
  }

  // Set active configuration
  setActiveConfig(configId: string): boolean {
    const configs = this.getAllConfigs();
    const config = configs.find((c) => c.id === configId);

    if (!config || !config.isActive) {
      return false;
    }

    localStorage.setItem(ApiConfigManager.ACTIVE_CONFIG_KEY, configId);
    return true;
  }

  // Add new configuration
  addConfig(
    config: Omit<ApiConfiguration, "id" | "createdAt" | "updatedAt">,
  ): string {
    const configs = this.getAllConfigs();
    const newConfig: ApiConfiguration = {
      ...config,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If this is set as default, remove default from others
    if (newConfig.isDefault) {
      configs.forEach((c) => (c.isDefault = false));
    }

    configs.push(newConfig);
    this.saveConfigs(configs);
    return newConfig.id;
  }

  // Update configuration
  updateConfig(id: string, updates: Partial<ApiConfiguration>): boolean {
    const configs = this.getAllConfigs();
    const configIndex = configs.findIndex((c) => c.id === id);

    if (configIndex === -1) return false;

    // If setting as default, remove default from others
    if (updates.isDefault) {
      configs.forEach((c) => (c.isDefault = false));
    }

    configs[configIndex] = {
      ...configs[configIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.saveConfigs(configs);
    return true;
  }

  // Delete configuration
  deleteConfig(id: string): boolean {
    const configs = this.getAllConfigs();
    const configToDelete = configs.find((c) => c.id === id);

    if (!configToDelete) return false;

    // Can't delete the default config if it's the only one
    if (configToDelete.isDefault && configs.length === 1) {
      return false;
    }

    const filteredConfigs = configs.filter((c) => c.id !== id);

    // If we deleted the default, make the first one default
    if (configToDelete.isDefault && filteredConfigs.length > 0) {
      filteredConfigs[0].isDefault = true;
    }

    this.saveConfigs(filteredConfigs);

    // If this was the active config, clear it
    const activeConfigId = localStorage.getItem(
      ApiConfigManager.ACTIVE_CONFIG_KEY,
    );
    if (activeConfigId === id) {
      localStorage.removeItem(ApiConfigManager.ACTIVE_CONFIG_KEY);
    }

    return true;
  }

  // Test configuration connection
  async testConfig(
    config: ApiConfiguration,
  ): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const startTime = Date.now();

    try {
      const testUrl = `${config.baseUrl}${config.healthCheck?.endpoint || "/health"}`;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...config.headers,
      };

      // Add authentication if configured
      if (config.authentication) {
        switch (config.authentication.type) {
          case "bearer":
            const token = localStorage.getItem("auth_token");
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            break;
          case "apikey":
            if (
              config.authentication.apiKeyHeader &&
              config.authentication.apiKeyValue
            ) {
              headers[config.authentication.apiKeyHeader] =
                config.authentication.apiKeyValue;
            }
            break;
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        config.timeout || 5000,
      );

      const response = await fetch(testUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          message: "الاتصال ناجح",
          responseTime,
        };
      } else {
        return {
          success: false,
          message: `خطأ في الخادم: ${response.status} ${response.statusText}`,
          responseTime,
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      if (error.name === "AbortError") {
        return {
          success: false,
          message: "انتهت مهلة الاتصال",
          responseTime,
        };
      }

      return {
        success: false,
        message: `فشل الاتصال: ${error.message || "خطأ غير معروف"}`,
        responseTime,
      };
    }
  }

  // Get configuration statistics
  getStats(): ApiConfigurationStats {
    const configs = this.getAllConfigs();

    return {
      total: configs.length,
      active: configs.filter((c) => c.isActive).length,
      inactive: configs.filter((c) => !c.isActive).length,
      healthy: 0, // Will be updated by health checks
      unhealthy: 0,
      lastHealthCheck: undefined,
    };
  }

  // Export configurations
  exportConfigs(): string {
    const configs = this.getAllConfigs();
    return JSON.stringify(configs, null, 2);
  }

  // Import configurations
  importConfigs(configsJson: string): {
    success: boolean;
    message: string;
    imported: number;
  } {
    try {
      const importedConfigs = JSON.parse(configsJson);

      if (!Array.isArray(importedConfigs)) {
        return {
          success: false,
          message: "صيغة الملف غير صحيحة",
          imported: 0,
        };
      }

      // Validate each config
      const validConfigs: ApiConfiguration[] = [];
      for (const config of importedConfigs) {
        if (this.validateConfig(config)) {
          validConfigs.push({
            ...config,
            id: this.generateId(), // Generate new IDs
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      if (validConfigs.length === 0) {
        return {
          success: false,
          message: "لا توجد إعدادات صحيحة للاستيراد",
          imported: 0,
        };
      }

      // Add to existing configs
      const existingConfigs = this.getAllConfigs();
      this.saveConfigs([...existingConfigs, ...validConfigs]);

      return {
        success: true,
        message: `تم استيراد ${validConfigs.length} إعداد بنجاح`,
        imported: validConfigs.length,
      };
    } catch (error) {
      return {
        success: false,
        message: "خطأ في قراءة الملف",
        imported: 0,
      };
    }
  }

  // Reset to default configurations
  resetToDefaults(): void {
    const defaultConfigs = this.getDefaultConfigs();
    this.saveConfigs(defaultConfigs);
    localStorage.removeItem(ApiConfigManager.ACTIVE_CONFIG_KEY);
  }

  // Private helper methods
  private saveConfigs(configs: ApiConfiguration[]): void {
    try {
      localStorage.setItem(
        ApiConfigManager.STORAGE_KEY,
        JSON.stringify(configs),
      );
    } catch (error) {
      console.error("Error saving API configurations:", error);
    }
  }

  private generateId(): string {
    return `api-config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateConfig(config: any): boolean {
    return (
      typeof config === "object" &&
      typeof config.name === "string" &&
      typeof config.baseUrl === "string" &&
      typeof config.isActive === "boolean" &&
      config.baseUrl.trim() !== ""
    );
  }

  // Cleanup method for testing
  static clearAll(): void {
    localStorage.removeItem(ApiConfigManager.STORAGE_KEY);
    localStorage.removeItem(ApiConfigManager.ACTIVE_CONFIG_KEY);
  }
}

// Singleton instance
export const apiConfigManager = ApiConfigManager.getInstance();
