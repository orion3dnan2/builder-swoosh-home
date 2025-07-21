import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Search, Filter } from "lucide-react";

export default function Services() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-sudan-brown to-amber-700 rounded-full flex items-center justify-center">
              <Wrench className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 arabic">الخدمات المهنية</h1>
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
              <Button variant="outline" className="flex items-center gap-2 arabic">
                <Filter className="w-4 h-4" />
                تصفية النتائج
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Content */}
        <div className="text-center py-20">
          <Wrench className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-400 mb-4 arabic">قريباً...</h2>
          <p className="text-gray-500 mb-8 arabic max-w-md mx-auto">
            نعمل على جمع أفضل مقدمي الخدمات السودانيين في مكان واحد.
          </p>
                    <Button size="lg" className="bg-gradient-to-r from-sudan-brown to-amber-700 text-white hover:from-sudan-brown/90 hover:to-amber-700/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 arabic px-8">
            كن أول من يعلم عند الإطلاق 🔔
          </Button>
        </div>
      </div>
    </Layout>
  );
}
