import 'package:hive/hive.dart';
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@HiveType(typeId: 2)
@JsonSerializable()
class User extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String username;
  
  @HiveField(2)
  final String email;
  
  @HiveField(3)
  final UserRole role;
  
  @HiveField(4)
  final UserProfile profile;
  
  @HiveField(5)
  final List<Permission> permissions;
  
  @HiveField(6)
  final DateTime createdAt;
  
  @HiveField(7)
  final DateTime? lastLogin;
  
  @HiveField(8)
  final bool isActive;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
    required this.profile,
    required this.permissions,
    required this.createdAt,
    this.lastLogin,
    this.isActive = true,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? username,
    String? email,
    UserRole? role,
    UserProfile? profile,
    List<Permission>? permissions,
    DateTime? createdAt,
    DateTime? lastLogin,
    bool? isActive,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      role: role ?? this.role,
      profile: profile ?? this.profile,
      permissions: permissions ?? this.permissions,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      isActive: isActive ?? this.isActive,
    );
  }

  bool get isSuperAdmin => role == UserRole.superAdmin;
  bool get isMerchant => role == UserRole.merchant;
  bool get isCustomer => role == UserRole.customer;
  
  bool hasPermission(String resource, String action) {
    return permissions.any((permission) =>
        permission.resource == resource && permission.actions.contains(action));
  }
}

@HiveType(typeId: 3)
enum UserRole {
  @HiveField(0)
  superAdmin,
  
  @HiveField(1)
  merchant,
  
  @HiveField(2)
  customer,
}

@HiveType(typeId: 4)
@JsonSerializable()
class UserProfile extends HiveObject {
  @HiveField(0)
  final String name;
  
  @HiveField(1)
  final String? phone;
  
  @HiveField(2)
  final String? avatar;
  
  @HiveField(3)
  final String languageCode;
  
  @HiveField(4)
  final Address? address;
  
  @HiveField(5)
  final BusinessInfo? businessInfo;

  UserProfile({
    required this.name,
    this.phone,
    this.avatar,
    this.languageCode = 'ar',
    this.address,
    this.businessInfo,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) => _$UserProfileFromJson(json);
  Map<String, dynamic> toJson() => _$UserProfileToJson(this);

  UserProfile copyWith({
    String? name,
    String? phone,
    String? avatar,
    String? languageCode,
    Address? address,
    BusinessInfo? businessInfo,
  }) {
    return UserProfile(
      name: name ?? this.name,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      languageCode: languageCode ?? this.languageCode,
      address: address ?? this.address,
      businessInfo: businessInfo ?? this.businessInfo,
    );
  }
}

@HiveType(typeId: 5)
@JsonSerializable()
class Address extends HiveObject {
  @HiveField(0)
  final String street;
  
  @HiveField(1)
  final String city;
  
  @HiveField(2)
  final String state;
  
  @HiveField(3)
  final String country;
  
  @HiveField(4)
  final String zipCode;

  Address({
    required this.street,
    required this.city,
    required this.state,
    required this.country,
    required this.zipCode,
  });

  factory Address.fromJson(Map<String, dynamic> json) => _$AddressFromJson(json);
  Map<String, dynamic> toJson() => _$AddressToJson(this);

  String get fullAddress => '$street, $city, $state, $country $zipCode';
}

@HiveType(typeId: 6)
@JsonSerializable()
class BusinessInfo extends HiveObject {
  @HiveField(0)
  final String businessName;
  
  @HiveField(1)
  final String businessType;
  
  @HiveField(2)
  final String? taxId;
  
  @HiveField(3)
  final String description;
  
  @HiveField(4)
  final String? logo;
  
  @HiveField(5)
  final String? coverImage;
  
  @HiveField(6)
  final SocialLinks? socialLinks;

  BusinessInfo({
    required this.businessName,
    required this.businessType,
    this.taxId,
    required this.description,
    this.logo,
    this.coverImage,
    this.socialLinks,
  });

  factory BusinessInfo.fromJson(Map<String, dynamic> json) => _$BusinessInfoFromJson(json);
  Map<String, dynamic> toJson() => _$BusinessInfoToJson(this);
}

@HiveType(typeId: 7)
@JsonSerializable()
class SocialLinks extends HiveObject {
  @HiveField(0)
  final String? website;
  
  @HiveField(1)
  final String? facebook;
  
  @HiveField(2)
  final String? instagram;
  
  @HiveField(3)
  final String? twitter;
  
  @HiveField(4)
  final String? linkedin;
  
  @HiveField(5)
  final String? whatsapp;

  SocialLinks({
    this.website,
    this.facebook,
    this.instagram,
    this.twitter,
    this.linkedin,
    this.whatsapp,
  });

  factory SocialLinks.fromJson(Map<String, dynamic> json) => _$SocialLinksFromJson(json);
  Map<String, dynamic> toJson() => _$SocialLinksToJson(this);
}

@HiveType(typeId: 8)
@JsonSerializable()
class Permission extends HiveObject {
  @HiveField(0)
  final String resource;
  
  @HiveField(1)
  final List<String> actions;

  Permission({
    required this.resource,
    required this.actions,
  });

  factory Permission.fromJson(Map<String, dynamic> json) => _$PermissionFromJson(json);
  Map<String, dynamic> toJson() => _$PermissionToJson(this);
}
