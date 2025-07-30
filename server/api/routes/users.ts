import { Router } from 'express';

const router = Router();

// Mock users data
const users = [
  {
    id: 'user-001',
    username: 'testuser',
    email: 'test@example.com',
    role: 'customer',
    profile: {
      name: 'مستخدم تجريبي'
    }
  }
];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get single user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }
  res.json(user);
});

export { router as userRoutes };
