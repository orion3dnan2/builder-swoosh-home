import 'app_localizations.dart';

class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn() : super('en');

  @override
  String get appName => 'Bayt Al Sudani';

  @override
  String get appTagline => 'Sudanese Services and Companies Market in Gulf and World';

  @override
  String get welcome => 'Welcome to Bayt Al Sudani';

  @override
  String get loading => 'Loading...';

  @override
  String get error => 'Error occurred';

  @override
  String get success => 'Success';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirm => 'Confirm';

  @override
  String get save => 'Save';

  @override
  String get edit => 'Edit';

  @override
  String get delete => 'Delete';

  @override
  String get view => 'View';

  @override
  String get back => 'Back';

  @override
  String get next => 'Next';

  @override
  String get previous => 'Previous';

  @override
  String get search => 'Search';

  @override
  String get filter => 'Filter';

  @override
  String get sort => 'Sort';

  @override
  String get close => 'Close';

  @override
  String get retry => 'Retry';

  @override
  String get refresh => 'Refresh';

  // Navigation
  @override
  String get home => 'Home';

  @override
  String get marketplace => 'Marketplace';

  @override
  String get products => 'Products';

  @override
  String get companies => 'Companies';

  @override
  String get jobs => 'Jobs';

  @override
  String get services => 'Services';

  @override
  String get ads => 'Ads';

  @override
  String get profile => 'Profile';

  @override
  String get settings => 'Settings';

  @override
  String get login => 'Login';

  @override
  String get register => 'Register';

  @override
  String get logout => 'Logout';

  // Authentication
  @override
  String get email => 'Email';

  @override
  String get password => 'Password';

  @override
  String get confirmPassword => 'Confirm Password';

  @override
  String get forgotPassword => 'Forgot Password?';

  @override
  String get dontHaveAccount => 'Don\'t have an account?';

  @override
  String get alreadyHaveAccount => 'Already have an account?';

  @override
  String get signIn => 'Sign In';

  @override
  String get signUp => 'Sign Up';

  @override
  String get signOut => 'Sign Out';

  // Profile
  @override
  String get fullName => 'Full Name';

  @override
  String get phoneNumber => 'Phone Number';

  @override
  String get address => 'Address';

  @override
  String get city => 'City';

  @override
  String get country => 'Country';

  @override
  String get dateOfBirth => 'Date of Birth';

  @override
  String get gender => 'Gender';

  @override
  String get male => 'Male';

  @override
  String get female => 'Female';

  // Admin
  @override
  String get dashboard => 'Dashboard';

  @override
  String get users => 'Users';

  @override
  String get stores => 'Stores';

  @override
  String get analytics => 'Analytics';

  @override
  String get reports => 'Reports';

  @override
  String get manageContent => 'Manage Content';

  @override
  String get systemSettings => 'System Settings';

  @override
  String get appearance => 'Appearance';

  @override
  String get superAdmin => 'Super Admin';

  @override
  String get merchant => 'Merchant';

  @override
  String get customer => 'Customer';

  // Features
  @override
  String get notifications => 'Notifications';

  @override
  String get messages => 'Messages';

  @override
  String get favorites => 'Favorites';

  @override
  String get cart => 'Cart';

  @override
  String get orders => 'Orders';

  @override
  String get reviews => 'Reviews';

  @override
  String get support => 'Support';

  @override
  String get help => 'Help';

  @override
  String get aboutUs => 'About Us';

  @override
  String get contactUs => 'Contact Us';

  @override
  String get termsOfService => 'Terms of Service';

  @override
  String get privacyPolicy => 'Privacy Policy';

  // Status
  @override
  String get active => 'Active';

  @override
  String get inactive => 'Inactive';

  @override
  String get pending => 'Pending';

  @override
  String get approved => 'Approved';

  @override
  String get rejected => 'Rejected';

  @override
  String get completed => 'Completed';

  @override
  String get inProgress => 'In Progress';

  @override
  String get cancelled => 'Cancelled';

  // Actions
  @override
  String get add => 'Add';

  @override
  String get create => 'Create';

  @override
  String get update => 'Update';

  @override
  String get remove => 'Remove';

  @override
  String get share => 'Share';

  @override
  String get copy => 'Copy';

  @override
  String get download => 'Download';

  @override
  String get upload => 'Upload';

  @override
  String get import => 'Import';

  @override
  String get export => 'Export';

  // Validation
  @override
  String get fieldRequired => 'This field is required';

  @override
  String get invalidEmail => 'Invalid email address';

  @override
  String get passwordTooShort => 'Password is too short';

  @override
  String get passwordsDoNotMatch => 'Passwords do not match';

  @override
  String get phoneInvalid => 'Invalid phone number';

  // Time
  @override
  String get today => 'Today';

  @override
  String get yesterday => 'Yesterday';

  @override
  String get tomorrow => 'Tomorrow';

  @override
  String get thisWeek => 'This Week';

  @override
  String get lastWeek => 'Last Week';

  @override
  String get thisMonth => 'This Month';

  @override
  String get lastMonth => 'Last Month';

  @override
  String get thisYear => 'This Year';

  // Counts
  @override
  String itemCount(int count) {
    if (count == 0) return 'No items';
    if (count == 1) return '1 item';
    return '$count items';
  }

  @override
  String userCount(int count) {
    if (count == 0) return 'No users';
    if (count == 1) return '1 user';
    return '$count users';
  }

  @override
  String productCount(int count) {
    if (count == 0) return 'No products';
    if (count == 1) return '1 product';
    return '$count products';
  }

  @override
  String orderCount(int count) {
    if (count == 0) return 'No orders';
    if (count == 1) return '1 order';
    return '$count orders';
  }
}
