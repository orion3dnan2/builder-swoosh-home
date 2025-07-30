import 'package:hive/hive.dart';
import 'package:json_annotation/json_annotation.dart';

part 'business.g.dart';

@HiveType(typeId: 9)
@JsonSerializable()
class Product extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final double price;
  
  @HiveField(4)
  final String currency;
  
  @HiveField(5)
  final List<String> images;
  
  @HiveField(6)
  final String category;
  
  @HiveField(7)
  final String subcategory;
  
  @HiveField(8)
  final String merchantId;
  
  @HiveField(9)
  final String merchantName;
  
  @HiveField(10)
  final bool isAvailable;
  
  @HiveField(11)
  final int stockQuantity;
  
  @HiveField(12)
  final double? discount;
  
  @HiveField(13)
  final List<String> tags;
  
  @HiveField(14)
  final ProductSpecs? specs;
  
  @HiveField(15)
  final double rating;
  
  @HiveField(16)
  final int reviewsCount;
  
  @HiveField(17)
  final DateTime createdAt;
  
  @HiveField(18)
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.images,
    required this.category,
    required this.subcategory,
    required this.merchantId,
    required this.merchantName,
    this.isAvailable = true,
    this.stockQuantity = 0,
    this.discount,
    this.tags = const [],
    this.specs,
    this.rating = 0.0,
    this.reviewsCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  double get finalPrice => discount != null ? price * (1 - discount! / 100) : price;
  bool get hasDiscount => discount != null && discount! > 0;
  String get mainImage => images.isNotEmpty ? images.first : '';
  bool get isInStock => stockQuantity > 0;
}

@HiveType(typeId: 10)
@JsonSerializable()
class ProductSpecs extends HiveObject {
  @HiveField(0)
  final String? weight;
  
  @HiveField(1)
  final String? dimensions;
  
  @HiveField(2)
  final String? material;
  
  @HiveField(3)
  final String? color;
  
  @HiveField(4)
  final String? brand;
  
  @HiveField(5)
  final String? model;
  
  @HiveField(6)
  final Map<String, String> additionalSpecs;

  ProductSpecs({
    this.weight,
    this.dimensions,
    this.material,
    this.color,
    this.brand,
    this.model,
    this.additionalSpecs = const {},
  });

  factory ProductSpecs.fromJson(Map<String, dynamic> json) => _$ProductSpecsFromJson(json);
  Map<String, dynamic> toJson() => _$ProductSpecsToJson(this);
}

@HiveType(typeId: 11)
@JsonSerializable()
class Company extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final String category;
  
  @HiveField(4)
  final String? logo;
  
  @HiveField(5)
  final String? coverImage;
  
  @HiveField(6)
  final String location;
  
  @HiveField(7)
  final String country;
  
  @HiveField(8)
  final String city;
  
  @HiveField(9)
  final String? phone;
  
  @HiveField(10)
  final String? email;
  
  @HiveField(11)
  final String? website;
  
  @HiveField(12)
  final SocialLinks? socialLinks;
  
  @HiveField(13)
  final double rating;
  
  @HiveField(14)
  final int reviewsCount;
  
  @HiveField(15)
  final bool isVerified;
  
  @HiveField(16)
  final CompanyStatus status;
  
  @HiveField(17)
  final List<String> services;
  
  @HiveField(18)
  final DateTime createdAt;
  
  @HiveField(19)
  final DateTime updatedAt;

  Company({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    this.logo,
    this.coverImage,
    required this.location,
    required this.country,
    required this.city,
    this.phone,
    this.email,
    this.website,
    this.socialLinks,
    this.rating = 0.0,
    this.reviewsCount = 0,
    this.isVerified = false,
    this.status = CompanyStatus.pending,
    this.services = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory Company.fromJson(Map<String, dynamic> json) => _$CompanyFromJson(json);
  Map<String, dynamic> toJson() => _$CompanyToJson(this);

  String get fullLocation => '$city, $country';
  bool get isActive => status == CompanyStatus.active;
  bool get canShowInPublic => isActive && isVerified;
}

@HiveType(typeId: 12)
enum CompanyStatus {
  @HiveField(0)
  pending,
  
  @HiveField(1)
  active,
  
  @HiveField(2)
  suspended,
  
  @HiveField(3)
  rejected,
}

@HiveType(typeId: 13)
@JsonSerializable()
class Service extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final String category;
  
  @HiveField(4)
  final String subcategory;
  
  @HiveField(5)
  final String providerId;
  
  @HiveField(6)
  final String providerName;
  
  @HiveField(7)
  final double? price;
  
  @HiveField(8)
  final String? priceNote;
  
  @HiveField(9)
  final List<String> images;
  
  @HiveField(10)
  final String location;
  
  @HiveField(11)
  final bool isAvailable;
  
  @HiveField(12)
  final List<String> tags;
  
  @HiveField(13)
  final double rating;
  
  @HiveField(14)
  final int reviewsCount;
  
  @HiveField(15)
  final DateTime createdAt;

  Service({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.subcategory,
    required this.providerId,
    required this.providerName,
    this.price,
    this.priceNote,
    this.images = const [],
    required this.location,
    this.isAvailable = true,
    this.tags = const [],
    this.rating = 0.0,
    this.reviewsCount = 0,
    required this.createdAt,
  });

  factory Service.fromJson(Map<String, dynamic> json) => _$ServiceFromJson(json);
  Map<String, dynamic> toJson() => _$ServiceToJson(this);

  String get priceDisplay => price != null 
    ? '${price!.toStringAsFixed(0)} ريال' 
    : priceNote ?? 'حسب الاتفاق';
  String get mainImage => images.isNotEmpty ? images.first : '';
}

@HiveType(typeId: 14)
@JsonSerializable()
class Job extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final String companyId;
  
  @HiveField(4)
  final String companyName;
  
  @HiveField(5)
  final String location;
  
  @HiveField(6)
  final String country;
  
  @HiveField(7)
  final String city;
  
  @HiveField(8)
  final JobType type;
  
  @HiveField(9)
  final String category;
  
  @HiveField(10)
  final double? minSalary;
  
  @HiveField(11)
  final double? maxSalary;
  
  @HiveField(12)
  final String currency;
  
  @HiveField(13)
  final List<String> requirements;
  
  @HiveField(14)
  final List<String> benefits;
  
  @HiveField(15)
  final bool isRemote;
  
  @HiveField(16)
  final bool isUrgent;
  
  @HiveField(17)
  final JobStatus status;
  
  @HiveField(18)
  final DateTime postedAt;
  
  @HiveField(19)
  final DateTime? expiresAt;

  Job({
    required this.id,
    required this.title,
    required this.description,
    required this.companyId,
    required this.companyName,
    required this.location,
    required this.country,
    required this.city,
    required this.type,
    required this.category,
    this.minSalary,
    this.maxSalary,
    this.currency = 'SAR',
    this.requirements = const [],
    this.benefits = const [],
    this.isRemote = false,
    this.isUrgent = false,
    this.status = JobStatus.active,
    required this.postedAt,
    this.expiresAt,
  });

  factory Job.fromJson(Map<String, dynamic> json) => _$JobFromJson(json);
  Map<String, dynamic> toJson() => _$JobToJson(this);

  String get salaryDisplay {
    if (minSalary != null && maxSalary != null) {
      return '${minSalary!.toStringAsFixed(0)} - ${maxSalary!.toStringAsFixed(0)} $currency';
    } else if (minSalary != null) {
      return 'من ${minSalary!.toStringAsFixed(0)} $currency';
    } else if (maxSalary != null) {
      return 'حتى ${maxSalary!.toStringAsFixed(0)} $currency';
    }
    return 'حسب الخبرة';
  }

  String get fullLocation => '$city, $country';
  bool get isExpired => expiresAt != null && DateTime.now().isAfter(expiresAt!);
  bool get isActive => status == JobStatus.active && !isExpired;
}

@HiveType(typeId: 15)
enum JobType {
  @HiveField(0)
  fullTime,
  
  @HiveField(1)
  partTime,
  
  @HiveField(2)
  contract,
  
  @HiveField(3)
  internship,
  
  @HiveField(4)
  freelance,
}

@HiveType(typeId: 16)
enum JobStatus {
  @HiveField(0)
  active,
  
  @HiveField(1)
  paused,
  
  @HiveField(2)
  closed,
  
  @HiveField(3)
  expired,
}
