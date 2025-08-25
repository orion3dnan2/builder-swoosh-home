import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserDatabase } from "../../lib/database";

const router = Router();

// JWT secret - في الإنتاج يجب أن يكون في متغيرات البيئة
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware للتحقق من صحة الرمز المميز
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { username, password, platform = "web" } = req.body;

    console.log(`🔐 محاولة تسجيل دخول: ${username}`);
    console.log(
      `🔑 كلمة المرور المدخلة: "${password}" (length: ${password.length})`,
    );

    // تحويل الأحرف العربية إلى إنجليزية إذا لزم الأمر (مشكلة لوحة المفاتيح العربية)
    const arabicToEnglishMap: { [key: string]: string } = {
      // الأحرف الأساسية
      ع: "u",
      س: "s",
      ث: "e",
      ق: "r",
      ف: "f",
      غ: "g",
      ه: "h",
      ج: "j",
      ك: "k",
      ل: "l",
      ا: "a",
      د: "d",
      ذ: "z",
      ر: "r",
      ز: "z",
      ت: "t",
      ي: "y",
      ب: "b",
      ن: "n",
      م: "m",
      و: "w",
      ء: "x",
      ح: "c",
      خ: "v",
      ص: "p",
      ض: "o",
      // الأرقام العربية
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
      "٠": "0",
    };

    let normalizedPassword = password;
    for (const [arabic, english] of Object.entries(arabicToEnglishMap)) {
      normalizedPassword = normalizedPassword.replace(
        new RegExp(arabic, "g"),
        english,
      );
    }

    console.log(`🔄 كلمة المرور بعد التحويل: "${normalizedPassword}"`);

    // البحث عن المستخدم في قاعدة البيانات
    const user = UserDatabase.findUser(
      (u) => u.username === username || u.email === username,
    );

    if (!user) {
      console.log(`❌ المستخدم غير موجود: ${username}`);
      return res
        .status(401)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    console.log(
      `✅ المستخدم موجود: ${user.username}, كلمة المرور المحفوظة: ${user.password}`,
    );

    // التحقق من حالة المستخدم
    if (!user.isActive) {
      return res
        .status(401)
        .json({ error: "تم إيقاف الحساب، تواصل مع الإدارة" });
    }

    // التحقق من كلمة المرور
    let isPasswordValid = false;

    // إذا كانت كلمة المرور تبدأ بـ $2b$ فهي مشفرة، وإلا فهي بسيطة
    if (user.password.startsWith("$2b$")) {
      try {
        isPasswordValid = await bcrypt.compare(
          normalizedPassword,
          user.password,
        );
      } catch (bcryptError) {
        console.error("خطأ في فك تشفير كلمة المرور:", bcryptError);
        isPasswordValid = false;
      }
    } else {
      // كلمة مرور بسيطة للتجربة - تجربة كلا النسختين
      isPasswordValid =
        normalizedPassword === user.password || password === user.password;
    }

    console.log(`🔍 نتيجة التحقق من كلمة المرور: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`❌ كلمة المرور غير صحيحة للمستخدم: ${username}`);
      console.log(
        `❌ المطلوب: "${user.password}", المستلم: "${password}", المحول: "${normalizedPassword}"`,
      );
      return res
        .status(401)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    console.log(`✅ تم تسجيل الدخول بنجاح للمستخدم: ${username}`);

    // تحديث آخر تسجيل دخول
    UserDatabase.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    });

    // إنشاء رمز الوصول
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        platform,
      },
      JWT_SECRET,
      { expiresIn: platform === "mobile" ? "30d" : "7d" },
    );

    // إرجاع بيانات المستخدم والرمز
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
      platform,
      expiresIn: platform === "mobile" ? "30d" : "7d",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      password,
      accountType = "customer",
      platform = "web",
      country,
      city,
      businessName,
      businessType,
    } = req.body;

    // التحقق من البيانات
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    // التحقق من وجود المستخدم
    const existingUser = UserDatabase.findUser(
      (u) => u.email === email || u.username === username,
    );
    if (existingUser) {
      return res.status(400).json({ error: "المستخدم موجود بالفعل" });
    }

    // التحقق من حقول التاجر إذا كان نوع الحساب تاجر
    if (accountType === "merchant") {
      if (!businessName || !businessType) {
        return res.status(400).json({ error: "بيانات العمل التجاري مطلوبة" });
      }
    }

    // إنشاء مستخدم جديد
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: username,
      email,
      password: hashedPassword,
      role: accountType === "merchant" ? "merchant" : "customer",
      profile: {
        name: fullName,
        phone,
        country: country || "السودان",
        city: city || "",
        language: "ar",
        avatar: "/placeholder.svg",
        ...(accountType === "merchant" && {
          businessName,
          businessType,
        }),
      },
      permissions:
        accountType === "merchant"
          ? [
              { resource: "store", actions: ["read", "write", "delete"] },
              { resource: "products", actions: ["read", "write", "delete"] },
            ]
          : [{ resource: "profile", actions: ["read", "write"] }],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // حفظ المستخدم ف�� قاعدة البيانات الدائمة
    const savedUser = UserDatabase.addUser(newUser);

    console.log(`✅ تم إنشاء مستخدم جديد: ${username} (${accountType})`);

    // إنشاء رمز الوصول
    const token = jwt.sign(
      {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
        platform,
      },
      JWT_SECRET,
      { expiresIn: platform === "mobile" ? "30d" : "7d" },
    );

    const { password: _, ...userWithoutPassword } = savedUser;
    res.status(201).json({
      user: userWithoutPassword,
      token,
      platform,
      message: "تم إنشاء الحساب بنجاح وحفظه في قاعدة البيانات",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// تحديث الرمز المميز
router.post("/refresh", authenticateToken, (req: any, res) => {
  const { user } = req;
  const platform = req.headers["x-platform"] || "web";

  const newToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      platform,
    },
    JWT_SECRET,
    { expiresIn: platform === "mobile" ? "30d" : "7d" },
  );

  res.json({ token: newToken });
});

// الحصول على بيانات المستخدم الحالي
router.get("/me", authenticateToken, async (req: any, res) => {
  try {
    const user = UserDatabase.findUser((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// تسجيل الخروج
router.post("/logout", authenticateToken, (req: any, res) => {
  // في التطبيق الحقيقي، يمكن إضافة الرمز إلى ق��ئمة سوداء
  res.json({ message: "تم تسجيل الخروج بنجاح" });
});

// إحصائيات المستخدمين (للمديرين فقط)
router.get("/stats", authenticateToken, (req: any, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    const allUsers = UserDatabase.getAllUsers();
    const stats = {
      total: allUsers.length,
      active: allUsers.filter((u) => u.isActive).length,
      merchants: allUsers.filter((u) => u.role === "merchant").length,
      customers: allUsers.filter((u) => u.role === "customer").length,
      admins: allUsers.filter((u) => u.role === "super_admin").length,
      recentRegistrations: allUsers.filter((u) => {
        const registrationDate = new Date(u.createdAt);
        const daysSince =
          (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      }).length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export { router as authDevRoutes };
