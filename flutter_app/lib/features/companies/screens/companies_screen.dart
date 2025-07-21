import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../shared/widgets/app_bar.dart';

class CompaniesScreen extends ConsumerWidget {
  const CompaniesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.companies),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.building2, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('الشركات', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('دليل الشركات السودانية', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
