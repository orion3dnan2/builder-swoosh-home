import { Product } from "../../shared/types";

export class ProductService {
  private static readonly STORAGE_KEY = "bayt_al_sudani_products";

  // Only زول اقاشي restaurant products with real images
  private static demoProducts: Product[] = [
    {
      id: "prod-restaurant-real-001",
      storeId: "store-1753868707117-r80zjqevj",
      name: "ملوخية سودانية",
      description:
        "ملوخية سودانية أصيلة مطبوخة بالطريقة التقليدية مع اللحم الطازج والتوابل السودانية الأصيلة. طبق شعبي مشهور من المطبخ السوداني",
      price: 25.0,
      images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80"],
      category: "أطباق رئيسية",
      tags: ["ملوخية", "سوداني", "تقليدي", "لحم"],
      inventory: {
        quantity: 20,
        sku: "MEAL-MLW-001",
        lowStockThreshold: 5,
      },
      specifications: {
        الحجم: "طبق كبير",
        المكونات: "ملوخية، لحم، توابل سودانية",
        "وقت التحضير": "20 دقيقة",
        "السعرات الحرارية": "380 سعرة",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "prod-restaurant-real-002",
      storeId: "store-1753868707117-r80zjqevj",
      name: "قراصة سودانية",
      description: "خبز قراصة سوداني تقليدي مخبوز طازج يومياً من الدقيق المحلي الفاخر. يُقدم ساخن مع الوجبات الرئيسية",
      price: 8.0,
      images: ["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80"],
      category: "مخبوزات",
      tags: ["قراصة", "خبز", "سوداني", "طازج"],
      inventory: {
        quantity: 30,
        sku: "BREAD-QRS-002",
        lowStockThreshold: 10,
      },
      specifications: {
        النوع: "خبز تقليدي",
        الحجم: "قطعة واحدة",
        المدة: "طازج يومياً",
        الوزن: "150 جرام",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "prod-restaurant-real-003",
      storeId: "store-1753868707117-r80zjqevj",
      name: "عصيدة بالملبن",
      description: "عصيدة سودانية تقليدية بالملبن الطازج والعسل الطبيعي - حلو شعبي أصيل محضر بالطريقة التراثية",
      price: 18.0,
      salePrice: 15.0,
      images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"],
      category: "حلويات",
      tags: ["عصيدة", "ملبن", "سوداني", "حلو"],
      inventory: {
        quantity: 15,
        sku: "DESS-ASD-003",
        lowStockThreshold: 5,
      },
      specifications: {
        النوع: "حلو تقليدي",
        المكونات: "عصيدة، ملبن، عسل طبيعي",
        الحجم: "كوب متوسط",
        "السعرات الحرارية": "250 سعرة",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "prod-restaurant-real-004",
      storeId: "store-1753868707117-r80zjqevj",
      name: "شاي كشري سوداني",
      description: "شاي سوداني أحمر تقليدي معد بالطريقة الأصيلة مع الحليب والسكر والهيل. مشروب شعبي مميز",
      price: 5.0,
      images: ["https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80"],
      category: "مشروبات",
      tags: ["شاي", "كشري", "سوداني", "ساخن"],
      inventory: {
        quantity: 50,
        sku: "TEA-KSH-004",
        lowStockThreshold: 10,
      },
      specifications: {
        النوع: "مشروب ساخن",
        الحجم: "كوب",
        المكونات: "شاي أحمر، حليب، سكر، هيل",
        "درجة الحرارة": "ساخن",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "prod-restaurant-real-005",
      storeId: "store-1753868707117-r80zjqevj",
      name: "فول سوداني مدمس",
      description: "فول سوداني مدمس بالطريقة التقليدية مع الطحينة والسلطة والبصل والطماطم. إفطار شعبي مغذي",
      price: 12.0,
      images: ["https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&q=80"],
      category: "أطباق رئيسية",
      tags: ["فول", "مدمس", "سوداني", "طحينة"],
      inventory: {
        quantity: 25,
        sku: "MEAL-FUL-005",
        lowStockThreshold: 5,
      },
      specifications: {
        الحجم: "طبق متوسط",
        المكونات: "فول، طحينة، سلطة، خبز، بصل، طماطم",
        "وقت التحضير": "15 دقيقة",
        "السعرات الحرارية": "320 سعرة",
      },
      status: "active",
      createdAt: "2025-01-30T10:00:00Z",
      updatedAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "prod-restaurant-real-006",
      storeId: "store-1753868707117-r80zjqevj",
      name: "مشروب كركديه طازج",
      description: "مشروب كركديه طبيعي طازج من أجود أنواع الكركديه السوداني - بارد ومنعش مثالي للطقس الحار",
      price: 7.0,
      images: ["https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80"],
      category: "مشروبات",
      tags: ["كركديه", "طبيعي", "بارد", "منعش"],
      inventory: {
        quantity: 40,
        sku: "DRINK-KRK-006",
        lowStockThreshold: 8,
      },
      specifications: {
        النوع: "مشروب بارد",
        الحجم: "كوب كبير",
        المكونات: "كركديه طبيعي، سكر، ثلج",
        "درجة الحرارة": "بارد",
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
      console.log("تم حذف جميع المنتجات التجريبية والاحتفاظ بمنتجات زول اقاشي فقط");
    } catch (error) {
      console.error("خطأ في حذف المنتجات التجريبية:", error);
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
        name: "ملوخية سودانية",
        description: "ملوخية سودانية أصيلة مطبوخة بالطريقة التقليدية مع اللحم",
        price: 25.0,
        images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80"],
        category: "أطباق رئيسية",
        tags: ["ملوخية", "سوداني", "تقليدي", "لحم"],
        inventory: {
          quantity: 20,
          sku: `MEAL-MLW-${Date.now()}`,
          lowStockThreshold: 5,
        },
        specifications: {
          الحجم: "طبق كبير",
          المكونات: "ملوخية، لحم، توابل سودانية",
          "وقت التحضير": "20 دقيقة",
        },
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `prod-${Date.now()}-2`,
        storeId: storeId,
        name: "قراصة سودانية",
        description: "خبز قراصة سوداني تقليدي مخبوز طازج",
        price: 8.0,
        images: ["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80"],
        category: "مخبوزات",
        tags: ["قراصة", "خبز", "سوداني", "طازج"],
        inventory: {
          quantity: 30,
          sku: `BREAD-QRS-${Date.now()}`,
          lowStockThreshold: 10,
        },
        specifications: {
          النوع: "خبز تقليدي",
          الحجم: "قطعة واحدة",
          المدة: "طازج يومياً",
        },
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `prod-${Date.now()}-3`,
        storeId: storeId,
        name: "عصيدة بالملبن",
        description: "عصيدة سودانية تقليدية بالملبن الطازج",
        price: 18.0,
        salePrice: 15.0,
        images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"],
        category: "حلويات",
        tags: ["عصيدة", "ملبن", "سوداني", "حلو"],
        inventory: {
          quantity: 15,
          sku: `DESS-ASD-${Date.now()}`,
          lowStockThreshold: 5,
        },
        specifications: {
          النوع: "حلو تقليدي",
          المكونات: "عصيدة، ملبن، سكر",
          الحجم: "كوب متوسط",
        },
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `prod-${Date.now()}-4`,
        storeId: storeId,
        name: "شاي كشري سوداني",
        description: "شاي سوداني أحمر مع الحليب والسكر",
        price: 5.0,
        images: ["https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80"],
        category: "مشروبات",
        tags: ["شاي", "كشري", "سوداني", "ساخن"],
        inventory: {
          quantity: 50,
          sku: `TEA-KSH-${Date.now()}`,
          lowStockThreshold: 10,
        },
        specifications: {
          النوع: "مشروب ساخن",
          الحجم: "كوب",
          المك��نات: "شاي، حليب، سكر",
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
  };
};
