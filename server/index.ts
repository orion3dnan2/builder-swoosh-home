import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getSystemSettings,
  updateSystemSettings,
  getSystemHealth,
  getSystemLogs,
  testEmailConfig,
  testSMSConfig,
  backupDatabase,
  clearCache
} from "./routes/system";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // System Settings API routes
  app.get("/api/system/settings", getSystemSettings);
  app.put("/api/system/settings", updateSystemSettings);
  app.get("/api/system/health", getSystemHealth);
  app.get("/api/system/logs", getSystemLogs);
  app.post("/api/system/test-email", testEmailConfig);
  app.post("/api/system/test-sms", testSMSConfig);
  app.post("/api/system/backup", backupDatabase);
  app.post("/api/system/clear-cache", clearCache);

  return app;
}
