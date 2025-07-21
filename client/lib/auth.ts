import { User, UserRole } from '../../shared/types';

export class AuthService {
  private static readonly STORAGE_KEYS = {
    USER: 'bayt_al_sudani_user',
    TOKEN: 'bayt_al_sudani_token',
    PERMISSIONS: 'bayt_al_sudani_permissions'
  };

  static login(credentials: { username: string; password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo users for development
        const demoUsers: Record<string, User> = {
          'admin': {
            id: 'admin-001',
            username: 'admin',
            email: 'admin@baytsudani.com',
            role: 'super_admin',
            profile: {
              name: 'مدير التطبيق',
              language: 'ar',
              avatar: '/placeholder.svg'
            },
            permissions: [
              { resource: '*', actions: ['*'] }
            ],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
          },
          'merchant': {
            id: 'merchant-001',
            username: 'merchant',
            email: 'merchant@example.com',
            role: 'merchant',
            profile: {
              name: 'صاحب متجر',
              language: 'ar',
              avatar: '/placeholder.svg',
              businessInfo: {
                businessName: 'متجر الخير',
                businessType: 'retail',
                description: 'متجر لبيع المنتجات السودانية الأصيلة'
              }
            },
            permissions: [
              { resource: 'store', actions: ['read', 'write', 'delete'] },
              { resource: 'products', actions: ['read', 'write', 'delete'] },
              { resource: 'orders', actions: ['read', 'write'] },
              { resource: 'analytics', actions: ['read'] }
            ],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
          }
        };

        const user = demoUsers[credentials.username];
        if (user && credentials.password === credentials.username) {
          this.setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error('اسم المستخدم أو كلمة المرور غير صحيحة'));
        }
      }, 1000);
    });
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.PERMISSIONS);
  }

  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, `token_${user.id}_${Date.now()}`);
    localStorage.setItem(this.STORAGE_KEYS.PERMISSIONS, JSON.stringify(user.permissions));
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  static hasPermission(resource: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    return user.permissions.some(permission => {
      const hasResource = permission.resource === '*' || permission.resource === resource;
      const hasAction = permission.actions.includes('*') || permission.actions.includes(action);
      return hasResource && hasAction;
    });
  }

  static getUserRole(): UserRole | null {
    return this.getCurrentUser()?.role || null;
  }

  static isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  static isMerchant(): boolean {
    return this.hasRole('merchant');
  }

  static isCustomer(): boolean {
    return this.hasRole('customer');
  }
}

// React hook for authentication
export const useAuth = () => {
  const user = AuthService.getCurrentUser();
  
  return {
    user,
    isAuthenticated: AuthService.isAuthenticated(),
    isSuperAdmin: AuthService.isSuperAdmin(),
    isMerchant: AuthService.isMerchant(),
    isCustomer: AuthService.isCustomer(),
    hasPermission: AuthService.hasPermission,
    hasRole: AuthService.hasRole,
    login: AuthService.login,
    logout: AuthService.logout
  };
};
