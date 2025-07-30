import { Router } from "express";
import { authenticateToken } from "./auth-dev";
import { StoreDatabase } from "../../lib/database";

const router = Router();

// Get all stores (للمديرين وأصحاب المتاجر)
router.get("/", authenticateToken, async (req: any, res) => {
  try {
    // إذا كان المستخدم تاجر، أرجع متاجره فقط
    if (req.user.role === "merchant") {
      const userStores = StoreDatabase.findStores(store => store.merchantId === req.user.id);
      return res.json(userStores);
    }

    // إذا كان مدير، أرجع جميع المتاجر
    if (req.user.role === "super_admin") {
      return res.json(StoreDatabase.getAllStores());
    }

    res.status(403).json({ error: "غير مصرح لك بالوصول" });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Get single store
router.get("/:id", authenticateToken, async (req: any, res) => {
  try {
    const storeId = req.params.id;
    const store = StoreDatabase.findStore(s => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    res.json(store);
  } catch (error) {
    console.error("Get store error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Create new store
router.post("/", authenticateToken, async (req: any, res) => {
  try {
    // التأكد أن المستخدم تاجر
    if (req.user.role !== "merchant") {
      return res.status(403).json({ error: "يجب أن تكون تاجراً لإنشا�� متجر" });
    }

    const {
      name,
      description,
      category,
      phone,
      email,
      address,
      city,
      country,
      workingHours,
      logo,
      banner,
      notificationSettings,
      shippingSettings
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !category || !phone || !email || !city) {
      return res.status(400).json({ error: "جميع الحقول الأساسية مطلوبة" });
    }

    // التحقق من عدم وجود متجر بنفس الاسم للتاجر
    const existingStore = StoreDatabase.findStore(s =>
      s.merchantId === req.user.id && s.name.toLowerCase() === name.toLowerCase()
    );

    if (existingStore) {
      return res.status(400).json({ error: "لديك متجر بنفس الاسم بالفعل" });
    }

    const newStore = {
      id: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      merchantId: req.user.id,
      name,
      description: description || "",
      category,
      phone,
      email,
      address: address || "",
      city,
      country: country || "السودان",
      workingHours: workingHours || {
        start: "09:00",
        end: "17:00",
        days: []
      },
      logo: logo || "/placeholder.svg",
      banner: banner || "/placeholder.svg",
      status: "active",
      notificationSettings: notificationSettings || {
        newOrders: true,
        orderUpdates: true,
        paymentReceived: true,
        lowStock: true,
        reviews: true,
        promotions: false,
        smsNotifications: false,
        emailNotifications: true,
      },
      shippingSettings: shippingSettings || {
        freeShippingThreshold: 100,
        standardShippingCost: 15,
        expressShippingCost: 30,
        processingTime: "1-3 أيام عمل",
        shippingAreas: [],
      },
      analytics: {
        totalViews: 0,
        totalOrders: 0,
        totalRevenue: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedStore = StoreDatabase.addStore(newStore);

    console.log(`✅ تم إنشاء متجر جديد: ${name} للتاجر ${req.user.username}`);

    res.status(201).json({
      message: "تم إنشاء المتجر بنجاح وحفظه في قاعدة البيانات",
      store: savedStore
    });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Update store
router.put("/:id", authenticateToken, async (req: any, res) => {
  try {
    const storeId = req.params.id;
    const storeIndex = stores.findIndex(s => s.id === storeId);

    if (storeIndex === -1) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    const store = stores[storeIndex];

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بتعديل هذا المتجر" });
    }

    const {
      name,
      description,
      category,
      phone,
      email,
      address,
      city,
      country,
      workingHours,
      logo,
      banner,
      notificationSettings,
      shippingSettings
    } = req.body;

    // تحديث بيانات المتجر
    const updatedStore = {
      ...store,
      name: name || store.name,
      description: description !== undefined ? description : store.description,
      category: category || store.category,
      phone: phone || store.phone,
      email: email || store.email,
      address: address !== undefined ? address : store.address,
      city: city || store.city,
      country: country || store.country,
      workingHours: workingHours || store.workingHours,
      logo: logo || store.logo,
      banner: banner || store.banner,
      notificationSettings: notificationSettings || store.notificationSettings,
      shippingSettings: shippingSettings || store.shippingSettings,
      updatedAt: new Date().toISOString(),
    };

    stores[storeIndex] = updatedStore;

    res.json({
      message: "تم تحديث بيانات المتجر بنجاح",
      store: updatedStore
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Delete store
router.delete("/:id", authenticateToken, async (req: any, res) => {
  try {
    const storeId = req.params.id;
    const storeIndex = stores.findIndex(s => s.id === storeId);

    if (storeIndex === -1) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    const store = stores[storeIndex];

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بحذف هذا المتجر" });
    }

    stores.splice(storeIndex, 1);

    res.json({ message: "تم حذف المتجر بنجاح" });
  } catch (error) {
    console.error("Delete store error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Get store analytics
router.get("/:id/analytics", authenticateToken, async (req: any, res) => {
  try {
    const storeId = req.params.id;
    const store = stores.find(s => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    const analytics = {
      totalViews: store.analytics?.totalViews || 0,
      totalOrders: store.analytics?.totalOrders || 0,
      totalRevenue: store.analytics?.totalRevenue || 0,
      monthlyStats: store.analytics?.monthlyStats || [],
      // إحصائيات إضافية
      conversionRate: store.analytics?.totalViews > 0 
        ? ((store.analytics?.totalOrders || 0) / store.analytics.totalViews * 100).toFixed(2)
        : "0.00",
      averageOrderValue: store.analytics?.totalOrders > 0
        ? ((store.analytics?.totalRevenue || 0) / store.analytics.totalOrders).toFixed(2)
        : "0.00"
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get store analytics error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Update store status (للمديرين فقط)
router.patch("/:id/status", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    const storeId = req.params.id;
    const { status } = req.body;
    const storeIndex = stores.findIndex(s => s.id === storeId);

    if (storeIndex === -1) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    if (!["active", "inactive", "pending", "suspended"].includes(status)) {
      return res.status(400).json({ error: "حالة المتجر غير صحيحة" });
    }

    stores[storeIndex].status = status;
    stores[storeIndex].updatedAt = new Date().toISOString();

    res.json({
      message: "تم تحديث حالة المتجر بنجاح",
      store: stores[storeIndex]
    });
  } catch (error) {
    console.error("Update store status error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export { router as storesRoutes };
