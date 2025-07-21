import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { 
  ShoppingBag, 
  Building, 
  Briefcase, 
  Megaphone, 
  Wrench, 
  Package,
  MapPin,
  Star,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";

export default function Index() {
      const stats = [
    { icon: "🛍️", value: "+50", label: "متجر متوفر", color: "bg-gradient-to-br from-primary-600 to-primary-800" },
    { icon: "📦", value: "+1000", label: "منتج متاح", color: "bg-gradient-to-br from-secondary-500 to-secondary-700" },
    { icon: "👤", value: "+25", label: "أيام فعلي", color: "bg-gradient-to-br from-primary-500 to-primary-700" },
    { icon: "🏪", value: "+200", label: "خدمة متوفرة", color: "bg-gradient-to-br from-secondary-400 to-secondary-600" },
  ];

  const services = [
        {
      icon: <ShoppingBag className="w-8 h-8 text-primary-600" />,
      title: "السوق التجاري",
      description: "تسوق آمن من المتاجر السودانية المعتمدة",
      href: "/marketplace"
    },
    {
      icon: <Package className="w-8 h-8 text-secondary-600" />,
      title: "المنتجات السودانية",
      description: "أفضل المنتجات التقليدية والحديثة من السودان",
      href: "/products"
    },
    {
      icon: <Building className="w-8 h-8 text-primary-600" />,
      title: "دليل الشركات",
      description: "دليل شامل للشركات والأعمال السودانية",
      href: "/companies"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-secondary-600" />,
      title: "فرص العمل",
      description: "وظائف متنوعة للمهنيين السودانيين",
      href: "/jobs"
    },
    {
      icon: <Megaphone className="w-8 h-8 text-primary-600" />,
      title: "الإعلانات والعروض",
      description: "أحدث العروض والإعلانات التجارية",
      href: "/ads"
    },
    {
      icon: <Wrench className="w-8 h-8 text-secondary-600" />,
      title: "الخدمات المهنية",
      description: "مقدمو خدمات ومهنيون ماهرون",
      href: "/services"
    },
  ];

  const features = [
        {
      icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
      title: "خدمة عملاء مميزة",
      description: "دعم فني على مدار 24/7 للمستخدمين"
    },
    {
      icon: <Star className="w-6 h-6 text-secondary-600" />,
      title: "جودة مضمونة",
      description: "جميع الخدمات والمنتجات معتمدة ومضمونة"
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary-600" />,
      title: "توصيل سريع",
      description: "خدمة توصيل سريعة لجميع دول الخليج"
    },
    {
      icon: <Users className="w-6 h-6 text-secondary-600" />,
      title: "مجتمع متصل",
      description: "شبكة واسعة من السودانيين في الخليج والعالم"
    },
  ];

  return (
    <Layout>
                  {/* Hero Section */}
      <section className="relative text-white py-32 overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb1a0c751ea8f428fb17cf787dc4c95b1%2Fada8ce46064846e687a3341dd0ab9c15?format=webp&width=1200')`
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-orange-900/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 arabic">
              البيت السوداني
            </h1>
            <p className="text-xl md:text-2xl mb-8 arabic opacity-95">
              سوق وخدمات وشركات ا��سودان في الخليج والعالم
            </p>
            <p className="text-lg mb-10 arabic opacity-90 max-w-3xl mx-auto leading-relaxed">
              انضم واشترك لتحصل على أفضل العروض والخدمات من البيت السوداني، شبكة التواصل التجاري الأولى للسودانيين في الخليج
            </p>
                                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 hover:shadow-xl px-10 py-4 text-lg arabic w-full sm:w-auto rounded-xl font-semibold">
                  🛍️ تصفح السوق
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-10 py-4 text-lg arabic w-full sm:w-auto rounded-xl font-semibold">
                  📞 سجل دخولك الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className={`${stat.color} text-white border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90 arabic">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 arabic">لماذا البيت السوداني؟</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto arabic">
              نقدم لك أفضل الخدمات السودانية مع ضمان الجودة والأمان
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
                            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-3 rounded-2xl bg-white">
                <CardContent className="p-8 text-center">
                                    <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center group-hover:from-primary-100 group-hover:to-secondary-100 transition-all duration-300 shadow-lg">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 arabic text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-6 arabic leading-relaxed">{service.description}</p>
                                                      <Link to={service.href}>
                    <Button className="w-full arabic rounded-xl font-semibold">
                      اكتشف المزيد →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 arabic">
                مميزات البيت السوداني
              </h2>
              <p className="text-lg text-gray-600 mb-8 arabic leading-relaxed">
                انضم إلى أكبر مجتمع سوداني في الخليج واحصل على أفضل الخدمات والعروض
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 arabic">{feature.title}</h3>
                      <p className="text-gray-600 arabic">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
                                          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 arabic">ابدأ رحلتك معنا اليوم</h3>
                <p className="mb-6 arabic opacity-90">
                  انضم إلى آلاف العملاء الراضين في البيت السوداني
                </p>
                                                <Link to="/register">
                  <Button size="lg" className="w-full bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 arabic rounded-xl font-semibold">
                    سجل دخولك الآن →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-primary-800 via-primary-700 to-secondary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 arabic">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl mb-8 arabic opacity-90 max-w-2xl mx-auto">
            انضم إلى الآلاف من العملاء الراضين في البيت السوداني
          </p>
                              <Link to="/register">
            <Button size="lg" className="bg-white text-secondary-700 hover:bg-gray-100 px-12 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 arabic rounded-xl font-semibold">
              سجل دخولك الآن →
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
