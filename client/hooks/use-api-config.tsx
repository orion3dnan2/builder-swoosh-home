import { useState, useEffect, useCallback } from 'react';
import { apiConfigManager, ApiConfiguration, ApiConfigurationStats } from '@/lib/apiConfig';
import { ApiService } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';

export const useApiConfig = () => {
  const [configs, setConfigs] = useState<ApiConfiguration[]>([]);
  const [activeConfig, setActiveConfig] = useState<ApiConfiguration | null>(null);
  const [stats, setStats] = useState<ApiConfigurationStats>({ total: 0, active: 0, inactive: 0, healthy: 0, unhealthy: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load configurations
  const loadConfigs = useCallback(() => {
    const allConfigs = apiConfigManager.getAllConfigs();
    const currentActive = apiConfigManager.getActiveConfig();
    const currentStats = apiConfigManager.getStats();
    
    setConfigs(allConfigs);
    setActiveConfig(currentActive);
    setStats(currentStats);
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  // Add new configuration
  const addConfig = useCallback(async (config: Omit<ApiConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const id = apiConfigManager.addConfig(config);
      loadConfigs();
      
      toast({
        title: "تم إضافة الخادم",
        description: `تم إضافة خادم "${config.name}" بنجاح`,
      });
      
      return id;
    } catch (error) {
      toast({
        title: "خطأ في إضافة الخادم",
        description: "فشل في إضافة الخادم الجديد",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadConfigs, toast]);

  // Update configuration
  const updateConfig = useCallback(async (id: string, updates: Partial<ApiConfiguration>) => {
    try {
      setLoading(true);
      const success = apiConfigManager.updateConfig(id, updates);
      
      if (success) {
        loadConfigs();
        toast({
          title: "تم تحديث الخادم",
          description: "تم حفظ إعدادات الخادم بنجاح",
        });
      } else {
        throw new Error("فشل في التحديث");
      }
      
      return success;
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث إعدادات الخادم",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadConfigs, toast]);

  // Delete configuration
  const deleteConfig = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const config = configs.find(c => c.id === id);
      const success = apiConfigManager.deleteConfig(id);
      
      if (success) {
        loadConfigs();
        toast({
          title: "تم حذف الخادم",
          description: `تم حذف خادم "${config?.name}" بنجاح`,
        });
      } else {
        toast({
          title: "خطأ في الحذف",
          description: "لا يمكن حذف الخادم الافتراضي الوحيد",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الخادم",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [configs, loadConfigs, toast]);

  // Test configuration
  const testConfig = useCallback(async (config: ApiConfiguration) => {
    try {
      setLoading(true);
      const result = await apiConfigManager.testConfig(config);
      
      toast({
        title: result.success ? "اختبار ناجح" : "اختبار فاشل",
        description: `${result.message}${result.responseTime ? ` (${result.responseTime}ms)` : ''}`,
        variant: result.success ? "default" : "destructive"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "خطأ في الاختبار",
        description: "فشل في اختبار الاتصال",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Set active configuration
  const setActiveConfiguration = useCallback(async (configId: string) => {
    try {
      setLoading(true);
      const success = apiConfigManager.setActiveConfig(configId);
      
      if (success) {
        const config = configs.find(c => c.id === configId);
        loadConfigs();
        
        // Enable external API in ApiService
        ApiService.enableExternalApi();
        
        toast({
          title: "تم تغيير الخادم",
          description: `تم تفعيل خادم: ${config?.name}`,
        });
      } else {
        throw new Error("فشل في تفعيل الخادم");
      }
      
      return success;
    } catch (error) {
      toast({
        title: "خطأ في التفعيل",
        description: "فشل في تفعيل الخادم",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [configs, loadConfigs, toast]);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    try {
      setLoading(true);
      apiConfigManager.resetToDefaults();
      loadConfigs();
      
      // Disable external API in ApiService
      ApiService.disableExternalApi();
      
      toast({
        title: "تم إعادة التعيين",
        description: "تم إعادة تعيين جميع الخوادم للإعدادات الافتراضية",
      });
    } catch (error) {
      toast({
        title: "خطأ في إعادة التعيين",
        description: "فشل في إعادة تعيين الإعدادات",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadConfigs, toast]);

  // Export configurations
  const exportConfigs = useCallback(() => {
    try {
      const configsJson = apiConfigManager.exportConfigs();
      const blob = new Blob([configsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-configs-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير إعدادات الخوادم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير الإعدادات",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Import configurations
  const importConfigs = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const content = await file.text();
      const result = apiConfigManager.importConfigs(content);
      
      if (result.success) {
        loadConfigs();
      }
      
      toast({
        title: result.success ? "نجح الاستيراد" : "فشل الاستيراد",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "خطأ في الاستيراد",
        description: "فشل في قراءة الملف",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadConfigs, toast]);

  // Test current connection
  const testCurrentConnection = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ApiService.testConnection();
      
      toast({
        title: result.success ? "اختبار ناجح" : "اختبار فاشل",
        description: `${result.message}${result.responseTime ? ` (${result.responseTime}ms)` : ''}`,
        variant: result.success ? "default" : "destructive"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "خطأ في الاختبار",
        description: "فشل في اختبار الاتصال الحالي",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return ApiService.getConnectionStatus();
  }, []);

  // Validate configuration
  const validateConfig = useCallback((config: Partial<ApiConfiguration>) => {
    const errors: string[] = [];
    
    if (!config.name?.trim()) {
      errors.push("اسم الخادم مطلوب");
    }
    
    if (!config.baseUrl?.trim()) {
      errors.push("رابط الخادم مطلوب");
    } else {
      try {
        new URL(config.baseUrl);
      } catch {
        if (!config.baseUrl.startsWith('/')) {
          errors.push("رابط الخادم غير صحيح");
        }
      }
    }
    
    if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
      errors.push("مهلة الانتظار يجب أن تكون بين 1000 و 60000 مللي ثانية");
    }
    
    if (config.retries && (config.retries < 0 || config.retries > 10)) {
      errors.push("عدد المحاولات يجب أن يكون بين 0 و 10");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    configs,
    activeConfig,
    stats,
    loading,
    addConfig,
    updateConfig,
    deleteConfig,
    testConfig,
    setActiveConfiguration,
    resetToDefaults,
    exportConfigs,
    importConfigs,
    testCurrentConnection,
    getConnectionStatus,
    validateConfig,
    refreshConfigs: loadConfigs
  };
};

// Hook for simplified API configuration status
export const useApiConnectionStatus = () => {
  const [status, setStatus] = useState(ApiService.getConnectionStatus());
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const refreshStatus = useCallback(() => {
    setStatus(ApiService.getConnectionStatus());
    setLastCheck(new Date());
  }, []);

  useEffect(() => {
    refreshStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return {
    ...status,
    lastCheck,
    refreshStatus
  };
};
