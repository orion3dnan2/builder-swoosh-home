import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../shared/widgets/app_bar.dart';

class AdsScreen extends ConsumerWidget {
  const AdsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: CustomAppBar(title: l10n.ads),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.megaphone, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('الإعلانات', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('إعلانات مبوبة متنوعة', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
