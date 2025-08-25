export interface PromoCode {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validUntil?: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export class PromoCodeService {
  static readonly STORAGE_KEY = "bayt_al_sudani_promo_codes";

  // Sample promo codes
  private static defaultPromoCodes: PromoCode[] = [
    {
      code: "WELCOME10",
      description: "خصم 10% للعملاء الجدد",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 15,
      maxDiscount: 5,
      isActive: true,
      usedCount: 0,
    },
    {
      code: "SUDAN20",
      description: "خصم 20% على المنتجات السودانية",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 30,
      maxDiscount: 15,
      isActive: true,
      usedCount: 0,
    },
    {
      code: "RAMADAN15",
      description: "خصم 15% خاص برمضان",
      discountType: "percentage",
      discountValue: 15,
      minOrderAmount: 10,
      isActive: true,
      usedCount: 0,
    },
    {
      code: "FREESHIP",
      description: "شحن مجاني",
      discountType: "fixed",
      discountValue: 2, // قيمة الشحن بالدينار الكويتي
      minOrderAmount: 8,
      isActive: true,
      usedCount: 0,
    },
    {
      code: "KWD10",
      description: "خصم خاص 10 دنانير",
      discountType: "fixed",
      discountValue: 10,
      minOrderAmount: 30,
      isActive: true,
      usedCount: 0,
    },
  ];

  // Get all promo codes
  static getPromoCodes(): PromoCode[] {
    try {
      if (typeof window === "undefined") return this.defaultPromoCodes;
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        this.savePromoCodes(this.defaultPromoCodes);
        return this.defaultPromoCodes;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to get promo codes:", error);
      return this.defaultPromoCodes;
    }
  }

  // Save promo codes
  static savePromoCodes(codes: PromoCode[]): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(codes));
    } catch (error) {
      console.error("Failed to save promo codes:", error);
    }
  }

  // Validate promo code
  static validatePromoCode(
    code: string,
    orderAmount: number,
  ): {
    isValid: boolean;
    message: string;
    promoCode?: PromoCode;
  } {
    try {
      const promoCodes = this.getPromoCodes();
      const promoCode = promoCodes.find(
        (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive,
      );

      if (!promoCode) {
        return {
          isValid: false,
          message: "كود الخصم غير صالح",
        };
      }

      if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
        return {
          isValid: false,
          message: `الحد الأدنى للطلب ${promoCode.minOrderAmount} د.ك`,
        };
      }

      if (promoCode.validUntil && new Date() > new Date(promoCode.validUntil)) {
        return {
          isValid: false,
          message: "كود الخصم منتهي الصلاحية",
        };
      }

      if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
        return {
          isValid: false,
          message: "تم استنفاد عدد مرات الاستخدام",
        };
      }

      return {
        isValid: true,
        message: promoCode.description,
        promoCode,
      };
    } catch (error) {
      console.error("Failed to validate promo code:", error);
      return {
        isValid: false,
        message: "خطأ في التحقق من الكود",
      };
    }
  }

  // Calculate discount
  static calculateDiscount(
    promoCode: PromoCode,
    orderAmount: number,
    shippingCost: number = 0,
  ): {
    discountAmount: number;
    finalAmount: number;
    shippingDiscount: number;
  } {
    try {
      let discountAmount = 0;
      let shippingDiscount = 0;

      if (promoCode.discountType === "percentage") {
        discountAmount = (orderAmount * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount) {
          discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
        }
      } else if (promoCode.discountType === "fixed") {
        // If code is for free shipping
        if (promoCode.code === "FREESHIP") {
          shippingDiscount = shippingCost;
          discountAmount = 0;
        } else {
          discountAmount = promoCode.discountValue;
        }
      }

      const finalAmount = Math.max(0, orderAmount - discountAmount);

      return {
        discountAmount,
        finalAmount,
        shippingDiscount,
      };
    } catch (error) {
      console.error("Failed to calculate discount:", error);
      return {
        discountAmount: 0,
        finalAmount: orderAmount,
        shippingDiscount: 0,
      };
    }
  }

  // Use promo code (increment usage count)
  static usePromoCode(code: string): void {
    try {
      const promoCodes = this.getPromoCodes();
      const promoCodeIndex = promoCodes.findIndex(
        (p) => p.code.toUpperCase() === code.toUpperCase(),
      );

      if (promoCodeIndex >= 0) {
        promoCodes[promoCodeIndex].usedCount += 1;
        this.savePromoCodes(promoCodes);
      }
    } catch (error) {
      console.error("Failed to use promo code:", error);
    }
  }
}
