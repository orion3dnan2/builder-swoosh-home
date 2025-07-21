import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star, 
  TrendingUp, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  ShoppingBag,
  Building2,
  Briefcase,
  Wrench,
  Megaphone,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const { t, isRTL } = useTheme();

  const heroStats = [
    { 
      icon: Users, 
      number: "100K+", 
      labelKey: "stats.users",
      label: isRTL ? "مستخدم نشط" : "Active Users"
    },
    { 
      icon: Building2, 
      number: "5K+", 
      labelKey: "stats.companies",
      label: isRTL ? "شركة مسجلة" : "Registered Companies"
    },
    { 
      icon: ShoppingBag, 
      number: "50K+", 
      labelKey: "stats.products",
      label: isRTL ? "منتج متوفر" : "Available Products"
    },
    { 
      icon: Briefcase, 
      number: "2K+", 
      labelKey: "stats.jobs",
      label: isRTL ? "فرصة عمل" : "Job Opportunities"
    }
  ];

  const services = [
    {
      icon: ShoppingBag,
      titleKey: "services.marketplace.title",
      title: isRTL ? "السوق التجاري" : "Marketplace",
      descKey: "services.marketplace.desc",
      description: isRTL ? "اكتشف منتجات سودانية أصيلة من تجار موثوقين" : "Discover authentic Sudanese products from trusted merchants",
      href: "/marketplace",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Building2,
      titleKey: "services.companies.title", 
      title: isRTL ? "دليل الشركات" : "Company Directory",
      descKey: "services.companies.desc",
      description: isRTL ? "تواصل مع الشركات والمؤسسات السودانية في الخليج" : "Connect with Sudanese companies and institutions in the Gulf",
      href: "/companies",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Briefcase,
      titleKey: "services.jobs.title",
      title: isRTL ? "لوحة الوظائف" : "Job Board", 
      descKey: "services.jobs.desc",
      description: isRTL ? "ابحث عن فرص عمل مناسبة أو أعلن عن وظائف شاغرة" : "Find suitable job opportunities or post job vacancies",
      href: "/jobs",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Wrench,
      titleKey: "services.services.title",
      title: isRTL ? "الخدمات المهنية" : "Professional Services",
      descKey: "services.services.desc", 
      description: isRTL ? "احصل على خدمات مهنية متخصصة من خبراء سودانيين" : "Get specialized professional services from Sudanese experts",
      href: "/services",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      icon: Megaphone,
      titleKey: "services.ads.title",
      title: isRTL ? "الإعلانات" : "Advertisements",
      descKey: "services.ads.desc",
      description: isRTL ? "روج لأعمالك وخدماتك للمجتمع السوداني" : "Promote your business and services to the Sudanese community",
      href: "/ads",
      color: "from-red-500 to-red-600", 
      bgColor: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  const testimonials = [
    {
      name: isRTL ? "أحمد محمد" : "Ahmed Mohamed",
      role: isRTL ? "صاحب متجر" : "Store Owner",
      content: isRTL ? "البيت السوداني ساعدني في الوصول لعملاء جدد وتنمية تجارتي بشكل كبير" : "Sudan House helped me reach new customers and grow my business significantly",
      rating: 5
    },
    {
      name: isRTL ? "فاطمة عبدالله" : "Fatima Abdullah", 
      role: isRTL ? "مديرة شركة" : "Company Manager",
      content: isRTL ? "منصة ممتازة للتواصل مع الشركات السودانية وإقامة شراكات تجارية" : "Excellent platform for connecting with Sudanese companies and establishing business partnerships",
      rating: 5
    },
    {
      name: isRTL ? "عمر الحسن" : "Omar Al-Hassan",
      role: isRTL ? "باحث عن عمل" : "Job Seeker", 
      content: isRTL ? "وجدت وظيفة أحلامي من ��لال البيت السوداني في وقت قياسي" : "I found my dream job through Sudan House in record time",
      rating: 5
    }
  ];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb1a0c751ea8f428fb17cf787dc4c95b1%2Fada8ce46064846e687a3341dd0ab9c15?format=webp&width=1200')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-secondary-800/80 dark:from-primary-950/90 dark:via-primary-900/80 dark:to-secondary-900/90" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className={`max-w-4xl mx-auto text-center ${isRTL ? 'text-right' : 'text-center'}`}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 arabic animate-fade-in">
              {t('brand.name')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 arabic leading-relaxed animate-slide-up">
              {t('brand.description')}
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/marketplace">
                <Button size="lg" className="button-cultural px-8 py-4 text-lg arabic">
                  {isRTL ? "استكشف السوق" : "Explore Marketplace"}
                  <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-primary-700 arabic">
                  {isRTL ? "انضم إلينا" : "Join Us"}
                </Button>
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {heroStats.map((stat, index) => (
                <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                    <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm md:text-base text-white/80 arabic">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 arabic">
              {isRTL ? "خدماتنا" : "Our Services"}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground arabic max-w-3xl mx-auto">
              {isRTL ? "مجموعة شاملة من الخدمات المصممة خصيصاً للمجتمع السوداني في الخليج والعالم" : "A comprehensive range of services designed specifically for the Sudanese community in the Gulf and worldwide"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-dark hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto ${service.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-8 h-8 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} />
                  </div>
                  <CardTitle className={`text-xl font-bold arabic ${isRTL ? 'text-right' : 'text-center'}`}>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isRTL ? 'text-right' : 'text-center'}>
                  <p className="text-muted-foreground arabic mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link to={service.href}>
                    <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 transition-opacity arabic`}>
                      {isRTL ? "اكتشف المزيد" : "Discover More"}
                      <ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 arabic">
              {isRTL ? "آراء عملائنا" : "Customer Testimonials"}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground arabic">
              {isRTL ? "ماذا يقول عملاؤنا عن تجربتهم معنا" : "What our customers say about their experience with us"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-dark animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className={`flex items-center gap-1 mb-4 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className={`text-muted-foreground arabic mb-6 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    "{testimonial.content}"
                  </p>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="font-semibold text-foreground arabic">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground arabic">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 arabic">
            {isRTL ? "ابدأ رحلتك معنا اليوم" : "Start Your Journey With Us Today"}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 arabic max-w-2xl mx-auto">
            {isRTL ? "انضم إلى آلاف السودانيين الذين يستخدمون البيت السوداني لتنمية أعمالهم وخدماتهم" : "Join thousands of Sudanese who use Sudan House to grow their businesses and services"}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg arabic bg-white text-primary-700 hover:bg-white/90">
                {isRTL ? "إنشاء حساب مجاني" : "Create Free Account"}
                <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/20 text-white hover:bg-white/10 arabic">
                {isRTL ? "تسجيل الدخول" : "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
