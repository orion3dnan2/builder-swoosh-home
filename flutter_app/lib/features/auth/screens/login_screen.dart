import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/router/app_router.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: LinearGradient(
                    colors: [theme.colorScheme.primary, theme.colorScheme.secondary],
                  ),
                ),
                child: const Center(child: Text('🇸🇩', style: TextStyle(fontSize: 48))),
              ),
              const SizedBox(height: 32),
              
              Text(
                l10n.login,
                style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 32),
              
              // Email field
              TextField(
                decoration: InputDecoration(
                  labelText: l10n.email,
                  prefixIcon: const Icon(LucideIcons.mail),
                ),
              ),
              const SizedBox(height: 16),
              
              // Password field
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText: l10n.password,
                  prefixIcon: const Icon(LucideIcons.lock),
                ),
              ),
              const SizedBox(height: 32),
              
              // Login button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => AppRouter.goToHome(),
                  child: Text(l10n.signIn),
                ),
              ),
              const SizedBox(height: 16),
              
              // Register link
              TextButton(
                onPressed: () => AppRouter.goToRegister(),
                child: Text(l10n.dontHaveAccount),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
