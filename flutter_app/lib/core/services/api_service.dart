import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/app_constants.dart';
import '../models/user.dart';
import 'auth_service.dart';

// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(ref);
});

class ApiService {
  late final Dio _dio;
  final Ref _ref;

  ApiService(this._ref) {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.apiTimeout,
      receiveTimeout: AppConstants.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _setupInterceptors();
  }

  void _setupInterceptors() {
    // Request interceptor to add auth token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final authService = _ref.read(authServiceProvider);
        final token = await authService.getToken();
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        handler.next(options);
      },
      onError: (error, handler) async {
        // Handle token expiration
        if (error.response?.statusCode == 401) {
          final authService = _ref.read(authServiceProvider);
          await authService.logout();
        }
        
        handler.next(error);
      },
    ));

    // Logging interceptor (only in debug mode)
    if (AppConstants.isDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        responseHeader: false,
      ));
    }
  }

  // Generic HTTP methods
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );
      
      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.post(
        endpoint,
        data: data,
        queryParameters: queryParameters,
      );
      
      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> put<T>(
    String endpoint, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.put(
        endpoint,
        data: data,
        queryParameters: queryParameters,
      );
      
      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.delete(
        endpoint,
        queryParameters: queryParameters,
      );
      
      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  // File upload
  Future<ApiResponse<T>> uploadFile<T>(
    String endpoint,
    String filePath, {
    String fieldName = 'file',
    Map<String, dynamic>? additionalData,
    T Function(Map<String, dynamic>)? fromJson,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(filePath),
        ...?additionalData,
      });

      final response = await _dio.post(
        endpoint,
        data: formData,
        onSendProgress: onSendProgress,
      );
      
      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  // Response handlers
  ApiResponse<T> _handleResponse<T>(
    Response response,
    T Function(Map<String, dynamic>)? fromJson,
  ) {
    if (response.statusCode! >= 200 && response.statusCode! < 300) {
      dynamic data = response.data;
      
      if (fromJson != null && data is Map<String, dynamic>) {
        data = fromJson(data);
      }
      
      return ApiResponse.success(data);
    } else {
      return ApiResponse.error(
        'HTTP ${response.statusCode}: ${response.statusMessage}',
        response.statusCode,
      );
    }
  }

  ApiResponse<T> _handleError<T>(DioException error) {
    String message;
    int? statusCode;

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'انتهت مهلة الاتصال، تحقق من اتصالك بالإنترنت';
        break;
      case DioExceptionType.badResponse:
        statusCode = error.response?.statusCode;
        message = _getErrorMessage(error.response?.data, statusCode);
        break;
      case DioExceptionType.cancel:
        message = 'تم إلغاء الطلب';
        break;
      case DioExceptionType.connectionError:
        message = 'لا يمكن الاتصال بالخادم';
        break;
      case DioExceptionType.unknown:
        message = 'حدث خطأ غير متوقع';
        break;
      default:
        message = 'حدث خطأ في الشبكة';
    }

    return ApiResponse.error(message, statusCode);
  }

  String _getErrorMessage(dynamic errorData, int? statusCode) {
    if (errorData is Map<String, dynamic>) {
      // Try to extract error message from different possible fields
      final possibleFields = ['message', 'error', 'detail', 'msg'];
      
      for (final field in possibleFields) {
        if (errorData.containsKey(field) && errorData[field] is String) {
          return errorData[field];
        }
      }
    }

    // Default messages based on status code
    switch (statusCode) {
      case 400:
        return 'طلب غير صحيح';
      case 401:
        return 'غير مخول للوصول';
      case 403:
        return 'ممنوع الوصول';
      case 404:
        return 'المورد غير موجود';
      case 500:
        return 'خطأ في الخادم';
      default:
        return 'حدث خطأ غير متوقع';
    }
  }
}

// API Response wrapper
class ApiResponse<T> {
  final bool isSuccess;
  final T? data;
  final String? error;
  final int? statusCode;

  const ApiResponse._({
    required this.isSuccess,
    this.data,
    this.error,
    this.statusCode,
  });

  factory ApiResponse.success(T data) {
    return ApiResponse._(
      isSuccess: true,
      data: data,
    );
  }

  factory ApiResponse.error(String error, [int? statusCode]) {
    return ApiResponse._(
      isSuccess: false,
      error: error,
      statusCode: statusCode,
    );
  }

  // Helper methods
  R when<R>({
    required R Function(T data) success,
    required R Function(String error, int? statusCode) error,
  }) {
    if (isSuccess && data != null) {
      return success(data as T);
    } else {
      return error(this.error ?? 'Unknown error', statusCode);
    }
  }

  R maybeWhen<R>({
    R Function(T data)? success,
    R Function(String error, int? statusCode)? error,
    required R Function() orElse,
  }) {
    if (isSuccess && data != null && success != null) {
      return success(data as T);
    } else if (!isSuccess && this.error != null && error != null) {
      return error(this.error!, statusCode);
    } else {
      return orElse();
    }
  }
}

// Pagination wrapper for API responses
class PaginatedResponse<T> {
  final List<T> data;
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final bool hasMore;

  const PaginatedResponse({
    required this.data,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    required this.hasMore,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    final items = (json['data'] as List?)
        ?.map((item) => fromJsonT(item as Map<String, dynamic>))
        .toList() ?? <T>[];

    return PaginatedResponse(
      data: items,
      currentPage: json['current_page'] ?? 1,
      totalPages: json['total_pages'] ?? 1,
      totalItems: json['total_items'] ?? items.length,
      hasMore: (json['current_page'] ?? 1) < (json['total_pages'] ?? 1),
    );
  }
}

// Constants extension
extension AppConstantsExtension on AppConstants {
  static const bool isDebugMode = true; // Set to false for production
}
