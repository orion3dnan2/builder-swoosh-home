import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// JWT secret - في الإنتاج يجب أن يكون في متغيرات البيئة
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Demo users database (في التطبيق الحقيقي استخدم قاعدة بيانات)
const users = [
  {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@baytsudani.com',
    password: '$2b$10$hashed_password', // استخدم bcrypt للتشفير
    role: 'super_admin',
    profile: {
      name: 'مدير التطبيق',
      language: 'ar',
      avatar: '/placeholder.svg',
    },
    permissions: [{ resource: '*', actions: ['*'] }],
    createdAt: new Date().toISOString(),
    isActive: true,
  }
];

// Middleware للتحقق من صحة الرمز المميز
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { username, password, platform = 'web' } = req.body;

    // البحث عن المستخدم
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // التحقق من كلمة المرور (في هذا المثال نستخدم كلمة مرور بسيطة)
    if (password !== username) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء رمز الوصول
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        platform 
      },
      JWT_SECRET,
      { expiresIn: platform === 'mobile' ? '30d' : '7d' }
    );

    // إرجاع بيانات المستخدم والرمز
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
      platform,
      expiresIn: platform === 'mobile' ? '30d' : '7d'
    });

  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      password,
      accountType = 'customer',
      platform = 'web',
      country,
      city,
      businessName,
      businessType
    } = req.body;

    // التحقق من البيانات
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من وجود المستخدم
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'المستخدم موجود بالفعل' });
    }

    // التحقق من حقول التاجر إذا كان نوع الحساب تاجر
    if (accountType === 'merchant') {
      if (!businessName || !businessType) {
        return res.status(400).json({ error: 'بيانات العمل التجاري مطلوبة' });
      }
    }

    // إنشاء مستخدم جديد
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      username: username,
      email,
      password: hashedPassword,
      role: accountType === 'merchant' ? 'merchant' : 'customer',
      profile: {
        name: fullName,
        phone,
        country,
        city,
        language: 'ar',
        avatar: '/placeholder.svg',
        ...(accountType === 'merchant' && {
          businessName,
          businessType,
        }),
      },
      permissions: accountType === 'merchant'
        ? [
            { resource: 'store', actions: ['read', 'write', 'delete'] },
            { resource: 'products', actions: ['read', 'write', 'delete'] },
          ]
        : [
            { resource: 'profile', actions: ['read', 'write'] },
          ],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    users.push(newUser);

    // إنشاء رمز الوصول
    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role,
        platform 
      },
      JWT_SECRET,
      { expiresIn: platform === 'mobile' ? '30d' : '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token,
      platform
    });

  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تحديث الرمز المميز
router.post('/refresh', authenticateToken, (req: any, res) => {
  const { user } = req;
  const platform = req.headers['x-platform'] || 'web';

  const newToken = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role,
      platform 
    },
    JWT_SECRET,
    { expiresIn: platform === 'mobile' ? '30d' : '7d' }
  );

  res.json({ token: newToken });
});

// الحصول على بيانات المستخدم الحالي
router.get('/me', authenticateToken, (req: any, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// تسجيل الخروج
router.post('/logout', authenticateToken, (req: any, res) => {
  // في التطبيق الحقيقي، يمكن إضافة الرمز إلى قائمة سوداء
  res.json({ message: 'تم تسجيل الخروج بنجاح' });
});

export { router as authRoutes };
