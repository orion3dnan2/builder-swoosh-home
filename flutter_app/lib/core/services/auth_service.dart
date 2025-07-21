import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';
import '../models/user.dart';
import 'api_service.dart';

// Auth Service Provider
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref);
});

// Auth State Provider
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthService {
  final Ref _ref;
  late Box _userBox;

  AuthService(this._ref) {
    _initializeBox();
  }

  Future<void> _initializeBox() async {
    _userBox = await Hive.openBox(AppConstants.userBoxName);
  }

  // Login method
  Future<AuthResult> login(String email, String password) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.post<Map<String, dynamic>>(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      return response.when(
        success: (data) async {
          final token = data['token'] as String?;
          final userData = data['user'] as Map<String, dynamic>?;
          
          if (token != null && userData != null) {
            final user = User.fromJson(userData);
            
            // Save token and user data
            await _saveToken(token);
            await _saveUser(user);
            
            // Update auth state
            _ref.read(authStateProvider.notifier).setUser(user);
            
            return AuthResult.success(user);
          } else {
            return AuthResult.error('بيانات تسجيل الدخول غير صحيحة');
          }
        },
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء تسجيل الدخول');
    }
  }

  // Register method
  Future<AuthResult> register({
    required String username,
    required String email,
    required String password,
    required String fullName,
    String? phone,
    UserRole role = UserRole.customer,
  }) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.post<Map<String, dynamic>>(
        '/auth/register',
        data: {
          'username': username,
          'email': email,
          'password': password,
          'full_name': fullName,
          'phone': phone,
          'role': role.name,
        },
      );

      return response.when(
        success: (data) async {
          final token = data['token'] as String?;
          final userData = data['user'] as Map<String, dynamic>?;
          
          if (token != null && userData != null) {
            final user = User.fromJson(userData);
            
            // Save token and user data
            await _saveToken(token);
            await _saveUser(user);
            
            // Update auth state
            _ref.read(authStateProvider.notifier).setUser(user);
            
            return AuthResult.success(user);
          } else {
            return AuthResult.error('فشل في إنشاء الحساب');
          }
        },
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء إنشاء الحساب');
    }
  }

  // Logout method
  Future<void> logout() async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      // Call logout endpoint (optional)
      await apiService.post('/auth/logout');
    } catch (e) {
      // Continue with local logout even if API call fails
    } finally {
      // Clear local data
      await _clearToken();
      await _clearUser();
      
      // Update auth state
      _ref.read(authStateProvider.notifier).logout();
    }
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    final token = await getToken();
    final user = await getCurrentUser();
    return token != null && user != null;
  }

  // Get current user
  Future<User?> getCurrentUser() async {
    try {
      await _initializeBox();
      final userData = _userBox.get('current_user');
      if (userData != null && userData is Map<String, dynamic>) {
        return User.fromJson(Map<String, dynamic>.from(userData));
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  // Get auth token
  Future<String?> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString('auth_token');
    } catch (e) {
      return null;
    }
  }

  // Refresh token
  Future<AuthResult> refreshToken() async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.post<Map<String, dynamic>>(
        '/auth/refresh',
      );

      return response.when(
        success: (data) async {
          final token = data['token'] as String?;
          
          if (token != null) {
            await _saveToken(token);
            return AuthResult.success(null);
          } else {
            return AuthResult.error('فشل في تحديث الجلسة');
          }
        },
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء تحديث الجلسة');
    }
  }

  // Update user profile
  Future<AuthResult> updateProfile({
    String? fullName,
    String? phone,
    String? avatar,
    Address? address,
  }) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.put<Map<String, dynamic>>(
        '/user/profile',
        data: {
          if (fullName != null) 'full_name': fullName,
          if (phone != null) 'phone': phone,
          if (avatar != null) 'avatar': avatar,
          if (address != null) 'address': address.toJson(),
        },
      );

      return response.when(
        success: (data) async {
          final userData = data['user'] as Map<String, dynamic>?;
          
          if (userData != null) {
            final user = User.fromJson(userData);
            await _saveUser(user);
            _ref.read(authStateProvider.notifier).setUser(user);
            return AuthResult.success(user);
          } else {
            return AuthResult.error('فشل في تحديث الملف الشخصي');
          }
        },
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  }

  // Change password
  Future<AuthResult> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.put<Map<String, dynamic>>(
        '/user/password',
        data: {
          'current_password': currentPassword,
          'new_password': newPassword,
        },
      );

      return response.when(
        success: (data) => AuthResult.success(null),
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء تغيير كلمة المرور');
    }
  }

  // Forgot password
  Future<AuthResult> forgotPassword(String email) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      
      final response = await apiService.post<Map<String, dynamic>>(
        '/auth/forgot-password',
        data: {'email': email},
      );

      return response.when(
        success: (data) => AuthResult.success(null),
        error: (error, statusCode) => AuthResult.error(error),
      );
    } catch (e) {
      return AuthResult.error('حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور');
    }
  }

  // Private methods
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<void> _saveUser(User user) async {
    await _initializeBox();
    await _userBox.put('current_user', user.toJson());
  }

  Future<void> _clearUser() async {
    await _initializeBox();
    await _userBox.delete('current_user');
  }
}

// Auth State Management
class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(const AuthState.initial()) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    state = const AuthState.loading();
    
    final authService = _ref.read(authServiceProvider);
    final isAuth = await authService.isAuthenticated();
    
    if (isAuth) {
      final user = await authService.getCurrentUser();
      if (user != null) {
        state = AuthState.authenticated(user);
      } else {
        state = const AuthState.unauthenticated();
      }
    } else {
      state = const AuthState.unauthenticated();
    }
  }

  void setUser(User user) {
    state = AuthState.authenticated(user);
  }

  void logout() {
    state = const AuthState.unauthenticated();
  }
}

// Auth State
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final User? user;

  const AuthState._({
    required this.isLoading,
    required this.isAuthenticated,
    this.user,
  });

  const AuthState.initial() : this._(isLoading: true, isAuthenticated: false);
  const AuthState.loading() : this._(isLoading: true, isAuthenticated: false);
  const AuthState.authenticated(User user) : this._(isLoading: false, isAuthenticated: true, user: user);
  const AuthState.unauthenticated() : this._(isLoading: false, isAuthenticated: false);
}

// Auth Result
class AuthResult {
  final bool isSuccess;
  final User? user;
  final String? error;

  const AuthResult._({
    required this.isSuccess,
    this.user,
    this.error,
  });

  factory AuthResult.success(User? user) {
    return AuthResult._(isSuccess: true, user: user);
  }

  factory AuthResult.error(String error) {
    return AuthResult._(isSuccess: false, error: error);
  }

  R when<R>({
    required R Function(User? user) success,
    required R Function(String error) error,
  }) {
    if (isSuccess) {
      return success(user);
    } else {
      return error(this.error ?? 'حدث خطأ غير متوقع');
    }
  }
}

// Convenience providers
final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.user;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.isAuthenticated;
});

final isLoadingProvider = Provider<bool>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.isLoading;
});
