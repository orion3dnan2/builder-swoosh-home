import { Product } from "../../shared/types";

export class ProductService {
  private static readonly STORAGE_KEY = "bayt_al_sudani_products";

  // Demo products for development
  private static demoProducts: Product[] = [
    {
      id: "prod-001",
      storeId: "store-001",
      name: "عطر صندل سوداني أصلي",
      description:
        "عطر صندل طبيعي من السودان بأجود الخامات. رائحة فواحة تدوم طويلاً مع خليط من الورود السودانية الأصيلة.",
      price: 45.0,
      salePrice: 39.99,
      images: ["/placeholder.svg"],
      category: "عطور ومستحضرات",
      tags: ["عطر", "صندل", "سوداني", "طبيعي"],
      inventory: {
        quantity: 25,
        sku: "PER-SDL-001",
        lowStockThreshold: 5,
      },
      specifications: {
        الحجم: "50 مل",
        النوع: "عطر زيتي",
        المنشأ: "السودان",
        التركيز: "20%",
      },
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "prod-002",
      storeId: "store-001",
      name: "كركديه سوداني طبيعي",
      description:
        "كركديه طبيعي من أجود أنواع الكركديه السوداني. غني بالفيتامينات ومضادات الأكسدة.",
      price: 15.5,
      images: ["/placeholder.svg"],
      category: "أطعمة ومشروبات",
      tags: ["كركديه", "طبيعي", "صحي", "سوداني"],
      inventory: {
        quantity: 50,
        sku: "BEV-HIB-002",
        lowStockThreshold: 10,
      },
      specifications: {
        الوزن: "500 جرام",
        النوع: "مجفف طبيعي",
        المنشأ: "شمال السودان",
        الصلاحية: "سنتان",
      },
      status: "active",
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
    },
    {
      id: "prod-003",
      storeId: "store-001",
      name: "حقيبة جلدية سودانية",
      description:
        "حقيبة يد نسائية من الجلد السوداني الأصلي. تصميم عصري مع لمسة تراثية سودانية.",
      price: 89.99,
      images: ["/placeholder.svg"],
      category: "إكسسوارات",
      tags: ["حقيبة", "جلد", "نسائي", "سوداني"],
      inventory: {
        quantity: 0,
        sku: "ACC-BAG-003",
        lowStockThreshold: 3,
      },
      specifications: {
        المقاس: "30x25x10 سم",
        المادة: "جلد طبيعي",
        اللون: "بني",
        الإغلاق: "سوستة",
      },
      status: "out_of_stock",
      createdAt: "2024-01-05T12:00:00Z",
      updatedAt: "2024-01-25T09:15:00Z",
    },
    {
      id: "prod-004",
      storeId: "store-002",
      name: "بخور لبان ذكر أصلي",
      description:
        "بخور لبان ذكر من أجود الأنواع السودانية. رائحة عطرة تملأ المكان بالعبق الأصيل.",
      price: 32.50,
      salePrice: 27.99,
      images: ["/placeholder.svg"],
      category: "عطور ومستحضرات",
      tags: ["بخور", "لبان", "ذكر", "سوداني"],
      inventory: {
        quantity: 18,
        sku: "INC-LBN-004",
        lowStockThreshold: 5,
      },
      specifications: {
        الوزن: "100 جرام",
        النوع: "لبان ذكر خالص",
        المنشأ: "شرق السودان",
        الدرجة: "فاخر",
      },
      status: "active",
      createdAt: "2024-02-01T10:00:00Z",
      updatedAt: "2024-02-10T14:30:00Z",
    },
    {
      id: "prod-005",
      storeId: "store-002",
      name: "عطر زهر الياسمين",
      description:
        "عطر طبيعي من زهر الياسمين السوداني. رائحة ناعمة ومنعشة تدوم لساعات طويلة.",
      price: 52.00,
      images: ["/placeholder.svg"],
      category: "عطور ومستحضرات",
      tags: ["عطر", "ياسمين", "طبيعي", "نسائي"],
      inventory: {
        quantity: 22,
        sku: "PER-JAS-005",
        lowStockThreshold: 3,
      },
      specifications: {
        الحجم: "30 مل",
        النوع: "عطر طبيعي",
        المنشأ: "السودان",
        التركيز: "15%",
      },
      status: "active",
      createdAt: "2024-02-05T09:00:00Z",
      updatedAt: "2024-02-15T11:45:00Z",
    },
    {
      id: "prod-006",
      storeId: "store-003",
      name: "ملوخية سودانية مجففة",
      description:
        "ملوخية سودانية مجففة من أجود الأنواع. طبق تقليدي شهي ومغذي من المطبخ السوداني.",
      price: 12.75,
      images: ["/placeholder.svg"],
      category: "أطعمة ومشروبات",
      tags: ["ملوخية", "مجففة", "سودانية", "تقليدية"],
      inventory: {
        quantity: 35,
        sku: "FOOD-MLK-006",
        lowStockThreshold: 8,
      },
      specifications: {
        الوزن: "250 جرام",
        النوع: "مجففة طبيعياً",
        المنشأ: "وسط السودان",
        الصلاحية: "18 شهر",
      },
      status: "active",
      createdAt: "2024-02-10T08:00:00Z",
      updatedAt: "2024-02-20T16:30:00Z",
    },
    {
      id: "prod-007",
      storeId: "store-003",
      name: "توابل دقة سودانية",
      description:
        "خلطة توابل الدقة السودانية الأصيلة. تضفي نكهة مميزة على الأطباق التقليدية.",
      price: 8.50,
      images: ["/placeholder.svg"],
      category: "أطعمة ومشروبات",
      tags: ["توابل", "دقة", "سودانية", "خلطة"],
      inventory: {
        quantity: 42,
        sku: "SPICE-DQA-007",
        lowStockThreshold: 10,
      },
      specifications: {
        الوزن: "150 جرام",
        النوع: "خلطة توابل طبيعية",
        المنشأ: "السودان",
        الصلاحية: "سنة واحدة",
      },
      status: "active",
      createdAt: "2024-02-12T10:30:00Z",
      updatedAt: "2024-02-22T14:15:00Z",
    },
    {
      id: "prod-008",
      storeId: "store-005",
      name: "فستان سوداني تقليدي",
      description:
        "فستان نسائي بالطراز السوداني التقليدي. قماش عالي الجودة وتطريز يدوي أنيق.",
      price: 125.00,
      salePrice: 99.99,
      images: ["/placeholder.svg"],
      category: "أزياء وملابس",
      tags: ["فستان", "تقليدي", "سوداني", "نسائي"],
      inventory: {
        quantity: 8,
        sku: "DRESS-TRD-008",
        lowStockThreshold: 2,
      },
      specifications: {
        المقاس: "متوسط (M)",
        المادة: "قطن طبيعي",
        اللون: "أزرق مع تطريز ذهبي",
        النوع: "فستان تقليدي",
      },
      status: "active",
      createdAt: "2024-02-15T12:00:00Z",
      updatedAt: "2024-02-25T10:45:00Z",
    },
    {
      id: "prod-009",
      storeId: "store-005",
      name: "شماغ سوداني أصلي",
      description:
        "شماغ سوداني تقليدي بنقوش أصيلة. قماش ناعم ومريح مناسب لجميع المناسبات.",
      price: 35.00,
      images: ["/placeholder.svg"],
      category: "أزياء وملابس",
      tags: ["شماغ", "سوداني", "تقليدي", "رجالي"],
      inventory: {
        quantity: 15,
        sku: "SHMG-TRD-009",
        lowStockThreshold: 3,
      },
      specifications: {
        المقاس: "120x120 سم",
        المادة: "قطن خالص",
        اللون: "أبيض وأحمر",
        النوع: "شماغ تقليدي",
      },
      status: "active",
      createdAt: "2024-02-18T09:30:00Z",
      updatedAt: "2024-02-28T15:20:00Z",
    },
    {
      id: "prod-010",
      storeId: "store-006",
      name: "عدس أحمر سوداني",
      description:
        "عدس أحمر من أجود الأنواع السودانية. غني بالبروتين والألياف الطبيعية.",
      price: 6.25,
      images: ["/placeholder.svg"],
      category: "أطعمة ومشروبات",
      tags: ["عدس", "أحمر", "سوداني", "بقوليات"],
      inventory: {
        quantity: 60,
        sku: "LENTIL-RED-010",
        lowStockThreshold: 15,
      },
      specifications: {
        الوزن: "1 كيلو",
        النوع: "عدس أحمر خالص",
        المنشأ: "شمال السودان",
        الصلاحية: "سنتان",
      },
      status: "active",
      createdAt: "2024-02-20T11:00:00Z",
      updatedAt: "2024-03-01T09:30:00Z",
    },
    {
      id: "prod-011",
      storeId: "store-006",
      name: "فول سوداني محمص",
      description:
        "فول سوداني محمص بطريقة تقليدية. وجبة خفيفة صحية ولذيذة من المكسرات السودانية.",
      price: 4.50,
      images: ["/placeholder.svg"],
      category: "أطعمة ومشروبات",
      tags: ["فول سوداني", "محمص", "مكسرات", "وجبة خفيفة"],
      inventory: {
        quantity: 75,
        sku: "PEANUT-RST-011",
        lowStockThreshold: 20,
      },
      specifications: {
        الوزن: "500 جرام",
        النوع: "محمص طبيعياً",
        المنشأ: "غرب السودان",
        الصلاحية: "6 أشهر",
      },
      status: "active",
      createdAt: "2024-02-22T14:00:00Z",
      updatedAt: "2024-03-02T16:45:00Z",
    },
    {
      id: "prod-012",
      storeId: "store-004",
      name: "خدمة تصميم موقع إلكتروني",
      description:
        "خدمة تصميم وتطوير موقع إلكتروني احترافي بأحدث التقنيات والمعايير العالمية.",
      price: 850.00,
      salePrice: 699.99,
      images: ["/placeholder.svg"],
      category: "خدمات تقنية",
      tags: ["تصميم", "موقع", "تطوير", "تقنية"],
      inventory: {
        quantity: 999,
        sku: "SERV-WEB-012",
        lowStockThreshold: 1,
      },
      specifications: {
        النوع: "خدمة تقنية",
        المدة: "2-4 أسابيع",
        التقنيات: "React, Node.js",
        الضمان: "سنة واحدة",
      },
      status: "active",
      createdAt: "2024-02-25T10:00:00Z",
      updatedAt: "2024-03-05T12:30:00Z",
    }
  ];

  static getProducts(storeId?: string): Product[] {
    try {
      const productsStr = localStorage.getItem(this.STORAGE_KEY);
      let products = productsStr ? JSON.parse(productsStr) : this.demoProducts;

      if (storeId) {
        products = products.filter(
          (product: Product) => product.storeId === storeId,
        );
      }

      return products;
    } catch {
      return storeId
        ? this.demoProducts.filter((p) => p.storeId === storeId)
        : this.demoProducts;
    }
  }

  static getProduct(id: string): Product | null {
    const products = this.getProducts();
    return products.find((product) => product.id === id) || null;
  }

  static saveProduct(product: Product): void {
    try {
      const products = this.getProducts();
      const existingIndex = products.findIndex((p) => p.id === product.id);

      if (existingIndex >= 0) {
        products[existingIndex] = {
          ...product,
          updatedAt: new Date().toISOString(),
        };
      } else {
        products.push({
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save product:", error);
      throw new Error("فشل في حفظ المنتج");
    }
  }

  static deleteProduct(id: string): void {
    try {
      const products = this.getProducts();
      const filteredProducts = products.filter((product) => product.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw new Error("فشل في حذف المنتج");
    }
  }

  static updateStock(id: string, quantity: number): void {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex >= 0) {
        products[productIndex].inventory.quantity = quantity;
        products[productIndex].status =
          quantity > 0 ? "active" : "out_of_stock";
        products[productIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
      throw new Error("فشل في تحديث المخزون");
    }
  }

  static searchProducts(query: string, storeId?: string): Product[] {
    const products = this.getProducts(storeId);
    const searchTerm = query.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        product.category.toLowerCase().includes(searchTerm),
    );
  }

  static getCategories(): string[] {
    const products = this.getProducts();
    const categories = products.map((product) => product.category);
    return [...new Set(categories)];
  }

  static getLowStockProducts(storeId?: string): Product[] {
    const products = this.getProducts(storeId);
    return products.filter(
      (product) =>
        product.inventory.quantity <= product.inventory.lowStockThreshold,
    );
  }

  static getProductsByStatus(
    status: Product["status"],
    storeId?: string,
  ): Product[] {
    const products = this.getProducts(storeId);
    return products.filter((product) => product.status === status);
  }

  static generateSKU(category: string, name: string): string {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const nameCode = name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${categoryCode}-${nameCode}-${timestamp}`;
  }

  static validateProduct(product: Partial<Product>): string[] {
    const errors: string[] = [];

    if (!product.name || product.name.trim().length < 3) {
      errors.push("اسم المنتج يجب أن يكون 3 أحرف على الأقل");
    }

    if (!product.description || product.description.trim().length < 10) {
      errors.push("وصف المنتج يجب أن يكون 10 أحرف على الأقل");
    }

    if (!product.price || product.price <= 0) {
      errors.push("سعر المنتج يجب أن يكون أكبر من صفر");
    }

    if (product.salePrice && product.salePrice >= product.price) {
      errors.push("سعر الخصم يجب أن يكون أقل من السعر الأصلي");
    }

    if (!product.category || product.category.trim().length === 0) {
      errors.push("فئة المنتج مطلوبة");
    }

    if (!product.images || product.images.length === 0) {
      errors.push("يجب إضافة صورة واحدة على الأقل");
    }

    if (!product.inventory?.quantity || product.inventory.quantity < 0) {
      errors.push("كمية المخزون يجب أن تكون صفر أ�� أكثر");
    }

    return errors;
  }
}

// React hook for product management
export const useProducts = (storeId?: string) => {
  const products = ProductService.getProducts(storeId);

  return {
    products,
    getProduct: ProductService.getProduct,
    saveProduct: ProductService.saveProduct,
    deleteProduct: ProductService.deleteProduct,
    updateStock: ProductService.updateStock,
    searchProducts: (query: string) =>
      ProductService.searchProducts(query, storeId),
    categories: ProductService.getCategories(),
    lowStockProducts: ProductService.getLowStockProducts(storeId),
    getProductsByStatus: (status: Product["status"]) =>
      ProductService.getProductsByStatus(status, storeId),
    generateSKU: ProductService.generateSKU,
    validateProduct: ProductService.validateProduct,
  };
};
