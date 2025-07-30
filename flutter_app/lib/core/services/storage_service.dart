import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';
import '../models/user.dart';
import '../models/business.dart';
import '../models/content.dart';

// Storage Service Provider
final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

class StorageService {
  static const String _favoritesBoxName = 'favorites';
  static const String _searchHistoryBoxName = 'search_history';
  static const String _recentViewsBoxName = 'recent_views';

  // Initialize storage
  Future<void> initialize() async {
    await Hive.openBox(_favoritesBoxName);
    await Hive.openBox(_searchHistoryBoxName);
    await Hive.openBox(_recentViewsBoxName);
  }

  // Favorites Management
  Future<void> addToFavorites(String itemId, FavoriteType type) async {
    final box = Hive.box(_favoritesBoxName);
    final favorites = await getFavorites(type);
    
    if (!favorites.contains(itemId)) {
      favorites.add(itemId);
      await box.put(type.name, favorites);
    }
  }

  Future<void> removeFromFavorites(String itemId, FavoriteType type) async {
    final box = Hive.box(_favoritesBoxName);
    final favorites = await getFavorites(type);
    
    favorites.remove(itemId);
    await box.put(type.name, favorites);
  }

  Future<List<String>> getFavorites(FavoriteType type) async {
    final box = Hive.box(_favoritesBoxName);
    final favorites = box.get(type.name, defaultValue: <String>[]);
    return List<String>.from(favorites);
  }

  Future<bool> isFavorite(String itemId, FavoriteType type) async {
    final favorites = await getFavorites(type);
    return favorites.contains(itemId);
  }

  Future<void> clearFavorites(FavoriteType type) async {
    final box = Hive.box(_favoritesBoxName);
    await box.delete(type.name);
  }

  // Search History Management
  Future<void> addToSearchHistory(String query) async {
    if (query.trim().isEmpty) return;
    
    final box = Hive.box(_searchHistoryBoxName);
    final history = await getSearchHistory();
    
    // Remove if already exists
    history.remove(query);
    
    // Add to beginning
    history.insert(0, query);
    
    // Keep only last 20 searches
    if (history.length > 20) {
      history.removeRange(20, history.length);
    }
    
    await box.put('searches', history);
  }

  Future<List<String>> getSearchHistory() async {
    final box = Hive.box(_searchHistoryBoxName);
    final history = box.get('searches', defaultValue: <String>[]);
    return List<String>.from(history);
  }

  Future<void> removeFromSearchHistory(String query) async {
    final box = Hive.box(_searchHistoryBoxName);
    final history = await getSearchHistory();
    
    history.remove(query);
    await box.put('searches', history);
  }

  Future<void> clearSearchHistory() async {
    final box = Hive.box(_searchHistoryBoxName);
    await box.delete('searches');
  }

  // Recent Views Management
  Future<void> addToRecentViews(String itemId, RecentViewType type) async {
    final box = Hive.box(_recentViewsBoxName);
    final recentView = RecentView(
      itemId: itemId,
      type: type,
      viewedAt: DateTime.now(),
    );
    
    final recentViews = await getRecentViews();
    
    // Remove if already exists
    recentViews.removeWhere((view) => view.itemId == itemId && view.type == type);
    
    // Add to beginning
    recentViews.insert(0, recentView);
    
    // Keep only last 50 views
    if (recentViews.length > 50) {
      recentViews.removeRange(50, recentViews.length);
    }
    
    await box.put('recent_views', recentViews.map((e) => e.toJson()).toList());
  }

  Future<List<RecentView>> getRecentViews([RecentViewType? type]) async {
    final box = Hive.box(_recentViewsBoxName);
    final views = box.get('recent_views', defaultValue: <Map<String, dynamic>>[]);
    
    final recentViews = (views as List)
        .cast<Map<String, dynamic>>()
        .map((json) => RecentView.fromJson(Map<String, dynamic>.from(json)))
        .toList();
    
    if (type != null) {
      return recentViews.where((view) => view.type == type).toList();
    }
    
    return recentViews;
  }

  Future<void> clearRecentViews([RecentViewType? type]) async {
    if (type == null) {
      final box = Hive.box(_recentViewsBoxName);
      await box.delete('recent_views');
    } else {
      final recentViews = await getRecentViews();
      final filteredViews = recentViews.where((view) => view.type != type).toList();
      
      final box = Hive.box(_recentViewsBoxName);
      await box.put('recent_views', filteredViews.map((e) => e.toJson()).toList());
    }
  }

  // App Settings Storage
  Future<void> saveAppSetting(String key, dynamic value) async {
    final prefs = await SharedPreferences.getInstance();
    
    if (value is String) {
      await prefs.setString(key, value);
    } else if (value is int) {
      await prefs.setInt(key, value);
    } else if (value is double) {
      await prefs.setDouble(key, value);
    } else if (value is bool) {
      await prefs.setBool(key, value);
    } else if (value is List<String>) {
      await prefs.setStringList(key, value);
    }
  }

  Future<T?> getAppSetting<T>(String key, [T? defaultValue]) async {
    final prefs = await SharedPreferences.getInstance();
    
    if (T == String) {
      return prefs.getString(key) as T? ?? defaultValue;
    } else if (T == int) {
      return prefs.getInt(key) as T? ?? defaultValue;
    } else if (T == double) {
      return prefs.getDouble(key) as T? ?? defaultValue;
    } else if (T == bool) {
      return prefs.getBool(key) as T? ?? defaultValue;
    }
    
    return defaultValue;
  }

  Future<void> removeAppSetting(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  // Cache Management
  Future<void> cacheData<T>(String key, T data, {Duration? expiry}) async {
    final box = Hive.box(AppConstants.cacheBoxName);
    
    final cacheItem = CacheItem(
      data: data,
      cachedAt: DateTime.now(),
      expiresAt: expiry != null ? DateTime.now().add(expiry) : null,
    );
    
    await box.put(key, cacheItem.toJson());
  }

  Future<T?> getCachedData<T>(String key) async {
    final box = Hive.box(AppConstants.cacheBoxName);
    final cachedJson = box.get(key);
    
    if (cachedJson != null) {
      final cacheItem = CacheItem.fromJson(Map<String, dynamic>.from(cachedJson));
      
      // Check if expired
      if (cacheItem.expiresAt != null && DateTime.now().isAfter(cacheItem.expiresAt!)) {
        await box.delete(key);
        return null;
      }
      
      return cacheItem.data as T?;
    }
    
    return null;
  }

  Future<void> clearCache([String? prefix]) async {
    final box = Hive.box(AppConstants.cacheBoxName);
    
    if (prefix != null) {
      final keysToDelete = box.keys.where((key) => key.toString().startsWith(prefix)).toList();
      for (final key in keysToDelete) {
        await box.delete(key);
      }
    } else {
      await box.clear();
    }
  }

  // Cleanup expired cache items
  Future<void> cleanupExpiredCache() async {
    final box = Hive.box(AppConstants.cacheBoxName);
    final now = DateTime.now();
    final keysToDelete = <dynamic>[];
    
    for (final key in box.keys) {
      final cachedJson = box.get(key);
      if (cachedJson != null) {
        try {
          final cacheItem = CacheItem.fromJson(Map<String, dynamic>.from(cachedJson));
          if (cacheItem.expiresAt != null && now.isAfter(cacheItem.expiresAt!)) {
            keysToDelete.add(key);
          }
        } catch (e) {
          // Invalid cache item, remove it
          keysToDelete.add(key);
        }
      }
    }
    
    for (final key in keysToDelete) {
      await box.delete(key);
    }
  }
}

// Enums and Models for Storage
enum FavoriteType {
  product,
  company,
  service,
  job,
  advertisement,
}

enum RecentViewType {
  product,
  company,
  service,
  job,
  advertisement,
}

class RecentView {
  final String itemId;
  final RecentViewType type;
  final DateTime viewedAt;

  const RecentView({
    required this.itemId,
    required this.type,
    required this.viewedAt,
  });

  Map<String, dynamic> toJson() => {
    'item_id': itemId,
    'type': type.name,
    'viewed_at': viewedAt.toIso8601String(),
  };

  factory RecentView.fromJson(Map<String, dynamic> json) => RecentView(
    itemId: json['item_id'],
    type: RecentViewType.values.firstWhere((e) => e.name == json['type']),
    viewedAt: DateTime.parse(json['viewed_at']),
  );
}

class CacheItem {
  final dynamic data;
  final DateTime cachedAt;
  final DateTime? expiresAt;

  const CacheItem({
    required this.data,
    required this.cachedAt,
    this.expiresAt,
  });

  Map<String, dynamic> toJson() => {
    'data': data,
    'cached_at': cachedAt.toIso8601String(),
    'expires_at': expiresAt?.toIso8601String(),
  };

  factory CacheItem.fromJson(Map<String, dynamic> json) => CacheItem(
    data: json['data'],
    cachedAt: DateTime.parse(json['cached_at']),
    expiresAt: json['expires_at'] != null ? DateTime.parse(json['expires_at']) : null,
  );
}

// Storage Providers for UI
final favoritesProvider = FutureProvider.family<List<String>, FavoriteType>((ref, type) async {
  final storageService = ref.read(storageServiceProvider);
  return await storageService.getFavorites(type);
});

final searchHistoryProvider = FutureProvider<List<String>>((ref) async {
  final storageService = ref.read(storageServiceProvider);
  return await storageService.getSearchHistory();
});

final recentViewsProvider = FutureProvider.family<List<RecentView>, RecentViewType?>((ref, type) async {
  final storageService = ref.read(storageServiceProvider);
  return await storageService.getRecentViews(type);
});
