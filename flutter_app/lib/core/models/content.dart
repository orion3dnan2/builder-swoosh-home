import 'package:hive/hive.dart';
import 'package:json_annotation/json_annotation.dart';

part 'content.g.dart';

@HiveType(typeId: 17)
@JsonSerializable()
class Advertisement extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final AdType type;
  
  @HiveField(4)
  final String category;
  
  @HiveField(5)
  final double? price;
  
  @HiveField(6)
  final String currency;
  
  @HiveField(7)
  final List<String> images;
  
  @HiveField(8)
  final String location;
  
  @HiveField(9)
  final String country;
  
  @HiveField(10)
  final String city;
  
  @HiveField(11)
  final String contactPhone;
  
  @HiveField(12)
  final String? contactEmail;
  
  @HiveField(13)
  final String userId;
  
  @HiveField(14)
  final String userName;
  
  @HiveField(15)
  final AdStatus status;
  
  @HiveField(16)
  final bool isFeatured;
  
  @HiveField(17)
  final DateTime createdAt;
  
  @HiveField(18)
  final DateTime? expiresAt;

  Advertisement({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.category,
    this.price,
    this.currency = 'SAR',
    this.images = const [],
    required this.location,
    required this.country,
    required this.city,
    required this.contactPhone,
    this.contactEmail,
    required this.userId,
    required this.userName,
    this.status = AdStatus.pending,
    this.isFeatured = false,
    required this.createdAt,
    this.expiresAt,
  });

  factory Advertisement.fromJson(Map<String, dynamic> json) => _$AdvertisementFromJson(json);
  Map<String, dynamic> toJson() => _$AdvertisementToJson(this);

  String get priceDisplay => price != null 
    ? '${price!.toStringAsFixed(0)} $currency' 
    : 'حسب الاتفاق';
  String get fullLocation => '$city, $country';
  String get mainImage => images.isNotEmpty ? images.first : '';
  bool get isExpired => expiresAt != null && DateTime.now().isAfter(expiresAt!);
  bool get isActive => status == AdStatus.active && !isExpired;
}

@HiveType(typeId: 18)
enum AdType {
  @HiveField(0)
  sell,
  
  @HiveField(1)
  buy,
  
  @HiveField(2)
  rent,
  
  @HiveField(3)
  service,
  
  @HiveField(4)
  job,
}

@HiveType(typeId: 19)
enum AdStatus {
  @HiveField(0)
  pending,
  
  @HiveField(1)
  active,
  
  @HiveField(2)
  expired,
  
  @HiveField(3)
  rejected,
  
  @HiveField(4)
  sold,
}

@HiveType(typeId: 20)
@JsonSerializable()
class Review extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String targetId; // Company, Product, or Service ID
  
  @HiveField(2)
  final ReviewTargetType targetType;
  
  @HiveField(3)
  final String userId;
  
  @HiveField(4)
  final String userName;
  
  @HiveField(5)
  final String? userAvatar;
  
  @HiveField(6)
  final double rating;
  
  @HiveField(7)
  final String comment;
  
  @HiveField(8)
  final List<String> images;
  
  @HiveField(9)
  final DateTime createdAt;
  
  @HiveField(10)
  final String? response; // Response from business owner
  
  @HiveField(11)
  final DateTime? responseDate;

  Review({
    required this.id,
    required this.targetId,
    required this.targetType,
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.rating,
    required this.comment,
    this.images = const [],
    required this.createdAt,
    this.response,
    this.responseDate,
  });

  factory Review.fromJson(Map<String, dynamic> json) => _$ReviewFromJson(json);
  Map<String, dynamic> toJson() => _$ReviewToJson(this);

  bool get hasResponse => response != null && response!.isNotEmpty;
  bool get hasImages => images.isNotEmpty;
}

@HiveType(typeId: 21)
enum ReviewTargetType {
  @HiveField(0)
  company,
  
  @HiveField(1)
  product,
  
  @HiveField(2)
  service,
}

@HiveType(typeId: 22)
@JsonSerializable()
class Notification extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String userId;
  
  @HiveField(2)
  final String title;
  
  @HiveField(3)
  final String body;
  
  @HiveField(4)
  final NotificationType type;
  
  @HiveField(5)
  final String? imageUrl;
  
  @HiveField(6)
  final Map<String, String> data;
  
  @HiveField(7)
  final bool isRead;
  
  @HiveField(8)
  final DateTime createdAt;

  Notification({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
    required this.type,
    this.imageUrl,
    this.data = const {},
    this.isRead = false,
    required this.createdAt,
  });

  factory Notification.fromJson(Map<String, dynamic> json) => _$NotificationFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationToJson(this);
}

@HiveType(typeId: 23)
enum NotificationType {
  @HiveField(0)
  general,
  
  @HiveField(1)
  newJob,
  
  @HiveField(2)
  newProduct,
  
  @HiveField(3)
  newService,
  
  @HiveField(4)
  newAd,
  
  @HiveField(5)
  orderUpdate,
  
  @HiveField(6)
  reviewReceived,
  
  @HiveField(7)
  accountUpdate,
  
  @HiveField(8)
  systemMaintenance,
}

@HiveType(typeId: 24)
@JsonSerializable()
class Category extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String nameAr;
  
  @HiveField(3)
  final String? description;
  
  @HiveField(4)
  final String? icon;
  
  @HiveField(5)
  final String? image;
  
  @HiveField(6)
  final CategoryType type;
  
  @HiveField(7)
  final String? parentId;
  
  @HiveField(8)
  final int sortOrder;
  
  @HiveField(9)
  final bool isActive;

  Category({
    required this.id,
    required this.name,
    required this.nameAr,
    this.description,
    this.icon,
    this.image,
    required this.type,
    this.parentId,
    this.sortOrder = 0,
    this.isActive = true,
  });

  factory Category.fromJson(Map<String, dynamic> json) => _$CategoryFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryToJson(this);

  bool get isSubcategory => parentId != null;
  String get displayName => nameAr.isNotEmpty ? nameAr : name;
}

@HiveType(typeId: 25)
enum CategoryType {
  @HiveField(0)
  product,
  
  @HiveField(1)
  service,
  
  @HiveField(2)
  job,
  
  @HiveField(3)
  company,
  
  @HiveField(4)
  advertisement,
}

@HiveType(typeId: 26)
@JsonSerializable()
class AppAnalytics extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String eventName;
  
  @HiveField(2)
  final String? userId;
  
  @HiveField(3)
  final Map<String, dynamic> properties;
  
  @HiveField(4)
  final DateTime timestamp;
  
  @HiveField(5)
  final String? sessionId;
  
  @HiveField(6)
  final String platform;
  
  @HiveField(7)
  final String appVersion;

  AppAnalytics({
    required this.id,
    required this.eventName,
    this.userId,
    this.properties = const {},
    required this.timestamp,
    this.sessionId,
    this.platform = 'flutter',
    required this.appVersion,
  });

  factory AppAnalytics.fromJson(Map<String, dynamic> json) => _$AppAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$AppAnalyticsToJson(this);
}
