import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/router/app_router.dart';

class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Text(
                l10n.register,
                style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 32),
              
              TextField(
                decoration: InputDecoration(
                  labelText: l10n.fullName,
                  prefixIcon: const Icon(LucideIcons.user),
                ),
              ),
              const SizedBox(height: 16),
              
              TextField(
                decoration: InputDecoration(
                  labelText: l10n.email,
                  prefixIcon: const Icon(LucideIcons.mail),
                ),
              ),
              const SizedBox(height: 16),
              
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText: l10n.password,
                  prefixIcon: const Icon(LucideIcons.lock),
                ),
              ),
              const SizedBox(height: 32),
              
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => AppRouter.goToHome(),
                  child: Text(l10n.signUp),
                ),
              ),
              const SizedBox(height: 16),
              
              TextButton(
                onPressed: () => AppRouter.goToLogin(),
                child: Text(l10n.alreadyHaveAccount),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
