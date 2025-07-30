import 'package:flutter/material.dart';

class AppColors {
  // Primary colors from original design
  static const Color primaryBlue = Color(0xFF2563EB);
  static const Color secondaryOrange = Color(0xFFF59E0B);
  
  // Sudanese flag colors
  static const Color sudaneseRed = Color(0xFFD32F2F);
  static const Color sudaneseWhite = Color(0xFFFFFFFF);
  static const Color sudaneseBlack = Color(0xFF212121);
  
  // Neutral colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  
  // Gray scale
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);
  
  // Status colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // Surface colors for cultural theme
  static const Color culturalSurface = Color(0xFFFFFBF5);
  static const Color culturalSurfaceDark = Color(0xFF1A1A1A);
  
  // Cultural accent colors inspired by Sudanese art
  static const Color goldAccent = Color(0xFFD4AF37);
  static const Color copperAccent = Color(0xFFB87333);
  static const Color emeraldAccent = Color(0xFF50C878);
  
  // Gradient colors
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue, Color(0xFF1E40AF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [secondaryOrange, Color(0xFFEA580C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient culturalGradient = LinearGradient(
    colors: [goldAccent, copperAccent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  // Predefined color palettes
  static const Map<String, ColorPalette> colorPalettes = {
    'default': ColorPalette(
      primary: primaryBlue,
      secondary: secondaryOrange,
      name: 'البرتقالي والأزرق',
    ),
    'green_gold': ColorPalette(
      primary: Color(0xFF059669),
      secondary: Color(0xFFD97706),
      name: 'الأخضر والذهبي',
    ),
    'purple_pink': ColorPalette(
      primary: Color(0xFF7C3AED),
      secondary: Color(0xFFEC4899),
      name: 'البنفسجي والوردي',
    ),
    'red_orange': ColorPalette(
      primary: Color(0xFFDC2626),
      secondary: Color(0xFFEA580C),
      name: 'الأحمر والبرتقالي',
    ),
    'dark_blue_teal': ColorPalette(
      primary: Color(0xFF1E40AF),
      secondary: Color(0xFF0891B2),
      name: 'الأزرق الداكن والفيروزي',
    ),
    'olive_gold': ColorPalette(
      primary: Color(0xFF365314),
      secondary: Color(0xFFCA8A04),
      name: 'الأخضر الزيتي والذهبي',
    ),
  };
}

class ColorPalette {
  final Color primary;
  final Color secondary;
  final String name;
  
  const ColorPalette({
    required this.primary,
    required this.secondary,
    required this.name,
  });
}

// Extension for hex color conversion
extension ColorExtension on Color {
  String toHex() {
    return '#${value.toRadixString(16).substring(2).toUpperCase()}';
  }
  
  static Color fromHex(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    return Color(int.parse(hex, radix: 16));
  }
}
