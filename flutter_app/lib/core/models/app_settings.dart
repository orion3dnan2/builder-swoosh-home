import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

part 'app_settings.g.dart';

@HiveType(typeId: 0)
class AppSettings extends HiveObject {
  @HiveField(0)
  final ThemeMode themeMode;
  
  @HiveField(1)
  final String primaryColorHex;
  
  @HiveField(2)
  final String secondaryColorHex;
  
  @HiveField(3)
  final String fontFamily;
  
  @HiveField(4)
  final String languageCode;
  
  @HiveField(5)
  final bool isRTL;
  
  @HiveField(6)
  final AppLayoutStyle layoutStyle;
  
  @HiveField(7)
  final double fontSize;
  
  @HiveField(8)
  final bool enableNotifications;
  
  @HiveField(9)
  final bool enableSounds;
  
  @HiveField(10)
  final bool enableVibration;
  
  @HiveField(11)
  final String appName;
  
  @HiveField(12)
  final String appTagline;
  
  @HiveField(13)
  final Map<String, bool> enabledFeatures;

  AppSettings({
    this.themeMode = ThemeMode.system,
    this.primaryColorHex = '#2563eb',
    this.secondaryColorHex = '#f59e0b',
    this.fontFamily = 'Cairo',
    this.languageCode = 'ar',
    this.isRTL = true,
    this.layoutStyle = AppLayoutStyle.modern,
    this.fontSize = 14.0,
    this.enableNotifications = true,
    this.enableSounds = true,
    this.enableVibration = true,
    this.appName = 'البيت السوداني',
    this.appTagline = 'سوق الخدمات وشركات السودان في الخليج والعالم',
    this.enabledFeatures = const {
      'marketplace': true,
      'products': true,
      'companies': true,
      'jobs': true,
      'services': true,
      'ads': true,
      'reviews': true,
      'chat': false,
    },
  });

  // Getters
  Color get primaryColor => Color(int.parse(primaryColorHex.substring(1), radix: 16) + 0xFF000000);
  Color get secondaryColor => Color(int.parse(secondaryColorHex.substring(1), radix: 16) + 0xFF000000);
  Locale get locale => Locale(languageCode);
  
  bool get isDarkMode => themeMode == ThemeMode.dark;
  bool get isSystemMode => themeMode == ThemeMode.system;
  
  // Copy with method
  AppSettings copyWith({
    ThemeMode? themeMode,
    String? primaryColorHex,
    String? secondaryColorHex,
    String? fontFamily,
    String? languageCode,
    bool? isRTL,
    AppLayoutStyle? layoutStyle,
    double? fontSize,
    bool? enableNotifications,
    bool? enableSounds,
    bool? enableVibration,
    String? appName,
    String? appTagline,
    Map<String, bool>? enabledFeatures,
  }) {
    return AppSettings(
      themeMode: themeMode ?? this.themeMode,
      primaryColorHex: primaryColorHex ?? this.primaryColorHex,
      secondaryColorHex: secondaryColorHex ?? this.secondaryColorHex,
      fontFamily: fontFamily ?? this.fontFamily,
      languageCode: languageCode ?? this.languageCode,
      isRTL: isRTL ?? this.isRTL,
      layoutStyle: layoutStyle ?? this.layoutStyle,
      fontSize: fontSize ?? this.fontSize,
      enableNotifications: enableNotifications ?? this.enableNotifications,
      enableSounds: enableSounds ?? this.enableSounds,
      enableVibration: enableVibration ?? this.enableVibration,
      appName: appName ?? this.appName,
      appTagline: appTagline ?? this.appTagline,
      enabledFeatures: enabledFeatures ?? this.enabledFeatures,
    );
  }

  // Default settings
  static AppSettings get defaultSettings => AppSettings();
  
  // Predefined color palettes
  static Map<String, Map<String, String>> get colorPalettes => {
    'البرتق��لي والأزرق': {'primary': '#2563eb', 'secondary': '#f59e0b'},
    'الأخضر والذهبي': {'primary': '#059669', 'secondary': '#d97706'},
    'البنفسجي والوردي': {'primary': '#7c3aed', 'secondary': '#ec4899'},
    'الأحمر والبرتقالي': {'primary': '#dc2626', 'secondary': '#ea580c'},
    'الأزرق الداكن والفيروزي': {'primary': '#1e40af', 'secondary': '#0891b2'},
    'الأخضر الزيتي والذهبي': {'primary': '#365314', 'secondary': '#ca8a04'},
  };
  
  // Available fonts
  static Map<String, String> get availableFonts => {
    'Cairo': 'Cairo',
    'Amiri': 'Amiri',
    'Tajawal': 'Tajawal',
    'Almarai': 'Almarai',
    'IBM Plex Sans Arabic': 'IBM Plex Sans Arabic',
  };
}

@HiveType(typeId: 1)
enum AppLayoutStyle {
  @HiveField(0)
  modern,
  
  @HiveField(1)
  classic,
  
  @HiveField(2)
  minimal,
}
