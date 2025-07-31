import { useState, useEffect } from 'react';
import { regionsManager } from '@/lib/regionsManager';

/**
 * Hook مخصص لمراقبة تحديثات المناطق
 */
export function useRegions() {
  const [regions, setRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحميل المناطق عند بداية التشغيل
    const loadRegions = () => {
      setIsLoading(true);
      try {
        const currentRegions = regionsManager.getRegions();
        setRegions(currentRegions);
      } catch (error) {
        console.error('خطأ في تحميل المناطق:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegions();

    // مراقبة التغييرات في localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminDeliveryRegions') {
        loadRegions();
      }
    };

    // مراقبة التغييرات المحلية (في نفس الصفحة)
    const handleRegionsUpdate = () => {
      loadRegions();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('regionsUpdated', handleRegionsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('regionsUpdated', handleRegionsUpdate);
    };
  }, []);

  // إشعار بالتحديثات
  const notifyRegionsUpdate = () => {
    window.dispatchEvent(new Event('regionsUpdated'));
  };

  return {
    regions,
    isLoading,
    regionsCount: regions.length,
    hasRegions: regions.length > 0,
    notifyRegionsUpdate,
    regionsManager,
  };
}

/**
 * Hook للحصول على إحصائيات المناطق
 */
export function useRegionsStats() {
  const { regions } = useRegions();
  const [stats, setStats] = useState(regionsManager.getStats());

  useEffect(() => {
    setStats(regionsManager.getStats());
  }, [regions]);

  return stats;
}
