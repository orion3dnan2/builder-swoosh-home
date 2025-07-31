import { useState, useEffect } from "react";
import { regionsManager, DeliveryRegion, Country } from "@/lib/regionsManager";

/**
 * Hook مخصص لمراقبة تحديثات المناطق
 */
export function useRegions() {
  const [regions, setRegions] = useState<string[]>([]);
  const [regionsByCountry, setRegionsByCountry] = useState<Record<string, DeliveryRegion[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحميل المناطق عند بداية التشغيل
    const loadRegions = () => {
      setIsLoading(true);
      try {
        const currentRegions = regionsManager.getRegions();
        const currentRegionsByCountry = regionsManager.getAllRegionsByCountry();
        setRegions(currentRegions);
        setRegionsByCountry(currentRegionsByCountry);
      } catch (error) {
        console.error("خطأ في تحميل المناطق:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegions();

    // مراقبة التغييرات في localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminDeliveryRegions") {
        loadRegions();
      }
    };

    // مراقبة التغييرات المحلية (في نفس الصفحة)
    const handleRegionsUpdate = () => {
      loadRegions();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("regionsUpdated", handleRegionsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("regionsUpdated", handleRegionsUpdate);
    };
  }, []);

  // إشعار بالتحديثات
  const notifyRegionsUpdate = () => {
    window.dispatchEvent(new Event("regionsUpdated"));
  };

  return {
    regions,
    regionsByCountry,
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

/**
 * Hook للحصول على المناطق حسب الدولة
 */
export function useRegionsByCountry(countryCode?: string) {
  const { regionsByCountry, notifyRegionsUpdate } = useRegions();
  
  const getRegionsForCountry = (code: string): DeliveryRegion[] => {
    return regionsByCountry[code] || [];
  };

  const addRegionToCountry = (regionName: string, code: string): boolean => {
    const success = regionsManager.addRegionNew(regionName, code);
    if (success) {
      notifyRegionsUpdate();
    }
    return success;
  };

  const removeRegionFromCountry = (regionId: string, code: string): boolean => {
    const success = regionsManager.removeRegionNew(regionId, code);
    if (success) {
      notifyRegionsUpdate();
    }
    return success;
  };

  const updateRegionInCountry = (regionId: string, code: string, newName: string): boolean => {
    const success = regionsManager.updateRegionNew(regionId, code, newName);
    if (success) {
      notifyRegionsUpdate();
    }
    return success;
  };

  return {
    regionsByCountry,
    getRegionsForCountry,
    addRegionToCountry,
    removeRegionFromCountry,
    updateRegionInCountry,
    availableCountries: regionsManager.getAvailableCountries(),
  };
}

/**
 * Hook للحصول على الدول المتاحة
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const { regionsByCountry } = useRegions();

  useEffect(() => {
    setCountries(regionsManager.getAvailableCountries());
  }, [regionsByCountry]);

  return countries;
}
