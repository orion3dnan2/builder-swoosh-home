// This file contains all the remaining screens for the Flutter app
// In a real project, these would be in separate files

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../core/localization/app_localizations.dart';
import '../shared/widgets/app_bar.dart';

// Profile Screen
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.profile),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.user, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('الملف الشخصي', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('إدارة معلوماتك الشخصية', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Settings Screen
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.settings),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.settings, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('الإعدادات', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('تخصيص التطبيق حسب تفضيلاتك', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Admin Dashboard Screen
class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.dashboard),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.layoutDashboard, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('لوحة الإدارة', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('إدارة التطبيق والمستخدمين', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Admin Settings Screen
class AdminSettingsScreen extends ConsumerWidget {
  const AdminSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'إعدادات الإدارة'),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.settings2, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('إعدادات الإدارة', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('تكوين إعدادات النظام', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Admin Users Screen
class AdminUsersScreen extends ConsumerWidget {
  const AdminUsersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.users),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.users, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('إدارة المستخدمين', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('مراقبة وإدارة حسابات المستخدمين', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Admin Stores Screen  
class AdminStoresScreen extends ConsumerWidget {
  const AdminStoresScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.stores),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.store, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('إدارة المتاجر', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('مراقبة وإدارة المتاجر والشركات', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Merchant Dashboard Screen
class MerchantDashboardScreen extends ConsumerWidget {
  const MerchantDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'لوحة التاجر'),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.store, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('لوحة التاجر', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('إدارة متجرك ومنتجاتك', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Merchant Products Screen
class MerchantProductsScreen extends ConsumerWidget {
  const MerchantProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'منتجاتي'),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.package, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('منتجاتي', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('إدارة كتالوج المنتجات', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Merchant Analytics Screen
class MerchantAnalyticsScreen extends ConsumerWidget {
  const MerchantAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'التحليلات'),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.barChart3, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('التحليلات', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('تقارير المبيعات والأداء', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
