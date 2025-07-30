class AppConstants {
  static const String appName = 'البيت السوداني';
  static const String appTagline = 'سوق الخدمات وشركات السودان في الخليج والعالم';
  
  // Storage
  static const String settingsBoxName = 'app_settings';
  static const String userBoxName = 'user_data';
  static const String cacheBoxName = 'cache_data';
  
  // API
  static const String baseUrl = 'https://api.bayt-al-sudani.com';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // UI
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  
  static const double defaultBorderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 16.0;
  
  // Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);
  
  // Images
  static const String placeholderImage = 'assets/images/placeholder.png';
  static const String logoImage = 'assets/images/logo.png';
  static const String splashImage = 'assets/images/splash.png';
  
  // Fonts
  static const String defaultArabicFont = 'Cairo';
  static const String defaultEnglishFont = 'Inter';
  
  // Colors (matching current theme)
  static const String primaryColorHex = '#2563eb';
  static const String secondaryColorHex = '#f59e0b';
  
  // Routes
  static const String homeRoute = '/';
  static const String loginRoute = '/login';
  static const String registerRoute = '/register';
  static const String profileRoute = '/profile';
  static const String settingsRoute = '/settings';
  
  // Admin routes
  static const String adminDashboardRoute = '/admin/dashboard';
  static const String adminSettingsRoute = '/admin/settings';
  static const String adminUsersRoute = '/admin/users';
  static const String adminStoresRoute = '/admin/stores';
  
  // Merchant routes
  static const String merchantDashboardRoute = '/merchant/dashboard';
  static const String merchantProductsRoute = '/merchant/products';
  static const String merchantAnalyticsRoute = '/merchant/analytics';
  
  // Public routes
  static const String marketplaceRoute = '/marketplace';
  static const String productsRoute = '/products';
  static const String companiesRoute = '/companies';
  static const String jobsRoute = '/jobs';
  static const String servicesRoute = '/services';
  static const String adsRoute = '/ads';
}
