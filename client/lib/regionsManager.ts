/**
 * مدير المناطق - يدير المناطق المتاحة للتوصيل
 */

export interface DeliveryRegion {
  id: string;
  name: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export interface Country {
  code: string;
  name: string;
  regions: string[];
}

// الدول المتاحة
export const AVAILABLE_COUNTRIES: Country[] = [
  { code: 'SA', name: 'السعودية', regions: [] },
  { code: 'AE', name: 'الإمارات', regions: [] },
  { code: 'QA', name: 'قطر', regions: [] },
  { code: 'KW', name: 'الكويت', regions: [] },
  { code: 'BH', name: 'البحرين', regions: [] },
  { code: 'OM', name: 'عمان', regions: [] },
];

// المناطق الافتراضية مرتبة حسب الدول
const DEFAULT_REGIONS_BY_COUNTRY: Record<string, string[]> = {
  'SA': ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة ال��نورة"],
  'AE': ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  'QA': ["الدوحة", "الريان", "الوكرة", "الخور"],
  'KW': ["الكويت", "حولي", "الفروانية", "الأحمدي", "الجهراء", "مبارك الكبير"],
  'BH': ["المنامة", "المحرق", "مدينة عيسى", "الرفاع", "مدينة حمد"],
  'OM': ["مسقط", "صلالة", "نزوى", "صحار", "البريمي", "إبراء"]
};

export class RegionsManager {
  private static instance: RegionsManager;
  private regionsByCountry: Record<string, DeliveryRegion[]> = {};

  private constructor() {
    this.loadRegions();
  }

  public static getInstance(): RegionsManager {
    if (!RegionsManager.instance) {
      RegionsManager.instance = new RegionsManager();
    }
    return RegionsManager.instance;
  }

  /**
   * تحميل المناطق من localStorage
   */
  private loadRegions(): void {
    try {
      const savedRegions = localStorage.getItem("adminDeliveryRegions");
      if (savedRegions) {
        const parsedRegions = JSON.parse(savedRegions);

        // فحص إذا كانت البيانات بالتنسيق الجديد (object بمفاتيح الدول)
        if (parsedRegions && typeof parsedRegions === 'object' && !Array.isArray(parsedRegions)) {
          // التحقق من أن البيانات صحيحة
          let isValidFormat = true;
          for (const [countryCode, regions] of Object.entries(parsedRegions)) {
            if (!Array.isArray(regions)) {
              isValidFormat = false;
              break;
            }
          }

          if (isValidFormat) {
            this.regionsByCountry = parsedRegions;
            return;
          }
        }

        // إذا كانت البيانات بالتنسيق القديم (array من strings) أو تنسيق غير صحيح
        console.warn("تم العثور على بيانات مناطق بتنسيق قديم، سيتم إعادة تعيينها");
        localStorage.removeItem("adminDeliveryRegions");
      }

      // إذا لم توجد مناطق محفوظة أو كانت بتنسيق خاطئ، استخدم الافتراضية
      this.resetToDefaults();
    } catch (error) {
      console.error("خطأ في تحميل المناطق:", error);
      // إزالة البيان��ت التالفة وإعادة تعيين افتراضية
      localStorage.removeItem("adminDeliveryRegions");
      this.resetToDefaults();
    }
  }

  /**
   * حفظ المناطق في localStorage
   */
  private saveRegions(): void {
    try {
      localStorage.setItem(
        "adminDeliveryRegions",
        JSON.stringify(this.regionsByCountry),
      );
    } catch (error) {
      console.error("خطأ في حفظ المناطق:", error);
    }
  }

  /**
   * الحصول على جميع المناطق (للتوافق مع النظام القديم)
   */
  public getRegions(): string[] {
    const allRegions: string[] = [];

    // فحص أمان
    if (!this.regionsByCountry || typeof this.regionsByCountry !== 'object') {
      this.resetToDefaults();
    }

    Object.values(this.regionsByCountry).forEach(regions => {
      if (Array.isArray(regions)) {
        regions.forEach(region => {
          if (region && typeof region === 'object' && region.name) {
            allRegions.push(region.name);
          }
        });
      }
    });
    return allRegions;
  }

  /**
   * الحصول على المناطق حسب الدولة
   */
  public getRegionsByCountry(countryCode: string): DeliveryRegion[] {
    return this.regionsByCountry[countryCode] || [];
  }

  /**
   * الحصول على جميع الدول والمناطق
   */
  public getAllRegionsByCountry(): Record<string, DeliveryRegion[]> {
    return { ...this.regionsByCountry };
  }

  /**
   * الحصول على الدول المتاحة
   */
  public getAvailableCountries(): Country[] {
    return AVAILABLE_COUNTRIES.map(country => ({
      ...country,
      regions: this.getRegionsByCountry(country.code).map(r => r.name)
    }));
  }

  /**
   * إضافة منطقة جديدة (النظام الجديد)
   */
  public addRegionNew(regionName: string, countryCode: string): boolean {
    const trimmedName = regionName.trim();
    if (!trimmedName) {
      return false;
    }

    // التحقق من عدم وجود المنطقة في نفس الدولة
    const existingRegions = this.regionsByCountry[countryCode] || [];
    if (existingRegions.some(r => r.name === trimmedName)) {
      return false;
    }

    // إنشاء المنطقة الجديدة
    const newRegion: DeliveryRegion = {
      id: `${countryCode}_${Date.now()}`,
      name: trimmedName,
      country: countryCode,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    if (!this.regionsByCountry[countryCode]) {
      this.regionsByCountry[countryCode] = [];
    }

    this.regionsByCountry[countryCode].push(newRegion);
    this.saveRegions();
    return true;
  }

  /**
   * حذف ��نطقة (النظام الجديد)
   */
  public removeRegionNew(regionId: string, countryCode: string): boolean {
    const regions = this.regionsByCountry[countryCode];
    if (!regions) {
      return false;
    }

    const index = regions.findIndex(r => r.id === regionId);
    if (index === -1) {
      return false;
    }

    regions.splice(index, 1);
    this.saveRegions();
    return true;
  }

  /**
   * تحديث منطقة (النظام الجديد)
   */
  public updateRegionNew(regionId: string, countryCode: string, newName: string): boolean {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName) {
      return false;
    }

    const regions = this.regionsByCountry[countryCode];
    if (!regions) {
      return false;
    }

    const region = regions.find(r => r.id === regionId);
    if (!region) {
      return false;
    }

    // التحقق من عدم تكرار الاسم في نفس الدولة
    if (regions.some(r => r.name === trimmedNewName && r.id !== regionId)) {
      return false;
    }

    region.name = trimmedNewName;
    this.saveRegions();
    return true;
  }

  /**
   * إضافة منطقة (للتوافق مع النظام القديم)
   */
  public addRegion(regionName: string): boolean {
    const country = this.detectCountryFromRegionName(regionName);
    return this.addRegionNew(regionName, country);
  }

  /**
   * حذف منطقة (للتوافق مع النظام القديم)
   */
  public removeRegion(regionName: string): boolean {
    for (const [countryCode, regions] of Object.entries(this.regionsByCountry)) {
      const region = regions.find(r => r.name === regionName);
      if (region) {
        return this.removeRegionNew(region.id, countryCode);
      }
    }
    return false;
  }

  /**
   * تحديث منطقة (للتوافق مع النظام القديم)
   */
  public updateRegion(oldName: string, newName: string): boolean {
    for (const [countryCode, regions] of Object.entries(this.regionsByCountry)) {
      const region = regions.find(r => r.name === oldName);
      if (region) {
        return this.updateRegionNew(region.id, countryCode, newName);
      }
    }
    return false;
  }

  /**
   * التحقق من وجود منطقة
   */
  public hasRegion(regionName: string, countryCode?: string): boolean {
    if (countryCode) {
      const regions = this.regionsByCountry[countryCode] || [];
      return regions.some(r => r.name === regionName);
    }
    
    // البحث في جميع الدول
    return Object.values(this.regionsByCountry).some(regions => 
      regions.some(r => r.name === regionName)
    );
  }

  /**
   * إعادة تعيين المناطق للقيم الافتراضية
   */
  public resetToDefaults(): void {
    this.regionsByCountry = {};
    
    Object.entries(DEFAULT_REGIONS_BY_COUNTRY).forEach(([countryCode, regions]) => {
      this.regionsByCountry[countryCode] = regions.map((regionName, index) => ({
        id: `${countryCode}_${index}`,
        name: regionName,
        country: countryCode,
        isActive: true,
        createdAt: new Date().toISOString()
      }));
    });
    
    this.saveRegions();
  }

  /**
   * الحصول على إحصائيات المناطق
   */
  public getStats(): {
    total: number;
    byCountry: Record<string, number>;
    countries: number;
  } {
    // فحص أمان للتأكد من وجود البيانات
    if (!this.regionsByCountry || typeof this.regionsByCountry !== 'object') {
      console.warn("regionsByCountry is not properly initialized, resetting to defaults");
      this.resetToDefaults();
    }

    let total = 0;
    const byCountry: Record<string, number> = {};
    
    // حساب الإحصائيات من البيانات الفعلية
    Object.entries(this.regionsByCountry).forEach(([countryCode, regions]) => {
      // التأ��د من أن regions هو array صالح
      if (!Array.isArray(regions)) {
        console.warn(`Invalid regions data for country ${countryCode}:`, regions);
        return;
      }

      const countryName = AVAILABLE_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
      const activeRegions = regions.filter(r => r && typeof r === 'object' && r.isActive);
      byCountry[countryName] = activeRegions.length;
      total += activeRegions.length;
    });

    return {
      total,
      byCountry,
      countries: Object.keys(this.regionsByCountry).length
    };
  }

  /**
   * تحديد الدولة من اسم المنطقة
   */
  private detectCountryFromRegionName(regionName: string): string {
    for (const [countryCode, regions] of Object.entries(DEFAULT_REGIONS_BY_COUNTRY)) {
      if (regions.includes(regionName)) {
        return countryCode;
      }
    }
    return 'SA'; // افتراضي
  }
}

// تصدير singleton instance
export const regionsManager = RegionsManager.getInstance();
