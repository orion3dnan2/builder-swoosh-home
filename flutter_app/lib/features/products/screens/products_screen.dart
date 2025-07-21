import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../shared/widgets/app_bar.dart';

class ProductsScreen extends ConsumerWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(
        title: l10n.products,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.package, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('المنتجات', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('كتالوج شامل للمنتجات السودانية', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
