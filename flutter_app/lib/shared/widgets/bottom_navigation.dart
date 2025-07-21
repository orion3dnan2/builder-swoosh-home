import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/localization/app_localizations.dart';
import '../../features/settings/providers/app_settings_provider.dart';

class CustomBottomNavigation extends ConsumerWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool showLabels;
  
  const CustomBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.showLabels = true,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;
    final appSettings = ref.watch(appSettingsProvider);
    
    // Get enabled navigation items based on settings
    final navigationItems = _getNavigationItems(l10n, appSettings.enabledFeatures);
    
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: navigationItems.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isSelected = currentIndex == index;
              
              return Expanded(
                child: _NavigationItem(
                  icon: item.icon,
                  selectedIcon: item.selectedIcon,
                  label: showLabels ? item.label : null,
                  isSelected: isSelected,
                  onTap: () => onTap(index),
                  theme: theme,
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  List<NavigationItemData> _getNavigationItems(
    AppLocalizations l10n,
    Map<String, bool> enabledFeatures,
  ) {
    final allItems = [
      NavigationItemData(
        icon: LucideIcons.home,
        selectedIcon: LucideIcons.home,
        label: l10n.home,
      ),
      if (enabledFeatures['marketplace'] == true)
        NavigationItemData(
          icon: LucideIcons.store,
          selectedIcon: LucideIcons.store,
          label: l10n.marketplace,
        ),
      if (enabledFeatures['products'] == true)
        NavigationItemData(
          icon: LucideIcons.package,
          selectedIcon: LucideIcons.package,
          label: l10n.products,
        ),
      if (enabledFeatures['services'] == true)
        NavigationItemData(
          icon: LucideIcons.wrench,
          selectedIcon: LucideIcons.wrench,
          label: l10n.services,
        ),
      NavigationItemData(
        icon: LucideIcons.user,
        selectedIcon: LucideIcons.user,
        label: l10n.profile,
      ),
    ];
    
    // Limit to maximum 5 items for better UX
    return allItems.take(5).toList();
  }
}

class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final IconData selectedIcon;
  final String? label;
  final bool isSelected;
  final VoidCallback onTap;
  final ThemeData theme;
  
  const _NavigationItem({
    required this.icon,
    required this.selectedIcon,
    this.label,
    required this.isSelected,
    required this.onTap,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: isSelected 
            ? theme.colorScheme.primary.withOpacity(0.1)
            : Colors.transparent,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon with animation
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: isSelected 
                  ? theme.colorScheme.primary
                  : Colors.transparent,
              ),
              child: Icon(
                isSelected ? selectedIcon : icon,
                size: 20,
                color: isSelected 
                  ? theme.colorScheme.onPrimary
                  : theme.colorScheme.onSurfaceVariant,
              ),
            ),
            
            // Label
            if (label != null) ...[
              const SizedBox(height: 4),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: theme.textTheme.labelSmall!.copyWith(
                  color: isSelected 
                    ? theme.colorScheme.primary
                    : theme.colorScheme.onSurfaceVariant,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
                child: Text(
                  label!,
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class NavigationItemData {
  final IconData icon;
  final IconData selectedIcon;
  final String label;
  
  const NavigationItemData({
    required this.icon,
    required this.selectedIcon,
    required this.label,
  });
}

// Alternative floating bottom navigation
class FloatingBottomNavigation extends ConsumerWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  
  const FloatingBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;
    final appSettings = ref.watch(appSettingsProvider);
    
    final navigationItems = [
      (LucideIcons.home, l10n.home),
      (LucideIcons.store, l10n.marketplace),
      (LucideIcons.package, l10n.products),
      (LucideIcons.wrench, l10n.services),
      (LucideIcons.user, l10n.profile),
    ];
    
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: navigationItems.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          final isSelected = currentIndex == index;
          
          return GestureDetector(
            onTap: () => onTap(index),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: isSelected 
                  ? theme.colorScheme.primary
                  : Colors.transparent,
              ),
              child: Icon(
                item.$1,
                size: 20,
                color: isSelected 
                  ? theme.colorScheme.onPrimary
                  : theme.colorScheme.onSurfaceVariant,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
