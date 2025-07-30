import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

// JWT secret - في الإنتاج يجب أن يكون في متغيرات البيئة
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Demo users database (للتطوير فقط)
const users = [
  {
    id: "admin-001",
    username: "admin",
    email: "admin@baytsudani.com",
    password: "$2b$10$hashed_password", // استخدم bcrypt للتشفير
    role: "super_admin",
    profile: {
      name: "مدير التطبيق",
      language: "ar",
      avatar: "/placeholder.svg",
    },
    permissions: [{ resource: "*", actions: ["*"] }],
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

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

    // البحث عن المستخدم
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res
        .status(401)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    // التحقق من كلمة المرور (في هذا المثال نستخدم كلمة مرور بسيطة)
    if (password !== username) {
      return res
        .status(401)
        .json({ error: "اسم المستخدم ��و كلمة المرور غير صحيحة" });
    }

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
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// باقي الدوال...
router.post("/register", async (req, res) => {
  res.status(501).json({ error: "التسجيل غير متاح في وضع التطوير" });
});

router.post("/refresh", authenticateToken, (req: any, res) => {
  res.json({ token: "dev-token" });
});

router.get("/me", authenticateToken, (req: any, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "المستخدم غير موجود" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.post("/logout", authenticateToken, (req: any, res) => {
  res.json({ message: "تم تسجيل الخروج بنجاح" });
});

export { router as authDevRoutes };
