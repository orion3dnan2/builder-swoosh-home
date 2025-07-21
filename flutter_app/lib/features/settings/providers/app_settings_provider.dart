import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../../core/models/app_settings.dart';
import '../../../core/constants/app_constants.dart';

// App Settings Provider
final appSettingsProvider = StateNotifierProvider<AppSettingsNotifier, AppSettings>((ref) {
  return AppSettingsNotifier();
});

class AppSettingsNotifier extends StateNotifier<AppSettings> {
  AppSettingsNotifier() : super(AppSettings.defaultSettings) {
    _loadSettings();
  }

  late Box _settingsBox;

  Future<void> _loadSettings() async {
    try {
      _settingsBox = await Hive.openBox(AppConstants.settingsBoxName);
      
      // Load settings from Hive or use defaults
      final savedSettings = _settingsBox.get('app_settings');
      if (savedSettings != null && savedSettings is AppSettings) {
        state = savedSettings;
      } else {
        // Save default settings if none exist
        await _saveSettings(state);
      }
    } catch (e) {
      // Handle error - use default settings
      state = AppSettings.defaultSettings;
    }
  }

  Future<void> _saveSettings(AppSettings settings) async {
    try {
      await _settingsBox.put('app_settings', settings);
    } catch (e) {
      // Handle save error
      print('Error saving settings: $e');
    }
  }

  // Update theme mode
  Future<void> updateThemeMode(ThemeMode themeMode) async {
    final newSettings = state.copyWith(themeMode: themeMode);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update primary color
  Future<void> updatePrimaryColor(String colorHex) async {
    final newSettings = state.copyWith(primaryColorHex: colorHex);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update secondary color
  Future<void> updateSecondaryColor(String colorHex) async {
    final newSettings = state.copyWith(secondaryColorHex: colorHex);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update color palette
  Future<void> updateColorPalette(String primaryHex, String secondaryHex) async {
    final newSettings = state.copyWith(
      primaryColorHex: primaryHex,
      secondaryColorHex: secondaryHex,
    );
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update font family
  Future<void> updateFontFamily(String fontFamily) async {
    final newSettings = state.copyWith(fontFamily: fontFamily);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update language
  Future<void> updateLanguage(String languageCode, bool isRTL) async {
    final newSettings = state.copyWith(
      languageCode: languageCode,
      isRTL: isRTL,
    );
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update layout style
  Future<void> updateLayoutStyle(AppLayoutStyle layoutStyle) async {
    final newSettings = state.copyWith(layoutStyle: layoutStyle);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update font size
  Future<void> updateFontSize(double fontSize) async {
    final newSettings = state.copyWith(fontSize: fontSize);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update app branding
  Future<void> updateAppBranding({
    String? appName,
    String? appTagline,
  }) async {
    final newSettings = state.copyWith(
      appName: appName,
      appTagline: appTagline,
    );
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update notification settings
  Future<void> updateNotificationSettings({
    bool? enableNotifications,
    bool? enableSounds,
    bool? enableVibration,
  }) async {
    final newSettings = state.copyWith(
      enableNotifications: enableNotifications,
      enableSounds: enableSounds,
      enableVibration: enableVibration,
    );
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Update feature toggles
  Future<void> updateFeatureToggle(String feature, bool enabled) async {
    final newFeatures = Map<String, bool>.from(state.enabledFeatures);
    newFeatures[feature] = enabled;
    
    final newSettings = state.copyWith(enabledFeatures: newFeatures);
    state = newSettings;
    await _saveSettings(newSettings);
  }

  // Reset to defaults
  Future<void> resetToDefaults() async {
    state = AppSettings.defaultSettings;
    await _saveSettings(state);
  }

  // Bulk update settings
  Future<void> updateSettings(AppSettings newSettings) async {
    state = newSettings;
    await _saveSettings(newSettings);
  }
}

// Convenience providers for specific settings
final themeProvider = Provider<ThemeMode>((ref) {
  return ref.watch(appSettingsProvider).themeMode;
});

final localeProvider = Provider<Locale>((ref) {
  return ref.watch(appSettingsProvider).locale;
});

final isRTLProvider = Provider<bool>((ref) {
  return ref.watch(appSettingsProvider).isRTL;
});

final primaryColorProvider = Provider<Color>((ref) {
  return ref.watch(appSettingsProvider).primaryColor;
});

final secondaryColorProvider = Provider<Color>((ref) {
  return ref.watch(appSettingsProvider).secondaryColor;
});

final fontFamilyProvider = Provider<String>((ref) {
  return ref.watch(appSettingsProvider).fontFamily;
});

final enabledFeaturesProvider = Provider<Map<String, bool>>((ref) {
  return ref.watch(appSettingsProvider).enabledFeatures;
});

// Helper provider to check if a feature is enabled
final featureEnabledProvider = Provider.family<bool, String>((ref, feature) {
  final features = ref.watch(enabledFeaturesProvider);
  return features[feature] ?? false;
});
