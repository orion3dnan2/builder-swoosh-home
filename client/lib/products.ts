import { Product } from '../../shared/types';

export class ProductService {
  private static readonly STORAGE_KEY = 'bayt_al_sudani_products';

  // Demo products for development
  private static demoProducts: Product[] = [
    {
      id: 'prod-001',
      storeId: 'store-001',
      name: 'عطر صندل سوداني أصلي',
      description: 'عطر صندل طبيعي من السودان بأجود الخامات. رائحة فواحة تدوم طويلاً مع خليط من الورود السودانية الأصيلة.',
      price: 45.00,
      salePrice: 39.99,
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400'
      ],
      category: 'عطور ومستحضرات',
      tags: ['عطر', 'صندل', 'سوداني', 'طبيعي'],
      inventory: {
        quantity: 25,
        sku: 'PER-SDL-001',
        lowStockThreshold: 5
      },
      specifications: {
        'الحجم': '50 مل',
        'النوع': 'عطر زيتي',
        'المنشأ': 'السودان',
        'التركيز': '20%'
      },
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'prod-002',
      storeId: 'store-001',
      name: 'كركديه سوداني طبيعي',
      description: 'كركديه طبيعي من أجود أنواع الكركديه السوداني. غني بالفيتامينات ومضادات الأكسدة.',
      price: 15.50,
      images: [
        'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400'
      ],
      category: 'أطعمة ومشروبات',
      tags: ['كركديه', 'طبيعي', 'صحي', 'سوداني'],
      inventory: {
        quantity: 50,
        sku: 'BEV-HIB-002',
        lowStockThreshold: 10
      },
      specifications: {
        'الوزن': '500 جرام',
        'النوع': 'مجفف طبيعي',
        'المنشأ': 'شمال السودان',
        'الصلاحية': 'سنتان'
      },
      status: 'active',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: 'prod-003',
      storeId: 'store-001',
      name: 'حقيبة جلدية سودانية',
      description: 'حقيبة يد نسائية من الجلد السوداني الأصلي. تصميم عصري مع لمسة تراثية سودانية.',
      price: 89.99,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      ],
      category: 'إكسسوارات',
      tags: ['حقيبة', 'جلد', 'نسائي', 'سوداني'],
      inventory: {
        quantity: 0,
        sku: 'ACC-BAG-003',
        lowStockThreshold: 3
      },
      specifications: {
        'المقاس': '30x25x10 سم',
        'المادة': 'جلد طبيعي',
        'اللون': 'بني',
        'الإغلاق': 'سوستة'
      },
      status: 'out_of_stock',
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-25T09:15:00Z'
    }
  ];

  static getProducts(storeId?: string): Product[] {
    try {
      const productsStr = localStorage.getItem(this.STORAGE_KEY);
      let products = productsStr ? JSON.parse(productsStr) : this.demoProducts;
      
      if (storeId) {
        products = products.filter((product: Product) => product.storeId === storeId);
      }
      
      return products;
    } catch {
      return storeId ? this.demoProducts.filter(p => p.storeId === storeId) : this.demoProducts;
    }
  }

  static getProduct(id: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  static saveProduct(product: Product): void {
    try {
      const products = this.getProducts();
      const existingIndex = products.findIndex(p => p.id === product.id);
      
      if (existingIndex >= 0) {
        products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
      } else {
        products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save product:', error);
      throw new Error('فشل في حفظ المنتج');
    }
  }

  static deleteProduct(id: string): void {
    try {
      const products = this.getProducts();
      const filteredProducts = products.filter(product => product.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('فشل في حذف المنتج');
    }
  }

  static updateStock(id: string, quantity: number): void {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex >= 0) {
        products[productIndex].inventory.quantity = quantity;
        products[productIndex].status = quantity > 0 ? 'active' : 'out_of_stock';
        products[productIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
      throw new Error('فشل في تحديث المخزون');
    }
  }

  static searchProducts(query: string, storeId?: string): Product[] {
    const products = this.getProducts(storeId);
    const searchTerm = query.toLowerCase();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  static getCategories(): string[] {
    const products = this.getProducts();
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
  }

  static getLowStockProducts(storeId?: string): Product[] {
    const products = this.getProducts(storeId);
    return products.filter(product => 
      product.inventory.quantity <= product.inventory.lowStockThreshold
    );
  }

  static getProductsByStatus(status: Product['status'], storeId?: string): Product[] {
    const products = this.getProducts(storeId);
    return products.filter(product => product.status === status);
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
      errors.push('اسم المنتج يجب أن يكون 3 أحرف على الأقل');
    }

    if (!product.description || product.description.trim().length < 10) {
      errors.push('وصف المنتج يجب أن يكون 10 أحرف على الأقل');
    }

    if (!product.price || product.price <= 0) {
      errors.push('سعر المنتج يجب أن يكون أكبر من صفر');
    }

    if (product.salePrice && product.salePrice >= product.price) {
      errors.push('سعر الخصم يجب أن يكون أقل من السعر الأصلي');
    }

    if (!product.category || product.category.trim().length === 0) {
      errors.push('فئة المنتج مطلوبة');
    }

    if (!product.images || product.images.length === 0) {
      errors.push('يجب إضافة صورة واحدة على الأقل');
    }

    if (!product.inventory?.quantity || product.inventory.quantity < 0) {
      errors.push('كمية المخزون يجب أن تكون صفر أو أكثر');
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
    searchProducts: (query: string) => ProductService.searchProducts(query, storeId),
    categories: ProductService.getCategories(),
    lowStockProducts: ProductService.getLowStockProducts(storeId),
    getProductsByStatus: (status: Product['status']) => ProductService.getProductsByStatus(status, storeId),
    generateSKU: ProductService.generateSKU,
    validateProduct: ProductService.validateProduct
  };
};
