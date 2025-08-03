import { Product } from "../../shared/types";

export class ProductService {
  private static readonly STORAGE_KEY = "bayt_al_sudani_products";

  // المنتج الأصيل الوحيد لمطعم زول اقاشي
  private static demoProducts: Product[] = [
    {
      id: "prod-restaurant-real-001",
      storeId: "store-1753868707117-r80zjqevj",
      name: "طلب اقاشي فراخ وسط",
      description: "طلب اقاشي فراخ وسط أصيل من مطعم زول اقاشي - فراخ مشوي طازج بالطريقة السودانية التقليدية مع التوابل الخاصة والأرز الأبيض",
      price: 3.500,
      images: ["https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80"],
      category: "أطباق رئيسية",
      tags: ["اقاشي", "فراخ", "مشوي", "سوداني", "وسط"],
      inventory: {
        quantity: 50,
        sku: "GRILL-CHKN-001",
        lowStockThreshold: 10,
      },
      specifications: {
        الحجم: "وجبة وسط",
        المكونات: "فراخ مشوي، أرز أبيض، توابل سودانية خاصة، سلطة",
        "وقت التحضير": "25 دقيقة",
        "السعرات الحرارية": "520 سعرة",
        النوع: "مشوي على الفحم",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
  ];

  // حذف جميع المنتجات التجريبية والاحتفاظ بمنتجات زول اقاشي فقط
  static clearDemoProducts(): void {
    try {
      // الاحتفاظ بمنتجات زول اقاشي فقط
      const zoolProducts = this.demoProducts.filter(
        (product) => product.storeId === "store-1753868707117-r80zjqevj"
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(zoolProducts));
      console.log("تم حذف جميع المنتجات الت��ريبية والاحتفاظ بمنتجات زول اقاشي فقط");
    } catch (error) {
      console.error("خطأ في حذف المنتجات التجريبية:", error);
    }
  }

  // مسح جميع المنتجات وإعادة ضبط البيانات للمنتجات الأصلية فقط
  static clearAllProducts(): void {
    try {
      // حذف جميع البيانات من localStorage
      localStorage.removeItem(this.STORAGE_KEY);

      // إعادة تعيين المنتجات الأصلية فقط
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.demoProducts));

      console.log("تم مسح جميع المنتجات وإعادة ضبط البيانات للمنتجات الأصلية");

      // إعادة تحميل الصفحة لتطبيق التغييرات
      window.location.reload();
    } catch (error) {
      console.error("خطأ في مسح المنتجات:", error);
    }
  }

  static getProducts(storeId?: string): Product[] {
    try {
      const productsStr = localStorage.getItem(this.STORAGE_KEY);
      let products;

      if (!productsStr) {
        // Initialize localStorage with demo products if empty
        products = this.demoProducts;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      } else {
        products = JSON.parse(productsStr);
      }

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

    if (!product.description || product.description.trim().length === 0) {
      errors.push("وصف المنتج مطلوب");
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

    if (
      product.inventory?.quantity === undefined ||
      product.inventory.quantity < 0
    ) {
      errors.push("كمية المخزون يجب أن تكون صفر أو أكثر");
    }

    return errors;
  }

  // Get products with store information
  static getProductsWithStore(): Array<
    Product & { storeName?: string; storeCategory?: string }
  > {
    const products = this.getProducts();

    // Store information mapping
    const storeInfo: Record<string, { name: string; category: string }> = {
      "store-1753868707117-r80zjqevj": { name: "زول اقاشي", category: "restaurant" },
      "store-001": { name: "متجر التراث السوداني", category: "traditional" },
      "store-002": { name: "عطور الشرق", category: "perfumes" },
      "store-003": { name: "مطعم أم درمان", category: "food" },
      "store-004": { name: "خدمات التقنية السودانية", category: "services" },
      "store-005": { name: "أزياء النيل", category: "fashion" },
      "store-006": { name: "سوبر ماركت الخرطوم", category: "grocery" },
    };

    return products.map((product) => ({
      ...product,
      storeName: storeInfo[product.storeId]?.name || "متجر غير معروف",
      storeCategory: storeInfo[product.storeId]?.category || "other",
    }));
  }

  static getStoreNameById(storeId: string): string {
    const storeNames: Record<string, string> = {
      "store-1753868707117-r80zjqevj": "زول اقاشي",
      "store-001": "متجر التراث السوداني",
      "store-002": "عطور الشرق",
      "store-003": "مطعم أم درمان",
      "store-004": "خدمات التقنية السودانية",
      "store-005": "أزياء النيل",
      "store-006": "سوبر ماركت الخرطوم",
    };
    return storeNames[storeId] || "متجر غير معروف";
  }

  static getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      "عطور ومستحضرات": "🌹",
      "أطعمة ومشروبات": "🍯",
      "أطباق رئيسية": "🍽️",
      "مخبوزات": "🥖",
      "حلويات": "🍰", 
      "مشروبات": "☕",
      إكسسوارات: "👜",
      "أزياء وملابس": "👗",
      "خدمات تقنية": "💻",
    };
    return icons[category] || "📦";
  }

  static getStatusBadgeColor(status: Product["status"]): string {
    const colors: Record<string, string> = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      out_of_stock: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  }

  static getStatusText(status: Product["status"]): string {
    const texts: Record<string, string> = {
      active: "متوفر",
      inactive: "غير نشط",
      out_of_stock: "نفد المخزون",
    };
    return texts[status] || status;
  }

  // Add sample products for a restaurant
  static addSampleRestaurantProducts(storeId: string): void {
    const sampleProducts = [
      {
        id: `prod-${Date.now()}-1`,
        storeId: storeId,
        name: "طلب اقاشي فراخ وسط",
        description: "طلب اقاشي فراخ وسط أصيل من مطعم زول اقاشي - فراخ مشوي طازج بالطريقة السودانية التقليدية",
        price: 3.500,
        images: ["https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80"],
        category: "أطباق رئيسية",
        tags: ["اقاشي", "فراخ", "مشوي", "سوداني", "وسط"],
        inventory: {
          quantity: 50,
          sku: `GRILL-CHKN-${Date.now()}`,
          lowStockThreshold: 10,
        },
        specifications: {
          الحجم: "وجبة وسط",
          المكونات: "فراخ مشوي، أرز أبيض، توابل سودانية خاصة",
          "وقت التحضير": "25 دقيقة",
        },
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Add products to localStorage
    try {
      const existingProducts = this.getProducts();
      const allProducts = [...existingProducts, ...sampleProducts];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProducts));
    } catch (error) {
      console.error("Failed to add sample products:", error);
    }
  }
}

// React hook for product management
export const useProducts = (storeId?: string) => {
  const products = ProductService.getProducts(storeId);

  return {
    products,
    getProduct: (id: string) => ProductService.getProduct(id),
    saveProduct: (product: Product) => ProductService.saveProduct(product),
    deleteProduct: (id: string) => ProductService.deleteProduct(id),
    updateStock: (id: string, quantity: number) =>
      ProductService.updateStock(id, quantity),
    searchProducts: (query: string) =>
      ProductService.searchProducts(query, storeId),
    categories: ProductService.getCategories(),
    lowStockProducts: ProductService.getLowStockProducts(storeId),
    getProductsByStatus: (status: Product["status"]) =>
      ProductService.getProductsByStatus(status, storeId),
    generateSKU: (category: string, name: string) =>
      ProductService.generateSKU(category, name),
    validateProduct: (product: Partial<Product>) =>
      ProductService.validateProduct(product),
    clearDemoProducts: () => ProductService.clearDemoProducts(),
    clearAllProducts: () => ProductService.clearAllProducts(),
  };
};
