import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Search, Filter, Hammer, Paintbrush, Car, Home, Laptop, Heart, GraduationCap, Camera } from "lucide-react";

export default function Services() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 arabic">
            الخدمات المهنية
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto arabic">
            مقدمو خدمات ومهنيون ماهرون لجميع احتياجاتك
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في الخدمات..."
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg text-right arabic"
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 arabic"
              >
                <Filter className="w-4 h-4" />
                تصفية النتائج
              </Button>
            </div>
          </CardContent>
        </Card>

                {/* Service Categories Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Construction & Repairs */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Hammer className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">البناء والتشييد</h3>
            <p className="text-sm text-gray-600 arabic">مقاولون ومختصو التشييد والصيانة</p>
          </Card>

          {/* Design & Arts */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <PaintBrush className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">التصميم والفنون</h3>
            <p className="text-sm text-gray-600 arabic">مصممون وفنانون متخصصون</p>
          </Card>

          {/* Automotive */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">السيارات</h3>
            <p className="text-sm text-gray-600 arabic">صيانة وإصلاح الم��كبات</p>
          </Card>

          {/* Home Services */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">الخدمات المنزلية</h3>
            <p className="text-sm text-gray-600 arabic">تنظيف وصيانة منزلية</p>
          </Card>

          {/* Technology */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <Laptop className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">التكنولوجيا</h3>
            <p className="text-sm text-gray-600 arabic">برمجة وتطوير وإصلاح أجهزة</p>
          </Card>

          {/* Health & Wellness */}
          <Card className="text-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 arabic">الصحة والعافية</h3>
            <p className="text-sm text-gray-600 arabic">خدمات طبية ورياضية</p>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-12">
          <Settings className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-400 mb-4 arabic">
            قريباً...
          </h2>
          <p className="text-gray-500 mb-8 arabic max-w-md mx-auto">
            نعمل على جمع أفضل مقدمي الخدمات السودانيين في مكان واحد.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 arabic px-8"
          >
            كن أول من يعلم عند الإطلاق ����
          </Button>
        </div>
      </div>
    </Layout>
  );
}
