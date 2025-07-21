import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/router/app_router.dart';

class FeaturedCompanies extends ConsumerWidget {
  const FeaturedCompanies({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    // Mock data - in real app, this would come from a provider
    final companies = [
      _CompanyData(
        id: '1',
        name: 'شركة النيل للإنشاءات',
        category: 'البناء والمقاولات',
        location: 'الرياض، السعودية',
        rating: 4.8,
        reviewsCount: 120,
        logoUrl: 'https://via.placeholder.com/100',
        isVerified: true,
      ),
      _CompanyData(
        id: '2',
        name: 'مطعم الخرطوم الأصيل',
        category: 'المطاعم والطعام',
        location: 'دبي، الإمارات',
        rating: 4.9,
        reviewsCount: 85,
        logoUrl: 'https://via.placeholder.com/100',
        isVerified: true,
      ),
      _CompanyData(
        id: '3',
        name: 'أكاديمية التميز',
        category: 'التعليم والتدريب',
        location: 'الكويت',
        rating: 4.7,
        reviewsCount: 45,
        logoUrl: 'https://via.placeholder.com/100',
        isVerified: false,
      ),
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'شركات مميزة',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'شركات سودانية موثقة ومعتمدة',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () => AppRouter.goToCompanies(),
                icon: const Icon(LucideIcons.arrowLeft, size: 16),
                label: Text(l10n.view),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        
        // Companies list
        SizedBox(
          height: 240,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            scrollDirection: Axis.horizontal,
            itemCount: companies.length,
            separatorBuilder: (context, index) => const SizedBox(width: 16),
            itemBuilder: (context, index) {
              return _CompanyCard(
                company: companies[index],
                animationDelay: index * 150,
              );
            },
          ),
        ),
      ],
    );
  }
}

class _CompanyCard extends StatefulWidget {
  final _CompanyData company;
  final int animationDelay;
  
  const _CompanyCard({
    required this.company,
    required this.animationDelay,
  });

  @override
  State<_CompanyCard> createState() => _CompanyCardState();
}

class _CompanyCardState extends State<_CompanyCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    
    _slideAnimation = Tween<double>(
      begin: 30.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    Future.delayed(Duration(milliseconds: widget.animationDelay), () {
      if (mounted) {
        _animationController.forward();
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(_slideAnimation.value, 0),
          child: Opacity(
            opacity: _fadeAnimation.value,
            child: Container(
              width: 280,
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: theme.colorScheme.outline.withOpacity(0.1),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: InkWell(
                onTap: () {
                  // Navigate to company details
                  // AppRouter.push('/companies/${widget.company.id}');
                  AppRouter.goToCompanies();
                },
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header with logo and verification
                      Row(
                        children: [
                          // Company logo
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              color: theme.colorScheme.surfaceVariant,
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: CachedNetworkImage(
                                imageUrl: widget.company.logoUrl,
                                fit: BoxFit.cover,
                                placeholder: (context, url) => Container(
                                  color: theme.colorScheme.surfaceVariant,
                                  child: const Icon(LucideIcons.building2),
                                ),
                                errorWidget: (context, url, error) => Container(
                                  color: theme.colorScheme.surfaceVariant,
                                  child: const Icon(LucideIcons.building2),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          
                          // Company info
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        widget.company.name,
                                        style: theme.textTheme.titleMedium?.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (widget.company.isVerified)
                                      Container(
                                        padding: const EdgeInsets.all(2),
                                        decoration: BoxDecoration(
                                          color: Colors.blue,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Icon(
                                          LucideIcons.check,
                                          color: Colors.white,
                                          size: 12,
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  widget.company.category,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      // Location
                      Row(
                        children: [
                          Icon(
                            LucideIcons.mapPin,
                            size: 16,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              widget.company.location,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      
                      // Rating and reviews
                      Row(
                        children: [
                          Icon(
                            LucideIcons.star,
                            size: 16,
                            color: Colors.amber,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            widget.company.rating.toString(),
                            style: theme.textTheme.bodySmall?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '(${widget.company.reviewsCount} تقييم)',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      // Action button
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            // Navigate to company details or contact
                            AppRouter.goToCompanies();
                          },
                          icon: const Icon(LucideIcons.eye, size: 16),
                          label: const Text('عرض التفاصيل'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _CompanyData {
  final String id;
  final String name;
  final String category;
  final String location;
  final double rating;
  final int reviewsCount;
  final String logoUrl;
  final bool isVerified;
  
  const _CompanyData({
    required this.id,
    required this.name,
    required this.category,
    required this.location,
    required this.rating,
    required this.reviewsCount,
    required this.logoUrl,
    required this.isVerified,
  });
}
