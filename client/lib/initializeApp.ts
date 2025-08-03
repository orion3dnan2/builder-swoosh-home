import { apiConfigManager } from "./apiConfig";
import { ApiService } from "./apiService";
import { AppSettingsService } from "./appSettings";

// Initialize the application with proper API configuration
export function initializeApp() {
  try {
    // Initialize app settings
    AppSettingsService.initialize();

    // Check if there's an active external API configuration
    const activeConfig = apiConfigManager.getActiveConfig();
    if (activeConfig && activeConfig.isActive && !activeConfig.isDefault) {
      // Enable external API if there's an active non-default configuration
      ApiService.enableExternalApi();
      console.log(
        `🌐 External API enabled: ${activeConfig.name} (${activeConfig.baseUrl})`,
      );
    } else {
      // Use local API
      ApiService.disableExternalApi();
      console.log("🏠 Using local API server");
    }

    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing application:", error);
  }
}

// Auto-initialize when module is imported
if (typeof window !== "undefined") {
  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
}
