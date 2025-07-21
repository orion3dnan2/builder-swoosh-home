import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/router/app_router.dart';
import '../../../features/settings/providers/app_settings_provider.dart';

class HeroSection extends ConsumerWidget {
  const HeroSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final appSettings = ref.watch(appSettingsProvider);
    
    return Container(
      height: 400,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            theme.colorScheme.primary,
            theme.colorScheme.secondary,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          // Background pattern
          Positioned.fill(
            child: CustomPaint(
              painter: _SudanesePatternPainter(
                color: Colors.white.withOpacity(0.1),
              ),
            ),
          ),
          
          // Background image (if available)
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: CachedNetworkImageProvider(
                    'https://cdn.builder.io/api/v1/image/assets%2F35c3b708bca4439892b085c51294b652%2Fce2008778e0a44f2b133fed58cb7f578?format=webp&width=800',
                  ),
                  fit: BoxFit.cover,
                  opacity: 0.3,
                ),
              ),
            ),
          ),
          
          // Gradient overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.black.withOpacity(0.4),
                    Colors.transparent,
                    Colors.black.withOpacity(0.6),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ),
          
          // Content
          Positioned.fill(
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Logo
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          '🇸🇩',
                          style: TextStyle(fontSize: 40),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    
                    // App name
                    Text(
                      appSettings.appName,
                      style: theme.textTheme.headlineLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          const Shadow(
                            color: Colors.black54,
                            offset: Offset(0, 2),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    
                    // Tagline
                    Text(
                      appSettings.appTagline,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                        shadows: [
                          const Shadow(
                            color: Colors.black54,
                            offset: Offset(0, 1),
                            blurRadius: 2,
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    
                    // Action buttons
                    Wrap(
                      spacing: 16,
                      runSpacing: 16,
                      children: [
                        _HeroButton(
                          label: l10n.marketplace,
                          icon: LucideIcons.store,
                          onPressed: () => AppRouter.goToMarketplace(),
                          isPrimary: true,
                        ),
                        _HeroButton(
                          label: l10n.services,
                          icon: LucideIcons.wrench,
                          onPressed: () => AppRouter.goToServices(),
                          isPrimary: false,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onPressed;
  final bool isPrimary;
  
  const _HeroButton({
    required this.label,
    required this.icon,
    required this.onPressed,
    required this.isPrimary,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: isPrimary 
          ? Colors.white
          : Colors.white.withOpacity(0.2),
        foregroundColor: isPrimary 
          ? theme.colorScheme.primary
          : Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: isPrimary 
            ? BorderSide.none
            : const BorderSide(color: Colors.white, width: 1),
        ),
        elevation: isPrimary ? 4 : 0,
        shadowColor: Colors.black.withOpacity(0.2),
      ),
    );
  }
}

class _SudanesePatternPainter extends CustomPainter {
  final Color color;
  
  _SudanesePatternPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final double spacing = 40;
    
    // Draw geometric pattern inspired by Sudanese art
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        // Draw diamond shapes
        final path = Path();
        path.moveTo(x + spacing / 2, y);
        path.lineTo(x + spacing, y + spacing / 2);
        path.lineTo(x + spacing / 2, y + spacing);
        path.lineTo(x, y + spacing / 2);
        path.close();
        
        canvas.drawPath(path, paint);
        
        // Draw smaller circles in center
        canvas.drawCircle(
          Offset(x + spacing / 2, y + spacing / 2),
          4,
          paint..style = PaintingStyle.fill,
        );
        paint.style = PaintingStyle.stroke;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
