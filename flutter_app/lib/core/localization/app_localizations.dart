import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

abstract class AppLocalizations {
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en')
  ];

  // Common translations
  String get appName;
  String get appTagline;
  String get welcome;
  String get loading;
  String get error;
  String get success;
  String get cancel;
  String get confirm;
  String get save;
  String get edit;
  String get delete;
  String get view;
  String get back;
  String get next;
  String get previous;
  String get search;
  String get filter;
  String get sort;
  String get close;
  String get retry;
  String get refresh;

  // Navigation
  String get home;
  String get marketplace;
  String get products;
  String get companies;
  String get jobs;
  String get services;
  String get ads;
  String get profile;
  String get settings;
  String get login;
  String get register;
  String get logout;

  // Authentication
  String get email;
  String get password;
  String get confirmPassword;
  String get forgotPassword;
  String get dontHaveAccount;
  String get alreadyHaveAccount;
  String get signIn;
  String get signUp;
  String get signOut;

  // Profile
  String get fullName;
  String get phoneNumber;
  String get address;
  String get city;
  String get country;
  String get dateOfBirth;
  String get gender;
  String get male;
  String get female;

  // Admin
  String get dashboard;
  String get users;
  String get stores;
  String get analytics;
  String get reports;
  String get manageContent;
  String get systemSettings;
  String get appearance;
  String get superAdmin;
  String get merchant;
  String get customer;

  // Features
  String get notifications;
  String get messages;
  String get favorites;
  String get cart;
  String get orders;
  String get reviews;
  String get support;
  String get help;
  String get aboutUs;
  String get contactUs;
  String get termsOfService;
  String get privacyPolicy;

  // Status
  String get active;
  String get inactive;
  String get pending;
  String get approved;
  String get rejected;
  String get completed;
  String get inProgress;
  String get cancelled;

  // Actions
  String get add;
  String get create;
  String get update;
  String get remove;
  String get share;
  String get copy;
  String get download;
  String get upload;
  String get import;
  String get export;

  // Validation messages
  String get fieldRequired;
  String get invalidEmail;
  String get passwordTooShort;
  String get passwordsDoNotMatch;
  String get phoneInvalid;

  // Time
  String get today;
  String get yesterday;
  String get tomorrow;
  String get thisWeek;
  String get lastWeek;
  String get thisMonth;
  String get lastMonth;
  String get thisYear;

  // Numbers and counts
  String itemCount(int count);
  String userCount(int count);
  String productCount(int count);
  String orderCount(int count);
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  switch (locale.languageCode) {
    case 'ar': return AppLocalizationsAr();
    case 'en': return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue on GitHub with a '
    'reproducible sample app and the gen-l10n configuration that was used.'
  );
}
