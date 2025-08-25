import { Router } from "express";
import { authenticateToken } from "./auth-dev";
import { StoreDatabase } from "../../lib/database";

const router = Router();

// Get restaurants (stores with type "restaurant") - يجب أن يكون قبل المسارات المتغيرة
router.get("/restaurants", async (req, res) => {
  try {
    const stores = StoreDatabase.getAllStores();
    const restaurants = stores.filter(
      (store: any) =>
        store.storeType === "restaurant" && store.status === "active",
    );
    res.json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Get companies (stores with type "company")
router.get("/companies", async (req, res) => {
  try {
    const stores = StoreDatabase.getAllStores();
    const companies = stores.filter(
      (store: any) =>
        store.storeType === "company" && store.status === "active",
    );
    res.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Get general stores (stores with type "store" or other types)
router.get("/general", async (req, res) => {
  try {
    const stores = StoreDatabase.getAllStores();
    const generalStores = stores.filter(
      (store: any) =>
        store.status === "active" &&
        (!store.storeType ||
          store.storeType === "store" ||
          !["restaurant", "company"].includes(store.storeType)),
    );
    res.json(generalStores);
  } catch (error) {
    console.error("Get general stores error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Get all stores (للمديرين وأصحاب المتاجر)
router.get("/", authenticateToken, async (req: any, res) => {
  try {
    // إذا كان ا��مستخدم تاجر، أرجع متاجره فقط
    if (req.user.role === "merchant") {
      const userStores = StoreDatabase.findStores(
        (store) => store.merchantId === req.user.id,
      );
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
    const store = StoreDatabase.findStore((s) => s.id === storeId);

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
      return res.status(403).json({ error: "يجب أن تكون تاجراً لإنشاء متجر" });
    }

    const {
      name,
      description,
      category,
      storeType,
      phone,
      email,
      address,
      city,
      country,
      workingHours,
      logo,
      banner,
      notificationSettings,
      shippingSettings,
    } = req.body;

    // طباعة البيانات المستلمة للتشخيص
    console.log("🔍 Create Store Request Data:", {
      name,
      category,
      phone,
      email,
      city,
      storeType,
      userId: req.user.id,
      userRole: req.user.role,
    });

    // التحقق من البيانات المطلوبة
    if (!name || !category || !phone || !email || !city) {
      console.error("❌ Missing required fields:", {
        name: !!name,
        category: !!category,
        phone: !!phone,
        email: !!email,
        city: !!city,
      });
      return res.status(400).json({
        error: "جميع الحقول الأساسية مطلوبة",
        requiredFields: ["name", "category", "phone", "email", "city"],
        receivedData: { name, category, phone, email, city },
      });
    }

    // التحقق من عدم و��ود متجر بنفس الاسم للتاجر
    const existingStore = StoreDatabase.findStore(
      (s) =>
        s.merchantId === req.user.id &&
        s.name.toLowerCase() === name.toLowerCase(),
    );

    console.log("🔍 Checking for existing store:", {
      searchingFor: name.toLowerCase(),
      merchantId: req.user.id,
      existingStore: existingStore
        ? {
            id: existingStore.id,
            name: existingStore.name,
            merchantId: existingStore.merchantId,
          }
        : null,
    });

    if (existingStore) {
      console.log("❌ Store already exists with same name");
      return res.status(400).json({
        error: "لديك متجر بنفس الاسم بالفعل",
        existingStoreName: existingStore.name,
        existingStoreId: existingStore.id,
      });
    }

    const newStore = {
      id: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      merchantId: req.user.id,
      name,
      description: description || "",
      category,
      storeType: storeType || "store",
      phone,
      email,
      address: address || "",
      city,
      country: country || "السودان",
      workingHours: workingHours || {
        start: "09:00",
        end: "17:00",
        days: [],
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
      store: savedStore,
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
    const store = StoreDatabase.findStore((s) => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    // التحقق من الصلا��يات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح ل�� بتعديل هذا المتجر" });
    }

    const {
      name,
      description,
      category,
      storeType,
      phone,
      email,
      address,
      city,
      country,
      workingHours,
      logo,
      banner,
      notificationSettings,
      shippingSettings,
    } = req.body;

    // طباعة البيانات المستلمة للتشخيص
    console.log("🔍 Update Store Request Data:", {
      storeId,
      name,
      category,
      phone,
      email,
      city,
      storeType,
      userId: req.user.id,
      userRole: req.user.role,
    });

    // التحقق من البيانات المطلوبة للتحديث
    if (!name || !category || !phone || !email || !city) {
      return res.status(400).json({
        error: "جميع الحقول الأساسية مطلوبة للتحديث",
        requiredFields: ["name", "category", "phone", "email", "city"],
        receivedData: { name, category, phone, email, city },
      });
    }

    // التحقق من عدم وجود متجر آخر بنفس الاسم (ما عدا المتجر الحالي)
    const duplicateStore = StoreDatabase.findStore(
      (s) =>
        s.merchantId === req.user.id &&
        s.id !== storeId &&
        s.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicateStore) {
      console.log("❌ Another store exists with same name during update");
      return res.status(400).json({
        error: "لديك متجر آخر بنفس الاسم. يرجى اختيار اسم مختلف.",
        duplicateStoreName: duplicateStore.name,
        duplicateStoreId: duplicateStore.id,
      });
    }

    // تحديث بيانات المتجر
    const updates = {
      name: name || store.name,
      description: description !== undefined ? description : store.description,
      category: category || store.category,
      storeType: storeType || store.storeType || "store",
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

    const updatedStore = StoreDatabase.updateStore(storeId, updates);

    console.log(`✅ تم تحديث متج��: ${updatedStore.name}`);

    res.json({
      message: "تم تحديث بيانات المتجر بنجاح",
      store: updatedStore,
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
    const store = StoreDatabase.findStore((s) => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بحذف هذا المتجر" });
    }

    const deletedStore = StoreDatabase.deleteStore(storeId);

    console.log(`✅ تم حذف متجر: ${deletedStore.name}`);

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
    const store = StoreDatabase.findStore((s) => s.id === storeId);

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
      conversionRate:
        store.analytics?.totalViews > 0
          ? (
              ((store.analytics?.totalOrders || 0) /
                store.analytics.totalViews) *
              100
            ).toFixed(2)
          : "0.00",
      averageOrderValue:
        store.analytics?.totalOrders > 0
          ? (
              (store.analytics?.totalRevenue || 0) / store.analytics.totalOrders
            ).toFixed(2)
          : "0.00",
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
    const store = StoreDatabase.findStore((s) => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "المتجر غير موجود" });
    }

    if (!["active", "inactive", "pending", "suspended"].includes(status)) {
      return res.status(400).json({ error: "حالة المتجر غير صحيحة" });
    }

    const updatedStore = StoreDatabase.updateStore(storeId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ تم تحديث حالة متجر ${updatedStore.name} إلى: ${status}`);

    res.json({
      message: "تم تحديث حالة المتجر بنجاح",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Update store status error:", error);
    res.status(500).json({ error: "خطأ في ��لخادم" });
  }
});

// Get store recent orders
router.get("/:id/orders", authenticateToken, async (req: any, res) => {
  try {
    const storeId = req.params.id;
    const store = StoreDatabase.findStore((s) => s.id === storeId);

    if (!store) {
      return res.status(404).json({ error: "ا��متجر غير موجود" });
    }

    // التحقق من الصلاحيات
    if (req.user.role !== "super_admin" && store.merchantId !== req.user.id) {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    // تحميل الطلبات الحقيقية من قاعدة البيانات
    const fs = await import("fs");
    const path = await import("path");

    const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
    let allOrders = [];

    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, "utf8");
        allOrders = JSON.parse(data);
      }
    } catch (error) {
      console.error("خطأ في تحميل الطلبات:", error);
    }

    // تصفية الطلبات لهذا المتجر فقط
    const storeOrders = allOrders.filter(
      (order: any) => order.storeId === storeId,
    );

    // أخذ أحدث 5 طلبات وإضافة حقل الوقت ال��سبي
    const recentOrders = storeOrders
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((order: any) => {
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        let timeAgo;
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          timeAgo = `منذ ${diffInMinutes} دقيقة`;
        } else if (diffInHours < 24) {
          timeAgo = `منذ ${diffInHours} ساعة`;
        } else if (diffInDays === 1) {
          timeAgo = "أمس";
        } else if (diffInDays < 7) {
          timeAgo = `منذ ${diffInDays} أيام`;
        } else {
          timeAgo = createdAt.toLocaleDateString("ar");
        }

        return {
          id: order.id,
          customer: order.customerInfo.name,
          items: order.items.length,
          total: order.pricing.total,
          status: order.status,
          time: timeAgo,
          date: order.createdAt,
        };
      });

    res.json(recentOrders);
  } catch (error) {
    console.error("Get store orders error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export { router as storesRoutes };
