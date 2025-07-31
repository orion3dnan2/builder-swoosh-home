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

// المناطق الافتراضية
const DEFAULT_REGIONS = [
  "الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة",
  "دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين",
  "الدوحة", "الريان", "الوكرة", "الخور",
  "الكويت", "حولي", "الفروانية", "��لأحمدي", "الجهراء", "مبارك الكبير",
  "المنامة", "المحرق", "مدينة عيسى", "الرفاع", "مدينة حمد",
  "مسقط", "صلالة", "نزوى", "صحار", "البريمي", "إبراء"
];

export class RegionsManager {
  private static instance: RegionsManager;
  private regions: string[] = [];

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
      const savedRegions = localStorage.getItem('adminDeliveryRegions');
      if (savedRegions) {
        const parsedRegions = JSON.parse(savedRegions);
        if (Array.isArray(parsedRegions)) {
          this.regions = parsedRegions;
          return;
        }
      }
      
      // إذا لم توجد مناطق محفوظة، استخدم الافتراضية
      this.regions = [...DEFAULT_REGIONS];
      this.saveRegions();
    } catch (error) {
      console.error('خطأ في تحميل المناطق:', error);
      this.regions = [...DEFAULT_REGIONS];
    }
  }

  /**
   * حفظ المناطق في localStorage
   */
  private saveRegions(): void {
    try {
      localStorage.setItem('adminDeliveryRegions', JSON.stringify(this.regions));
    } catch (error) {
      console.error('خطأ في حفظ المناطق:', error);
    }
  }

  /**
   * الحصول على جميع المناطق
   */
  public getRegions(): string[] {
    return [...this.regions];
  }

  /**
   * إضافة منطقة جديدة
   */
  public addRegion(regionName: string): boolean {
    const trimmedName = regionName.trim();
    if (!trimmedName || this.regions.includes(trimmedName)) {
      return false;
    }

    this.regions.push(trimmedName);
    this.saveRegions();
    return true;
  }

  /**
   * حذف منطقة
   */
  public removeRegion(regionName: string): boolean {
    const index = this.regions.indexOf(regionName);
    if (index === -1) {
      return false;
    }

    this.regions.splice(index, 1);
    this.saveRegions();
    return true;
  }

  /**
   * تحديث منطقة
   */
  public updateRegion(oldName: string, newName: string): boolean {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName || this.regions.includes(trimmedNewName)) {
      return false;
    }

    const index = this.regions.indexOf(oldName);
    if (index === -1) {
      return false;
    }

    this.regions[index] = trimmedNewName;
    this.saveRegions();
    return true;
  }

  /**
   * التحقق من وجود منطقة
   */
  public hasRegion(regionName: string): boolean {
    return this.regions.includes(regionName);
  }

  /**
   * إعادة تعيين المناطق للقيم الافتراضية
   */
  public resetToDefaults(): void {
    this.regions = [...DEFAULT_REGIONS];
    this.saveRegions();
  }

  /**
   * الحصول على إحصائيات المناطق
   */
  public getStats(): {
    total: number;
    byCountry: Record<string, number>;
  } {
    const stats = {
      total: this.regions.length,
      byCountry: {} as Record<string, number>
    };

    // تصنيف المناطق حسب الدول (تقريبي)
    this.regions.forEach(region => {
      let country = 'أخرى';
      
      if (['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'].includes(region)) {
        country = 'السعودية';
      } else if (['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين'].includes(region)) {
        country = 'الإمارات';
      } else if (['الدوحة', 'ا��ريان', 'الوكرة', 'الخور'].includes(region)) {
        country = 'قطر';
      } else if (['الكويت', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير'].includes(region)) {
        country = 'الكويت';
      } else if (['المنامة', 'المحرق', 'مدينة عيسى', 'الرفاع', 'مدينة حمد'].includes(region)) {
        country = 'البحرين';
      } else if (['مسقط', 'صلالة', 'نزوى', 'صحار', 'البريمي', 'إبراء'].includes(region)) {
        country = 'عمان';
      }
      
      stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;
    });

    return stats;
  }
}

// تصدير singleton instance
export const regionsManager = RegionsManager.getInstance();
