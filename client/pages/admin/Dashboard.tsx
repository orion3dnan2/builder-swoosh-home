import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Users,
  Store,
  Package,
  TrendingUp,
  Shield,
  Palette,
  Globe,
  Eye,
  Activity,
  MessageSquare,
  Star,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, isRTL } = useTheme();
  const [stats] = useState({
    totalUsers: 1247,
    totalMerchants: 89,
    totalProducts: 3456,
    totalOrders: 892,
    monthlyRevenue: 125670,
    activeStores: 67,
    pendingApprovals: 12,
    newRegistrations: 23,
  });

  const quickActions = [
    {
      titleKey: "dashboard.app_settings",
      descriptionKey: "dashboard.app_settings_desc",
      icon: Settings,
      href: "/admin/settings",
      color: "from-blue-500 to-blue-600",
      urgent: false,
    },
    {
      titleKey: "dashboard.user_management",
      descriptionKey: "dashboard.user_management_desc",
      icon: Users,
      href: "/admin/users",
      color: "from-green-500 to-green-600",
      urgent: false,
    },
    {
      titleKey: "dashboard.store_management",
      descriptionKey: "dashboard.store_management_desc",
      icon: Store,
      href: "/admin/stores",
      color: "from-purple-500 to-purple-600",
      urgent: stats.pendingApprovals > 0,
    },
    {
      titleKey: "dashboard.appearance",
      descriptionKey: "dashboard.appearance_desc",
      icon: Palette,
      href: "/admin/appearance",
      color: "from-pink-500 to-pink-600",
      urgent: false,
    },
    {
      titleKey: "dashboard.system_settings",
      descriptionKey: "dashboard.system_settings_desc",
      icon: Shield,
      href: "/admin/system",
      color: "from-red-500 to-red-600",
      urgent: false,
    },
    {
      titleKey: "dashboard.content_management",
      descriptionKey: "dashboard.content_management_desc",
      icon: Globe,
      href: "/admin/content",
      color: "from-orange-500 to-orange-600",
      urgent: false,
    },
  ];

  const recentActivity = [
    {
      actionKey: "dashboard.activity.new_store",
      userKey: "dashboard.user.ahmed_mohamed",
      timeKey: "dashboard.time.15_minutes_ago",
      type: "store",
    },
    {
      actionKey: "dashboard.activity.product_approval",
      userKey: "dashboard.user.fatima_abdullah",
      timeKey: "dashboard.time.30_minutes_ago",
      type: "product",
    },
    {
      actionKey: "dashboard.activity.negative_review",
      userKey: "dashboard.user.mohamed_ali",
      timeKey: "dashboard.time.1_hour_ago",
      type: "review",
    },
    {
      actionKey: "dashboard.activity.support_request",
      userKey: "dashboard.user.aisha_ahmed",
      timeKey: "dashboard.time.2_hours_ago",
      type: "support",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  {t("dashboard.admin")}
                </h1>
                <p className="text-gray-600 arabic">
                  {t("dashboard.welcome")} {user?.profile.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="secondary" className="arabic">
                {t("dashboard.super_admin")}
              </Badge>
              <Link to="/">
                <Button variant="outline" size="sm" className="arabic">
                  <Eye className="w-4 h-4 ml-2" />
                  {t("dashboard.view_site")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-blue-600 text-sm arabic">
                    {t("dashboard.total_users")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-green-800">
                    {stats.totalMerchants}
                  </p>
                  <p className="text-green-600 text-sm arabic">
                    {t("dashboard.registered_stores")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-purple-800">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                  <p className="text-purple-600 text-sm arabic">
                    {t("dashboard.total_products")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-orange-800">
                    ${stats.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-orange-600 text-sm arabic">
                    {t("dashboard.monthly_revenue")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center arabic">
              <Activity className="w-5 h-5 ml-2" />
              {t("dashboard.quick_actions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                                                        <h3 className="font-semibold text-gray-900 arabic flex items-center">
                              {t(action.titleKey)}
                              {action.urgent && (
                                <Badge
                                  variant="destructive"
                                  className="mr-2 text-xs"
                                >
                                  {t("dashboard.urgent")}
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 arabic mt-1">
                              {t(action.descriptionKey)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center arabic">
                <MessageSquare className="w-5 h-5 ml-2" />
                {t("dashboard.recent_activity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "store"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "product"
                            ? "bg-green-100 text-green-600"
                            : activity.type === "review"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {activity.type === "store" && (
                        <Store className="w-4 h-4" />
                      )}
                      {activity.type === "product" && (
                        <Package className="w-4 h-4" />
                      )}
                      {activity.type === "review" && (
                        <Star className="w-4 h-4" />
                      )}
                      {activity.type === "support" && (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 arabic">
                        {t(activity.actionKey)}
                      </p>
                      <p className="text-xs text-gray-600 arabic">
                        {t("dashboard.by")} {t(activity.userKey)} • {t(activity.timeKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/admin/activity">
                  <Button variant="outline" size="sm" className="w-full arabic">
                                        {t("dashboard.view_all_activities")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center arabic">
                                <BarChart3 className="w-5 h-5 ml-2" />
                {t("dashboard.quick_stats")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900 arabic">
                                        {t("dashboard.active_stores")}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.activeStores}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-900 arabic">
                                        {t("dashboard.pending_approvals")}
                  </span>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.pendingApprovals}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-900 arabic">
                                        {t("dashboard.new_registrations")}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {stats.newRegistrations}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-900 arabic">
                                        {t("dashboard.total_orders")}
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {stats.totalOrders}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/admin/analytics">
                  <Button variant="outline" size="sm" className="w-full arabic">
                                        {t("dashboard.view_detailed_reports")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <TranslationTest />
    </div>
  );
}
