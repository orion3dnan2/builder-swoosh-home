import { Router } from "express";

const router = Router();

// Mock stores data
const stores = [
  {
    id: "store-001",
    name: "متجر تجريبي",
    category: "general",
    location: "الخرطوم",
    description: "متجر تجريبي للاختبار",
  },
];

// Get all stores
router.get("/", (req, res) => {
  res.json(stores);
});

// Get single store
router.get("/:id", (req, res) => {
  const store = stores.find((s) => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ error: "المتجر غير موجود" });
  }
  res.json(store);
});

export { router as storesRoutes };
