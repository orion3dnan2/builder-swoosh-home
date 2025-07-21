import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/router/app_router.dart';
import '../../../features/settings/providers/app_settings_provider.dart';
import '../../../shared/widgets/app_bar.dart';
import '../../../shared/widgets/bottom_navigation.dart';
import '../widgets/hero_section.dart';
import '../widgets/stats_section.dart';
import '../widgets/services_section.dart';
import '../widgets/featured_companies.dart';
import '../widgets/latest_jobs.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final appSettings = ref.watch(appSettingsProvider);
    
    return Scaffold(
      appBar: CustomAppBar(
        title: l10n.appName,
        showBackButton: false,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          IconButton(
            icon: const Icon(LucideIcons.bell),
            onPressed: () {
              // TODO: Implement notifications
            },
          ),
          IconButton(
            icon: const Icon(LucideIcons.user),
            onPressed: () => AppRouter.goToProfile(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Hero Section
            const HeroSection(),
            
            const SizedBox(height: 24),
            
            // Stats Section
            const StatsSection(),
            
            const SizedBox(height: 32),
            
            // Services Section
            const ServicesSection(),
            
            const SizedBox(height: 32),
            
            // Featured Companies
            if (appSettings.enabledFeatures['companies'] == true) ...[
              const FeaturedCompanies(),
              const SizedBox(height: 32),
            ],
            
            // Latest Jobs
            if (appSettings.enabledFeatures['jobs'] == true) ...[
              const LatestJobs(),
              const SizedBox(height: 32),
            ],
            
            // Footer space
            const SizedBox(height: 100),
          ],
        ),
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onNavigationTap,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implement quick action (chat, support, etc.)
        },
        child: const Icon(LucideIcons.messageCircle),
      ),
    );
  }

  Future<void> _refreshData() async {
    // TODO: Implement data refresh
    await Future.delayed(const Duration(seconds: 1));
  }

  void _onNavigationTap(int index) {
    setState(() {
      _currentIndex = index;
    });
    
    switch (index) {
      case 0:
        // Already on home
        break;
      case 1:
        AppRouter.goToMarketplace();
        break;
      case 2:
        AppRouter.goToProducts();
        break;
      case 3:
        AppRouter.goToServices();
        break;
      case 4:
        AppRouter.goToProfile();
        break;
    }
  }
}
