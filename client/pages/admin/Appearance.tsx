import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Palette, Construction } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminAppearance() {
  const { t, isRTL } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  {t("common.back", "العودة")}
                </Button>
              </Link>
              <div>
                <h1 className={`text-2xl font-bold text-gray-900 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("dashboard.appearance", "تخصيص المظهر")}
                </h1>
                <p className={`text-gray-600 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("common.coming_soon", "قريباً - قيد التطوير")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-20">
          <CardContent>
            <Palette className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 arabic ${isRTL ? 'text-right' : 'text-center'}`}>
              {t("common.under_development", "صفحة قيد التطوير")}
            </h2>
            <p className={`text-gray-600 arabic mb-6 max-w-md mx-auto ${isRTL ? 'text-right' : 'text-center'}`}>
              {t("appearance.coming_soon_desc", "صفحة تخصيص المظهر ستكون متاحة قريباً لتغيير الألوان والصور والخلفيات")}
            </p>
            <div className={`flex gap-4 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Link to="/admin/settings">
                <Button variant="outline" className="arabic">
                  {t("settings.current_settings", "إعدادات التطبيق الحالية")}
                </Button>
              </Link>
              <Link to="/admin/dashboard">
                <Button className="arabic">
                  {t("common.back_to_dashboard", "العودة للوحة الرئيسية")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
