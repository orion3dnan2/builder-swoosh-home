import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { loadFonts } from "./contexts/ThemeContext";
import { AppSettingsService } from "./lib/appSettings";

// Initialize app settings and load fonts on app initialization
AppSettingsService.initialize();
loadFonts();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
