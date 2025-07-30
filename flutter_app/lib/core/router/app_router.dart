import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/home/screens/home_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/marketplace/screens/marketplace_screen.dart';
import '../../features/products/screens/products_screen.dart';
import '../../features/companies/screens/companies_screen.dart';
import '../../features/jobs/screens/jobs_screen.dart';
import '../../features/services/screens/services_screen.dart';
import '../../features/ads/screens/ads_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/settings/screens/settings_screen.dart';

// Admin screens
import '../../features/admin/screens/admin_dashboard_screen.dart';
import '../../features/admin/screens/admin_settings_screen.dart';
import '../../features/admin/screens/admin_users_screen.dart';
import '../../features/admin/screens/admin_stores_screen.dart';

// Merchant screens
import '../../features/merchant/screens/merchant_dashboard_screen.dart';
import '../../features/merchant/screens/merchant_products_screen.dart';
import '../../features/merchant/screens/merchant_analytics_screen.dart';

import '../constants/app_constants.dart';
import '../../shared/widgets/error_screen.dart';
import '../../shared/widgets/loading_screen.dart';

// Global key for navigation
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

// Router provider
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: navigatorKey,
    initialLocation: AppConstants.homeRoute,
    errorBuilder: (context, state) => ErrorScreen(
      error: state.error.toString(),
      onRetry: () => context.go(AppConstants.homeRoute),
    ),
    routes: [
      // Home route
      GoRoute(
        path: AppConstants.homeRoute,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),

      // Authentication routes
      GoRoute(
        path: AppConstants.loginRoute,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppConstants.registerRoute,
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // Profile routes
      GoRoute(
        path: AppConstants.profileRoute,
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: AppConstants.settingsRoute,
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),

      // Public routes
      GoRoute(
        path: AppConstants.marketplaceRoute,
        name: 'marketplace',
        builder: (context, state) => const MarketplaceScreen(),
      ),
      GoRoute(
        path: AppConstants.productsRoute,
        name: 'products',
        builder: (context, state) => const ProductsScreen(),
      ),
      GoRoute(
        path: AppConstants.companiesRoute,
        name: 'companies',
        builder: (context, state) => const CompaniesScreen(),
      ),
      GoRoute(
        path: AppConstants.jobsRoute,
        name: 'jobs',
        builder: (context, state) => const JobsScreen(),
      ),
      GoRoute(
        path: AppConstants.servicesRoute,
        name: 'services',
        builder: (context, state) => const ServicesScreen(),
      ),
      GoRoute(
        path: AppConstants.adsRoute,
        name: 'ads',
        builder: (context, state) => const AdsScreen(),
      ),

      // Admin routes
      GoRoute(
        path: AppConstants.adminDashboardRoute,
        name: 'admin_dashboard',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: AppConstants.adminSettingsRoute,
        name: 'admin_settings',
        builder: (context, state) => const AdminSettingsScreen(),
      ),
      GoRoute(
        path: AppConstants.adminUsersRoute,
        name: 'admin_users',
        builder: (context, state) => const AdminUsersScreen(),
      ),
      GoRoute(
        path: AppConstants.adminStoresRoute,
        name: 'admin_stores',
        builder: (context, state) => const AdminStoresScreen(),
      ),

      // Merchant routes
      GoRoute(
        path: AppConstants.merchantDashboardRoute,
        name: 'merchant_dashboard',
        builder: (context, state) => const MerchantDashboardScreen(),
      ),
      GoRoute(
        path: AppConstants.merchantProductsRoute,
        name: 'merchant_products',
        builder: (context, state) => const MerchantProductsScreen(),
      ),
      GoRoute(
        path: AppConstants.merchantAnalyticsRoute,
        name: 'merchant_analytics',
        builder: (context, state) => const MerchantAnalyticsScreen(),
      ),
    ],
  );
});

// Navigation helper methods
class AppRouter {
  static GoRouter get router => navigatorKey.currentContext!.read(appRouterProvider);

  // Navigation methods
  static void push(String path) {
    router.push(path);
  }

  static void go(String path) {
    router.go(path);
  }

  static void pop() {
    router.pop();
  }

  static void pushReplacement(String path) {
    router.pushReplacement(path);
  }

  // Specific navigation methods
  static void goToHome() => go(AppConstants.homeRoute);
  static void goToLogin() => go(AppConstants.loginRoute);
  static void goToRegister() => go(AppConstants.registerRoute);
  static void goToProfile() => go(AppConstants.profileRoute);
  static void goToSettings() => go(AppConstants.settingsRoute);

  // Public pages
  static void goToMarketplace() => go(AppConstants.marketplaceRoute);
  static void goToProducts() => go(AppConstants.productsRoute);
  static void goToCompanies() => go(AppConstants.companiesRoute);
  static void goToJobs() => go(AppConstants.jobsRoute);
  static void goToServices() => go(AppConstants.servicesRoute);
  static void goToAds() => go(AppConstants.adsRoute);

  // Admin pages
  static void goToAdminDashboard() => go(AppConstants.adminDashboardRoute);
  static void goToAdminSettings() => go(AppConstants.adminSettingsRoute);
  static void goToAdminUsers() => go(AppConstants.adminUsersRoute);
  static void goToAdminStores() => go(AppConstants.adminStoresRoute);

  // Merchant pages
  static void goToMerchantDashboard() => go(AppConstants.merchantDashboardRoute);
  static void goToMerchantProducts() => go(AppConstants.merchantProductsRoute);
  static void goToMerchantAnalytics() => go(AppConstants.merchantAnalyticsRoute);
}

// Current route provider
final currentRouteProvider = Provider<String>((ref) {
  // This would be updated by the router delegate in a real app
  return AppConstants.homeRoute;
});

// Route guard helper
class RouteGuard {
  static bool canAccessAdminRoute(String? userRole) {
    return userRole == 'super_admin';
  }

  static bool canAccessMerchantRoute(String? userRole) {
    return userRole == 'super_admin' || userRole == 'merchant';
  }

  static bool requiresAuth(String route) {
    final protectedRoutes = [
      AppConstants.profileRoute,
      AppConstants.settingsRoute,
      AppConstants.adminDashboardRoute,
      AppConstants.adminSettingsRoute,
      AppConstants.adminUsersRoute,
      AppConstants.adminStoresRoute,
      AppConstants.merchantDashboardRoute,
      AppConstants.merchantProductsRoute,
      AppConstants.merchantAnalyticsRoute,
    ];
    
    return protectedRoutes.any((protectedRoute) => route.startsWith(protectedRoute));
  }
}
