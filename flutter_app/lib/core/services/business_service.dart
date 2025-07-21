import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/business.dart';
import '../models/content.dart';
import 'api_service.dart';
import 'storage_service.dart';

// Business Service Provider
final businessServiceProvider = Provider<BusinessService>((ref) {
  return BusinessService(ref);
});

class BusinessService {
  final Ref _ref;

  BusinessService(this._ref);

  // Products
  Future<ApiResponse<PaginatedResponse<Product>>> getProducts({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    double? minPrice,
    double? maxPrice,
    String? merchantId,
    ProductSortBy sortBy = ProductSortBy.newest,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sort_by': sortBy.name,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
      if (minPrice != null) 'min_price': minPrice,
      if (maxPrice != null) 'max_price': maxPrice,
      if (merchantId != null) 'merchant_id': merchantId,
    };

    return await apiService.get<PaginatedResponse<Product>>(
      '/products',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Product.fromJson),
    );
  }

  Future<ApiResponse<Product>> getProduct(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    // Add to recent views
    final storageService = _ref.read(storageServiceProvider);
    await storageService.addToRecentViews(id, RecentViewType.product);
    
    return await apiService.get<Product>(
      '/products/$id',
      fromJson: Product.fromJson,
    );
  }

  Future<ApiResponse<Product>> createProduct(Product product) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Product>(
      '/products',
      data: product.toJson(),
      fromJson: Product.fromJson,
    );
  }

  Future<ApiResponse<Product>> updateProduct(String id, Product product) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.put<Product>(
      '/products/$id',
      data: product.toJson(),
      fromJson: Product.fromJson,
    );
  }

  Future<ApiResponse<void>> deleteProduct(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.delete('/products/$id');
  }

  // Companies
  Future<ApiResponse<PaginatedResponse<Company>>> getCompanies({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    String? country,
    String? city,
    bool? isVerified,
    CompanySortBy sortBy = CompanySortBy.newest,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sort_by': sortBy.name,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
      if (country != null) 'country': country,
      if (city != null) 'city': city,
      if (isVerified != null) 'is_verified': isVerified,
    };

    return await apiService.get<PaginatedResponse<Company>>(
      '/companies',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Company.fromJson),
    );
  }

  Future<ApiResponse<Company>> getCompany(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    // Add to recent views
    final storageService = _ref.read(storageServiceProvider);
    await storageService.addToRecentViews(id, RecentViewType.company);
    
    return await apiService.get<Company>(
      '/companies/$id',
      fromJson: Company.fromJson,
    );
  }

  Future<ApiResponse<Company>> createCompany(Company company) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Company>(
      '/companies',
      data: company.toJson(),
      fromJson: Company.fromJson,
    );
  }

  Future<ApiResponse<Company>> updateCompany(String id, Company company) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.put<Company>(
      '/companies/$id',
      data: company.toJson(),
      fromJson: Company.fromJson,
    );
  }

  // Services
  Future<ApiResponse<PaginatedResponse<Service>>> getServices({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    String? location,
    double? minPrice,
    double? maxPrice,
    String? providerId,
    ServiceSortBy sortBy = ServiceSortBy.newest,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sort_by': sortBy.name,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
      if (location != null) 'location': location,
      if (minPrice != null) 'min_price': minPrice,
      if (maxPrice != null) 'max_price': maxPrice,
      if (providerId != null) 'provider_id': providerId,
    };

    return await apiService.get<PaginatedResponse<Service>>(
      '/services',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Service.fromJson),
    );
  }

  Future<ApiResponse<Service>> getService(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    // Add to recent views
    final storageService = _ref.read(storageServiceProvider);
    await storageService.addToRecentViews(id, RecentViewType.service);
    
    return await apiService.get<Service>(
      '/services/$id',
      fromJson: Service.fromJson,
    );
  }

  Future<ApiResponse<Service>> createService(Service service) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Service>(
      '/services',
      data: service.toJson(),
      fromJson: Service.fromJson,
    );
  }

  Future<ApiResponse<Service>> updateService(String id, Service service) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.put<Service>(
      '/services/$id',
      data: service.toJson(),
      fromJson: Service.fromJson,
    );
  }

  // Jobs
  Future<ApiResponse<PaginatedResponse<Job>>> getJobs({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    String? location,
    JobType? type,
    double? minSalary,
    double? maxSalary,
    bool? isRemote,
    String? companyId,
    JobSortBy sortBy = JobSortBy.newest,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sort_by': sortBy.name,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
      if (location != null) 'location': location,
      if (type != null) 'type': type.name,
      if (minSalary != null) 'min_salary': minSalary,
      if (maxSalary != null) 'max_salary': maxSalary,
      if (isRemote != null) 'is_remote': isRemote,
      if (companyId != null) 'company_id': companyId,
    };

    return await apiService.get<PaginatedResponse<Job>>(
      '/jobs',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Job.fromJson),
    );
  }

  Future<ApiResponse<Job>> getJob(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    // Add to recent views
    final storageService = _ref.read(storageServiceProvider);
    await storageService.addToRecentViews(id, RecentViewType.job);
    
    return await apiService.get<Job>(
      '/jobs/$id',
      fromJson: Job.fromJson,
    );
  }

  Future<ApiResponse<Job>> createJob(Job job) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Job>(
      '/jobs',
      data: job.toJson(),
      fromJson: Job.fromJson,
    );
  }

  Future<ApiResponse<Job>> updateJob(String id, Job job) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.put<Job>(
      '/jobs/$id',
      data: job.toJson(),
      fromJson: Job.fromJson,
    );
  }

  Future<ApiResponse<void>> applyForJob(String jobId, String coverLetter, String? resumeUrl) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post(
      '/jobs/$jobId/apply',
      data: {
        'cover_letter': coverLetter,
        if (resumeUrl != null) 'resume_url': resumeUrl,
      },
    );
  }

  // Advertisements
  Future<ApiResponse<PaginatedResponse<Advertisement>>> getAdvertisements({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    AdType? type,
    String? location,
    double? minPrice,
    double? maxPrice,
    bool? isFeatured,
    AdSortBy sortBy = AdSortBy.newest,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sort_by': sortBy.name,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
      if (type != null) 'type': type.name,
      if (location != null) 'location': location,
      if (minPrice != null) 'min_price': minPrice,
      if (maxPrice != null) 'max_price': maxPrice,
      if (isFeatured != null) 'is_featured': isFeatured,
    };

    return await apiService.get<PaginatedResponse<Advertisement>>(
      '/advertisements',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Advertisement.fromJson),
    );
  }

  Future<ApiResponse<Advertisement>> getAdvertisement(String id) async {
    final apiService = _ref.read(apiServiceProvider);
    
    // Add to recent views
    final storageService = _ref.read(storageServiceProvider);
    await storageService.addToRecentViews(id, RecentViewType.advertisement);
    
    return await apiService.get<Advertisement>(
      '/advertisements/$id',
      fromJson: Advertisement.fromJson,
    );
  }

  Future<ApiResponse<Advertisement>> createAdvertisement(Advertisement ad) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Advertisement>(
      '/advertisements',
      data: ad.toJson(),
      fromJson: Advertisement.fromJson,
    );
  }

  Future<ApiResponse<Advertisement>> updateAdvertisement(String id, Advertisement ad) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.put<Advertisement>(
      '/advertisements/$id',
      data: ad.toJson(),
      fromJson: Advertisement.fromJson,
    );
  }

  // Reviews
  Future<ApiResponse<PaginatedResponse<Review>>> getReviews({
    required String targetId,
    required ReviewTargetType targetType,
    int page = 1,
    int limit = 20,
  }) async {
    final apiService = _ref.read(apiServiceProvider);
    
    final queryParams = <String, dynamic>{
      'target_id': targetId,
      'target_type': targetType.name,
      'page': page,
      'limit': limit,
    };

    return await apiService.get<PaginatedResponse<Review>>(
      '/reviews',
      queryParameters: queryParams,
      fromJson: (json) => PaginatedResponse.fromJson(json, Review.fromJson),
    );
  }

  Future<ApiResponse<Review>> createReview(Review review) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.post<Review>(
      '/reviews',
      data: review.toJson(),
      fromJson: Review.fromJson,
    );
  }

  // Categories
  Future<ApiResponse<List<Category>>> getCategories(CategoryType type) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.get<List<Category>>(
      '/categories',
      queryParameters: {'type': type.name},
      fromJson: (json) => (json['data'] as List)
          .map((item) => Category.fromJson(item))
          .toList(),
    );
  }

  // Search suggestions
  Future<ApiResponse<List<String>>> getSearchSuggestions(String query, String type) async {
    final apiService = _ref.read(apiServiceProvider);
    
    return await apiService.get<List<String>>(
      '/search/suggestions',
      queryParameters: {
        'query': query,
        'type': type,
      },
      fromJson: (json) => (json['suggestions'] as List).cast<String>(),
    );
  }
}

// Sort enums
enum ProductSortBy {
  newest,
  oldest,
  priceAsc,
  priceDesc,
  rating,
  popular,
}

enum CompanySortBy {
  newest,
  oldest,
  rating,
  alphabetical,
}

enum ServiceSortBy {
  newest,
  oldest,
  priceAsc,
  priceDesc,
  rating,
}

enum JobSortBy {
  newest,
  oldest,
  salaryAsc,
  salaryDesc,
  location,
}

enum AdSortBy {
  newest,
  oldest,
  priceAsc,
  priceDesc,
  featured,
}
