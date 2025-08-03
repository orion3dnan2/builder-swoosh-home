import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Store,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  Check,
  X,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Package,
  TrendingUp,
  Phone,
  Mail,
  Star,
  Clock,
  DollarSign,
  Settings,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Shield,
  Key,
  Zap,
  Award,
  FileText,
  Upload,
  Download,
  RefreshCw,
  Bell,
  Send,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Crown,
  Users,
  BarChart3,
  CreditCard,
  Palette,
  Database,
  Megaphone,
  Gift,
  Target,
  Layers,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ExternalLink,
  History,
  ShoppingCart,
  Truck,
  Globe,
  Lock,
  Unlock,
  Ban,
  Handshake,
  Star as StarOutline,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

interface StoreData {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "suspended" | "featured" | "premium";
  category: string;
  location: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  reviews: number;
  joinDate: string;
  lastActive: string;
  plan: "basic" | "premium" | "enterprise";
  permissions: {
    canSell: boolean;
    canShip: boolean;
    canPromote: boolean;
    canExport: boolean;
    canAnalytics: boolean;
  };
  supportTickets: number;
  commission: number;
  verified: boolean;
  featured: boolean;
  tags: string[];
}

interface SupportTicket {
  id: string;
  storeId: string;
  storeName: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  lastUpdate: string;
}

export default function AdminStores() {
  const { user } = useAuth();
  const { t, isRTL } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("stores");
  const [supportMessage, setSupportMessage] = useState("");
  const [directMessage, setDirectMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    storeId: string;
    storeName: string;
  } | null>(null);

  // Mock store data with enhanced features
  const [stores, setStores] = useState<StoreData[]>([
    {
      id: "store-001",
      name: "متجر الخير السوداني",
      owner: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+966501234567",
      status: "featured",
      category: "مواد غذائية",
      location: "الرياض، السعودية",
      products: 145,
      orders: 428,
      revenue: 45420,
      rating: 4.8,
      reviews: 189,
      joinDate: "2024-01-15",
      lastActive: "منذ ساعة",
      plan: "premium",
      permissions: {
        canSell: true,
        canShip: true,
        canPromote: true,
        canExport: true,
        canAnalytics: true,
      },
      supportTickets: 2,
      commission: 5,
      verified: true,
      featured: true,
      tags: ["أفضل البائعين", "موثق", "مميز"],
    },
    {
      id: "store-002",
      name: "العطور السودانية الأصيلة",
      owner: "��اطمة عبدالله",
      email: "fatima@example.com",
      phone: "+966509876543",
      status: "pending",
      category: "عطور ومست��ضرات",
      location: "جدة، الس��ودية",
      products: 23,
      orders: 67,
      revenue: 8900,
      rating: 4.3,
      reviews: 45,
      joinDate: "2024-02-20",
      lastActive: "منذ 3 ساعات",
      plan: "basic",
      permissions: {
        canSell: false,
        canShip: false,
        canPromote: false,
        canExport: false,
        canAnalytics: false,
      },
      supportTickets: 1,
      commission: 8,
      verified: false,
      featured: false,
      tags: ["جديد"],
    },
    {
      id: "store-003",
      name: "الحرف اليدوية السودانية",
      owner: "محمد الطاهر",
      email: "mohamed@example.com",
      phone: "+966512345678",
      status: "active",
      category: "حرف يدوية",
      location: "الدمام، السعودية",
      products: 67,
      orders: 156,
      revenue: 12750,
      rating: 4.5,
      reviews: 92,
      joinDate: "2024-01-08",
      lastActive: "منذ 30 دقيقة",
      plan: "basic",
      permissions: {
        canSell: true,
        canShip: true,
        canPromote: false,
        canExport: false,
        canAnalytics: true,
      },
      supportTickets: 0,
      commission: 8,
      verified: true,
      featured: false,
      tags: ["موثق"],
    },
    {
      id: "store-004",
      name: "الألبسة التراثية",
      owner: "عائشة السيد",
      email: "aisha@example.com",
      phone: "+966587654321",
      status: "suspended",
      category: "ملابس",
      location: "مكة، السعودية",
      products: 34,
      orders: 89,
      revenue: 7650,
      rating: 3.9,
      reviews: 67,
      joinDate: "2024-03-01",
      lastActive: "منذ يومين",
      plan: "basic",
      permissions: {
        canSell: false,
        canShip: false,
        canPromote: false,
        canExport: false,
        canAnalytics: false,
      },
      supportTickets: 3,
      commission: 8,
      verified: false,
      featured: false,
      tags: ["معلق"],
    },
  ]);

  // Mock support tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "ticket-001",
      storeId: "store-001",
      storeName: "متجر الخير السوداني",
      subject: "مشكلة في عرض المنتجات",
      message: "أوا��ه مشكلة في ظهور بعض المن����جات في المتجر",
      priority: "medium",
      status: "open",
      createdAt: "2024-03-15",
      lastUpdate: "منذ ساعتين",
    },
    {
      id: "ticket-002",
      storeId: "store-002",
      storeName: "العطور السودانية الأصيلة",
      subject: "طلب تفعيل المتجر",
      message: "أرجو تفعيل متجري لبدء البيع",
      priority: "high",
      status: "in-progress",
      createdAt: "2024-03-14",
      lastUpdate: "منذ يوم",
    },
    {
      id: "ticket-003",
      storeId: "store-004",
      storeName: "الألبسة التراثية",
      subject: "استفسار حول سبب التعليق",
      message: "لماذا تم تعليق متجري؟ أريد معرفة الأسباب",
      priority: "urgent",
      status: "open",
      createdAt: "2024-03-13",
      lastUpdate: "منذ 3 أيام",
    },
  ]);

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || store.status === selectedStatus;
    const matchesPlan = selectedPlan === "all" || store.plan === selectedPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "featured":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "في الانتظار";
      case "suspended":
        return "معلق";
      case "featured":
        return "مميز";
      case "premium":
        return "بريميوم";
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "premium":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case "basic":
        return "أساسي";
      case "premium":
        return "مميز";
      case "enterprise":
        return "مؤسسي";
      default:
        return plan;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Action handlers
  const handleViewDetails = (store: StoreData) => {
    setSelectedStore(store);
    setIsDetailModalOpen(true);
  };

  const handleManagePermissions = (store: StoreData) => {
    setSelectedStore(store);
    setIsPermissionModalOpen(true);
  };

  const handleContactStore = (store: StoreData) => {
    setSelectedStore(store);
    setIsMessageModalOpen(true);
  };

  const handleSupportTicket = (store: StoreData) => {
    setSelectedStore(store);
    setIsSupportModalOpen(true);
  };

  const openConfirmModal = (
    type: string,
    storeId: string,
    storeName: string,
  ) => {
    setConfirmAction({ type, storeId, storeName });
    setIsConfirmModalOpen(true);
  };

  const executeAction = () => {
    if (!confirmAction) return;

    const { type, storeId } = confirmAction;
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.id === storeId) {
          switch (type) {
            case "approve":
              return { ...store, status: "active" as const };
            case "suspend":
              return { ...store, status: "suspended" as const };
            case "reactivate":
              return { ...store, status: "active" as const };
            case "block":
              return {
                ...store,
                status: "suspended" as const,
                tags: updateStoreTags(store.tags, "مجدد حديثاً", "موقف"),
              };
            case "renew":
              // تجدي�� الاشتراك - يمكن إضافة منطق تاريخ الانتهاء هنا
              return {
                ...store,
                tags: updateStoreTags(
                  store.tags,
                  "منتهي الصلاحية",
                  "مجدد حديثاً",
                ),
              };
            case "feature":
              return { ...store, status: "featured" as const, featured: true };
            case "unfeature":
              return { ...store, status: "active" as const, featured: false };
            case "verify":
              return { ...store, verified: true };
            case "unverify":
              return { ...store, verified: false };
            default:
              return store;
          }
        }
        return store;
      }),
    );

    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  // Helper function to manage tags without duplicates
  const updateStoreTags = (
    currentTags: string[],
    removeTag?: string,
    addTag?: string,
  ): string[] => {
    let newTags = [...currentTags];

    // Remove specified tag if exists
    if (removeTag) {
      newTags = newTags.filter((tag) => tag !== removeTag);
    }

    // Add new tag if provided and not already exists
    if (addTag && !newTags.includes(addTag)) {
      newTags.push(addTag);
    }

    return newTags;
  };

  const updatePermissions = (
    storeId: string,
    permissions: StoreData["permissions"],
  ) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, permissions } : store,
      ),
    );
  };

  const sendDirectMessage = () => {
    // Here you would implement the actual message sending logic
    console.log("Message sent to store:", selectedStore?.name, directMessage);
    setDirectMessage("");
    setIsMessageModalOpen(false);
  };

  const createSupportTicket = () => {
    if (!selectedStore) return;

    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      storeId: selectedStore.id,
      storeName: selectedStore.name,
      subject: "مساعدة من إدارة التطبيق",
      message: supportMessage,
      priority: "medium",
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdate: "الآن",
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    setSupportMessage("");
    setIsSupportModalOpen(false);
  };

  // Statistics
  const totalStores = stores.length;
  const activeStores = stores.filter((s) => s.status === "active").length;
  const pendingStores = stores.filter((s) => s.status === "pending").length;
  const suspendedStores = stores.filter((s) => s.status === "suspended").length;
  const featuredStores = stores.filter((s) => s.featured).length;
  const verifiedStores = stores.filter((s) => s.verified).length;
  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);
  const totalOrders = stores.reduce((sum, store) => sum + store.orders, 0);
  const totalProducts = stores.reduce((sum, store) => sum + store.products, 0);
  const openTickets = supportTickets.filter((t) => t.status === "open").length;
  const urgentTickets = supportTickets.filter(
    (t) => t.priority === "urgent",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center py-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex items-center space-x-4 space-x-reverse ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  إدارة المتاجر المتقدمة
                </h1>
                <p className="text-gray-600 arabic">
                  التحكم الكامل ومساعدة أصحاب المتاجر ({totalStores} متجر)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Badge variant="secondary" className="arabic">
                مدير أعلى
              </Badge>
              <Button className="arabic bg-purple-600 hover:bg-purple-700">
                <Crown className="w-4 h-4 ml-2" />
                صلاحيات المدير
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-blue-800">
                    {totalStores}
                  </p>
                  <p className="text-blue-600 text-sm arabic">
                    إجم��لي المتاجر
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-green-800">
                    {activeStores}
                  </p>
                  <p className="text-green-600 text-sm arabic">متاجر نشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-purple-800">
                    {featuredStores}
                  </p>
                  <p className="text-purple-600 text-sm arabic">متاجر مميزة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-indigo-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-indigo-800">
                    {verifiedStores}
                  </p>
                  <p className="text-indigo-600 text-sm arabic">متاجر موثقة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-emerald-800">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-emerald-600 text-sm arabic">
                    إجمالي الإيرادات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-red-800">
                    {openTickets}
                  </p>
                  <p className="text-red-600 text-sm arabic">تذاكر الدعم</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Tabs System */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stores" className="arabic">
              إدارة المتاجر
            </TabsTrigger>
            <TabsTrigger value="permissions" className="arabic">
              الصلاحيات والأذونات
            </TabsTrigger>
            <TabsTrigger value="support" className="arabic">
              الدعم والمساعدة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="arabic">
              التحليلات المتقدمة
            </TabsTrigger>
          </TabsList>

          {/* Stores Management Tab */}
          <TabsContent value="stores" className="space-y-6">
            {/* Enhanced Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${isRTL ? "right-3" : "left-3"}`}
                    />
                    <Input
                      placeholder="البحث في المتاجر..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} arabic`}
                    />
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 arabic text-right"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="pending">في الانتظار</option>
                    <option value="suspended">م��لق</option>
                    <option value="featured">مميز</option>
                  </select>

                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 arabic text-right"
                  >
                    <option value="all">جميع الخطط</option>
                    <option value="basic">أساسي</option>
                    <option value="premium">مميز</option>
                    <option value="enterprise">مؤسسي</option>
                  </select>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 arabic">
                      {filteredStores.length} من {totalStores} ��تجر
                    </span>
                    <Button variant="outline" size="sm" className="arabic">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير البيانات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStores.map((store) => (
                <Card
                  key={store.id}
                  className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-6">
                    {/* Store Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <h3 className="text-lg font-bold text-gray-900 arabic">
                            {store.name}
                          </h3>
                          {store.verified && (
                            <Shield
                              className="w-5 h-5 text-blue-500"
                              title="متجر موثق"
                            />
                          )}
                          {store.featured && (
                            <Crown
                              className="w-5 h-5 text-purple-500"
                              title="متجر مميز"
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 arabic">
                            {store.owner}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 arabic">
                            {store.location}
                          </span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="arabic w-56"
                        >
                          {/* الإجراءات المهمة والأساسية */}
                          {store.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal(
                                  "approve",
                                  store.id,
                                  store.name,
                                )
                              }
                              className="text-green-600 font-semibold"
                            >
                              <Check className="w-4 h-4 ml-2" />✅ قبول ال��تجر
                            </DropdownMenuItem>
                          )}

                          {store.status === "active" && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal(
                                  "suspend",
                                  store.id,
                                  store.name,
                                )
                              }
                              className="text-orange-600 font-semibold"
                            >
                              <AlertTriangle className="w-4 h-4 ml-2" />
                              ⏸️ تعليق المتجر
                            </DropdownMenuItem>
                          )}

                          {(store.status === "active" ||
                            store.status === "featured") && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal("block", store.id, store.name)
                              }
                              className="text-red-600 font-semibold"
                            >
                              <Ban className="w-4 h-4 ml-2" />
                              🚫 إيقاف المتجر
                            </DropdownMenuItem>
                          )}

                          {store.status === "suspended" && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal(
                                  "reactivate",
                                  store.id,
                                  store.name,
                                )
                              }
                              className="text-blue-600 font-semibold"
                            >
                              <RefreshCw className="w-4 h-4 ml-2" />
                              🔄 إعادة ��فعيل
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() =>
                              openConfirmModal("renew", store.id, store.name)
                            }
                            className="text-purple-600 font-semibold"
                          >
                            <Calendar className="w-4 h-4 ml-2" />
                            📅 تجديد الاشتراك
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* الإجراءات الثانوية */}
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(store)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض ��لتفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleManagePermissions(store)}
                          >
                            <Key className="w-4 h-4 ml-2" />
                            إدارة الص��احيات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleContactStore(store)}
                          >
                            <MessageSquare className="w-4 h-4 ml-2" />
                            إرس��ل رسالة
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSupportTicket(store)}
                          >
                            <HelpCircle className="w-4 h-4 ml-2" />
                            ��قديم المساعدة
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* إجراءات إضافية */}
                          {store.status === "active" && !store.featured && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal(
                                  "feature",
                                  store.id,
                                  store.name,
                                )
                              }
                            >
                              <Crown className="w-4 h-4 ml-2" />
                              جعله مميزاً
                            </DropdownMenuItem>
                          )}
                          {store.featured && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal(
                                  "unfeature",
                                  store.id,
                                  store.name,
                                )
                              }
                            >
                              <X className="w-4 h-4 ml-2" />
                              إلغاء التمييز
                            </DropdownMenuItem>
                          )}
                          {!store.verified && (
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmModal("verify", store.id, store.name)
                              }
                            >
                              <Shield className="w-4 h-4 ml-2" />
                              التوثيق
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Status and Plan Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(store.status)}>
                        {getStatusText(store.status)}
                      </Badge>
                      <Badge className={getPlanColor(store.plan)}>
                        خطة {getPlanText(store.plan)}
                      </Badge>
                      <Badge variant="outline" className="arabic">
                        عمولة {store.commission}%
                      </Badge>
                      {store.tags.map((tag, index) => (
                        <Badge
                          key={`${store.id}-tag-${index}`}
                          variant="secondary"
                          className="arabic"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Store Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {store.products}
                        </div>
                        <div className="text-sm text-gray-600 arabic">منتج</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {store.orders}
                        </div>
                        <div className="text-sm text-gray-600 arabic">طلب</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          ${store.revenue}
                        </div>
                        <div className="text-sm text-gray-600 arabic">
                          إيراد
                        </div>
                      </div>
                    </div>

                    {/* Rating and Support */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{store.rating}</span>
                        <span className="text-gray-500">({store.reviews})</span>
                      </div>
                      {store.supportTickets > 0 && (
                        <Badge variant="destructive" className="arabic">
                          {store.supportTickets} تذكرة دعم
                        </Badge>
                      )}
                    </div>

                    {/* Primary Actions - Important and Visible */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {store.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            openConfirmModal("approve", store.id, store.name)
                          }
                          className="arabic flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 ml-2" />✅ قبول المتجر
                        </Button>
                      )}

                      {store.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openConfirmModal("suspend", store.id, store.name)
                          }
                          className="arabic flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <AlertTriangle className="w-4 h-4 ml-2" />
                          ⏸️ تعليق
                        </Button>
                      )}

                      {store.status === "suspended" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            openConfirmModal("reactivate", store.id, store.name)
                          }
                          className="arabic flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <RefreshCw className="w-4 h-4 ml-2" />
                          🔄 إعادة تفعيل
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openConfirmModal("renew", store.id, store.name)
                        }
                        className="arabic flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        <Calendar className="w-4 h-4 ml-2" />
                        📅 تجديد ��لاشتراك
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(store)}
                        className="arabic flex-1"
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        التفاصيل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactStore(store)}
                        className="arabic flex-1"
                      >
                        <MessageSquare className="w-4 h-4 ml-2" />
                        تواصل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <Store className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 arabic">
                  لا توجد متاجر
                </h3>
                <p className="text-gray-600 arabic">
                  لم يتم العثور على متاجر تطابق معايير البحث
                </p>
              </div>
            )}
          </TabsContent>

          {/* Permissions Management Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="arabic">
                  إدارة الصلاحيات والأذونات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stores.map((store) => (
                    <Card key={store.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="font-semibold arabic">
                              {store.name}
                            </h4>
                            <p className="text-sm text-gray-600 arabic">
                              {store.owner}
                            </p>
                          </div>
                          <Badge className={getStatusColor(store.status)}>
                            {getStatusText(store.status)}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`sell-${store.id}`}
                              className="arabic"
                            >
                              السماح بالبيع
                            </Label>
                            <Switch
                              id={`sell-${store.id}`}
                              checked={store.permissions.canSell}
                              onCheckedChange={(checked) =>
                                updatePermissions(store.id, {
                                  ...store.permissions,
                                  canSell: checked,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`ship-${store.id}`}
                              className="arabic"
                            >
                              السماح بالشحن
                            </Label>
                            <Switch
                              id={`ship-${store.id}`}
                              checked={store.permissions.canShip}
                              onCheckedChange={(checked) =>
                                updatePermissions(store.id, {
                                  ...store.permissions,
                                  canShip: checked,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`promote-${store.id}`}
                              className="arabic"
                            >
                              السماح بالترويج
                            </Label>
                            <Switch
                              id={`promote-${store.id}`}
                              checked={store.permissions.canPromote}
                              onCheckedChange={(checked) =>
                                updatePermissions(store.id, {
                                  ...store.permissions,
                                  canPromote: checked,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`export-${store.id}`}
                              className="arabic"
                            >
                              السماح بتصدير البيانات
                            </Label>
                            <Switch
                              id={`export-${store.id}`}
                              checked={store.permissions.canExport}
                              onCheckedChange={(checked) =>
                                updatePermissions(store.id, {
                                  ...store.permissions,
                                  canExport: checked,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`analytics-${store.id}`}
                              className="arabic"
                            >
                              الوصول للتحليلات
                            </Label>
                            <Switch
                              id={`analytics-${store.id}`}
                              checked={store.permissions.canAnalytics}
                              onCheckedChange={(checked) =>
                                updatePermissions(store.id, {
                                  ...store.permissions,
                                  canAnalytics: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Management Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Support Tickets */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic">تذاكر الدعم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <Card key={ticket.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold arabic">
                                  {ticket.subject}
                                </h4>
                                <p className="text-sm text-gray-600 arabic">
                                  {ticket.storeName}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  {ticket.priority === "urgent"
                                    ? "عاجل"
                                    : ticket.priority === "high"
                                      ? "عالي"
                                      : ticket.priority === "medium"
                                        ? "متوسط"
                                        : "منخفض"}
                                </Badge>
                                <Badge
                                  className={getTicketStatusColor(
                                    ticket.status,
                                  )}
                                >
                                  {ticket.status === "open"
                                    ? "مفتوح"
                                    : ticket.status === "in-progress"
                                      ? "قيد المعالجة"
                                      : ticket.status === "resolved"
                                        ? "محلول"
                                        : "مغلق"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3 arabic">
                              {ticket.message}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 arabic">
                                {ticket.lastUpdate}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="arabic"
                                >
                                  <MessageSquare className="w-4 h-4 ml-2" />
                                  رد
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="arabic"
                                >
                                  <Check className="w-4 h-4 ml-2" />
                                  حل
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full arabic" variant="outline">
                    <Megaphone className="w-4 h-4 ml-2" />
                    إعلان للجميع
                  </Button>
                  <Button className="w-full arabic" variant="outline">
                    <Mail className="w-4 h-4 ml-2" />
                    رسالة جماعية
                  </Button>
                  <Button className="w-full arabic" variant="outline">
                    <Gift className="w-4 h-4 ml-2" />
                    إ��سال عرض خاص
                  </Button>
                  <Button className="w-full arabic" variant="outline">
                    <FileText className="w-4 h-4 ml-2" />
                    دليل المساعدة
                  </Button>
                  <Button className="w-full arabic" variant="outline">
                    <Users className="w-4 h-4 ml-2" />
                    اجتماع جماعي
                  </Button>
                  <Button className="w-full arabic" variant="outline">
                    <Target className="w-4 h-4 ml-2" />
                    تدريب متخصص
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">تحليل الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="arabic">إجمالي الإيرادات</span>
                      <span className="font-bold text-2xl">
                        ${totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">متوسط الإيراد لكل متجر</span>
                      <span className="font-bold">
                        $
                        {Math.round(
                          totalRevenue / totalStores,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">إجمالي الطلبات</span>
                      <span className="font-bold">
                        {totalOrders.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">إجمالي المنتجات</span>
                      <span className="font-bold">
                        {totalProducts.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">تحليل الأداء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="arabic">معدل النشاط</span>
                      <span className="font-bold">
                        {Math.round((activeStores / totalStores) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">معدل التوثيق</span>
                      <span className="font-bold">
                        {Math.round((verifiedStores / totalStores) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">معدل الانتظار</span>
                      <span className="font-bold">
                        {Math.round((pendingStores / totalStores) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="arabic">معدل التمييز</span>
                      <span className="font-bold">
                        {Math.round((featuredStores / totalStores) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Store Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="arabic text-right">
              تفاصيل المتجر الشاملة
            </DialogTitle>
            <DialogDescription className="arabic text-right">
              معلومات مفصلة وأدوات إدارية متقدمة
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right">
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-semibold arabic">اسم المتجر: </span>
                    <span className="arabic">{selectedStore.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold arabic">المالك: </span>
                    <span className="arabic">{selectedStore.owner}</span>
                  </div>
                  <div>
                    <span className="font-semibold arabic">
                      البريد الإلكتروني:{" "}
                    </span>
                    <span>{selectedStore.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold arabic">رقم الهاتف: </span>
                    <span>{selectedStore.phone}</span>
                  </div>
                  <div>
                    <span className="font-semibold arabic">الموقع: </span>
                    <span className="arabic">{selectedStore.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold arabic">الفئة: </span>
                    <span className="arabic">{selectedStore.category}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="font-semibold arabic">الحالة: </span>
                    <Badge className={getStatusColor(selectedStore.status)}>
                      {getStatusText(selectedStore.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right">
                    إحصائيات الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="arabic">إجمالي المنتجات:</span>
                    <span className="font-bold text-blue-600">
                      {selectedStore.products}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">إجمالي الطلبات:</span>
                    <span className="font-bold text-green-600">
                      {selectedStore.orders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">الإيرادات:</span>
                    <span className="font-bold text-purple-600">
                      ${selectedStore.revenue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">التقييم:</span>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold">{selectedStore.rating}</span>
                      <span className="text-gray-500">
                        ({selectedStore.reviews} ت��ييم)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">نسبة العمولة:</span>
                    <span className="font-bold text-orange-600">
                      {selectedStore.commission}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">تاريخ الانض��ام:</span>
                    <span className="font-medium">
                      {selectedStore.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="arabic">آخر ن��اط:</span>
                    <span className="font-medium arabic">
                      {selectedStore.lastActive}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic text-right">
                    إجراءات إدارية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                    onClick={() => handleManagePermissions(selectedStore)}
                  >
                    <Key className="w-4 h-4 ml-2" />
                    إدارة الصلاحيات
                  </Button>
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                    onClick={() => handleContactStore(selectedStore)}
                  >
                    <MessageSquare className="w-4 h-4 ml-2" />
                    إرسال رسالة
                  </Button>
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                    onClick={() => handleSupportTicket(selectedStore)}
                  >
                    <HelpCircle className="w-4 h-4 ml-2" />
                    تقديم المساعدة
                  </Button>
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 ml-2" />
                    تقرير مفصل
                  </Button>
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                  >
                    <Palette className="w-4 h-4 ml-2" />
                    تخصيص المظهر
                  </Button>
                  <Button
                    className="w-full arabic justify-start"
                    variant="outline"
                  >
                    <Gift className="w-4 h-4 ml-2" />
                    عرض خاص
                  </Button>

                  <Separator />

                  {selectedStore.status === "pending" && (
                    <Button
                      className="w-full arabic"
                      onClick={() =>
                        openConfirmModal(
                          "approve",
                          selectedStore.id,
                          selectedStore.name,
                        )
                      }
                    >
                      <Check className="w-4 h-4 ml-2" />
                      اعتماد المتجر
                    </Button>
                  )}

                  {selectedStore.status === "active" &&
                    !selectedStore.featured && (
                      <Button
                        className="w-full arabic"
                        onClick={() =>
                          openConfirmModal(
                            "feature",
                            selectedStore.id,
                            selectedStore.name,
                          )
                        }
                      >
                        <Crown className="w-4 h-4 ml-2" />
                        جعله مميزاً
                      </Button>
                    )}

                  {selectedStore.status === "suspended" && (
                    <Button
                      className="w-full arabic"
                      onClick={() =>
                        openConfirmModal(
                          "reactivate",
                          selectedStore.id,
                          selectedStore.name,
                        )
                      }
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      إعادة تفعيل
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="arabic"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Management Modal */}
      <Dialog
        open={isPermissionModalOpen}
        onOpenChange={setIsPermissionModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="arabic text-right">
              إدارة صلاحيات المتجر
            </DialogTitle>
            <DialogDescription className="arabic text-right">
              تحكم في ال��لاحيات والأذونات الممنوحة للمتجر
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold arabic">{selectedStore.name}</h3>
                <p className="text-gray-600 arabic">{selectedStore.owner}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium arabic">السماح بالبيع</Label>
                    <p className="text-sm text-gray-600 arabic">
                      يمكن للمتجر عرض وبيع المنتجات
                    </p>
                  </div>
                  <Switch
                    checked={selectedStore.permissions.canSell}
                    onCheckedChange={(checked) =>
                      updatePermissions(selectedStore.id, {
                        ...selectedStore.permissions,
                        canSell: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium arabic">السماح بالشحن</Label>
                    <p className="text-sm text-gray-600 arabic">
                      يمكن للمتجر إدارة الشحن والتوصيل
                    </p>
                  </div>
                  <Switch
                    checked={selectedStore.permissions.canShip}
                    onCheckedChange={(checked) =>
                      updatePermissions(selectedStore.id, {
                        ...selectedStore.permissions,
                        canShip: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium arabic">
                      السماح بالترويج
                    </Label>
                    <p className="text-sm text-gray-600 arabic">
                      يمكن للمتجر إنشاء حملات ترويجية
                    </p>
                  </div>
                  <Switch
                    checked={selectedStore.permissions.canPromote}
                    onCheckedChange={(checked) =>
                      updatePermissions(selectedStore.id, {
                        ...selectedStore.permissions,
                        canPromote: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium arabic">
                      السماح بتصدير البيانات
                    </Label>
                    <p className="text-sm text-gray-600 arabic">
                      يمكن للمتجر تصدير بيانات الطلبات والعملاء
                    </p>
                  </div>
                  <Switch
                    checked={selectedStore.permissions.canExport}
                    onCheckedChange={(checked) =>
                      updatePermissions(selectedStore.id, {
                        ...selectedStore.permissions,
                        canExport: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium arabic">
                      الوصول للتحليلات
                    </Label>
                    <p className="text-sm text-gray-600 arabic">
                      يمكن للمتجر عرض التحليلا�� والإحصائيات
                    </p>
                  </div>
                  <Switch
                    checked={selectedStore.permissions.canAnalytics}
                    onCheckedChange={(checked) =>
                      updatePermissions(selectedStore.id, {
                        ...selectedStore.permissions,
                        canAnalytics: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPermissionModalOpen(false)}
              className="arabic"
            >
              إغلاق
            </Button>
            <Button
              onClick={() => setIsPermissionModalOpen(false)}
              className="arabic"
            >
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Direct Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="arabic text-right">
              إرسال رسالة مباشرة
            </DialogTitle>
            <DialogDescription className="arabic text-right">
              تواصل مباشرة مع ��احب المتجر
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold arabic">
                  إلى: {selectedStore.name}
                </h3>
                <p className="text-gray-600 arabic">{selectedStore.owner}</p>
              </div>

              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={directMessage}
                onChange={(e) => setDirectMessage(e.target.value)}
                className="min-h-[150px] arabic text-right"
              />

              <div className="flex gap-2">
                <Button className="arabic" variant="outline">
                  <FileText className="w-4 h-4 ml-2" />
                  إرفاق ملف
                </Button>
                <Button className="arabic" variant="outline">
                  <Megaphone className="w-4 h-4 ml-2" />
                  إعلان عام
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMessageModalOpen(false)}
              className="arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={sendDirectMessage}
              disabled={!directMessage.trim()}
              className="arabic"
            >
              <Send className="w-4 h-4 ml-2" />
              إرس��ل الرسالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Ticket Modal */}
      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="arabic text-right">
              تقديم المساعدة للمتجر
            </DialogTitle>
            <DialogDescription className="arabic text-right">
              أنشئ تذكرة دعم أو قدم مساعدة مباشرة
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold arabic">
                  مساع��ة: {selectedStore.name}
                </h3>
                <p className="text-gray-600 arabic">{selectedStore.owner}</p>
              </div>

              <Textarea
                placeholder="صف نوع المساعدة التي تريد تقديمها..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="min-h-[150px] arabic text-right"
              />

              <div className="grid grid-cols-2 gap-3">
                <Button className="arabic" variant="outline">
                  <Users className="w-4 h-4 ml-2" />
                  جلسة تدريبية
                </Button>
                <Button className="arabic" variant="outline">
                  <FileText className="w-4 h-4 ml-2" />
                  دليل مساعدة
                </Button>
                <Button className="arabic" variant="outline">
                  <Phone className="w-4 h-4 ml-2" />
                  اتصال مباشر
                </Button>
                <Button className="arabic" variant="outline">
                  <Target className="w-4 h-4 ml-2" />
                  استشارة تسويقية
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSupportModalOpen(false)}
              className="arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={createSupportTicket}
              disabled={!supportMessage.trim()}
              className="arabic"
            >
              <HelpCircle className="w-4 h-4 ml-2" />
              إنشاء تذكرة دعم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="arabic text-right">
              تأكيد الإجراء
            </DialogTitle>
            <DialogDescription className="arabic text-right">
              {confirmAction?.type === "approve" &&
                "هل أنت متأكد من اعتماد هذا المتجر؟"}
              {confirmAction?.type === "suspend" &&
                "هل أنت متأكد من تعليق هذا المتجر؟"}
              {confirmAction?.type === "block" &&
                "هل أنت متأكد من إيقاف هذا المتجر نهائياً؟"}
              {confirmAction?.type === "reactivate" &&
                "هل أنت متأكد من إعادة تفعيل هذا المتجر؟"}
              {confirmAction?.type === "renew" &&
                "هل تريد تجديد اشتراك هذا المتجر؟"}
              {confirmAction?.type === "feature" &&
                "هل أنت متأكد من جعل هذا المتجر مميزاً؟"}
              {confirmAction?.type === "unfeature" &&
                "ه�� أنت متأكد من إلغاء تمييز هذا المتجر؟"}
              {confirmAction?.type === "verify" &&
                "هل أنت متأكد من توثيق هذا المتجر؟"}
              {confirmAction?.type === "unverify" &&
                "هل أنت متأكد من إلغاء توثيق هذا المتجر؟"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center arabic">
              <strong>{confirmAction?.storeName}</strong>
            </p>
          </div>
          <DialogFooter
            className={`${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={executeAction}
              className={`arabic ${
                confirmAction?.type === "suspend" ||
                confirmAction?.type === "block"
                  ? "bg-red-600 hover:bg-red-700"
                  : confirmAction?.type === "renew"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {confirmAction?.type === "approve" && "✅ اعتماد"}
              {confirmAction?.type === "suspend" && "⏸️ تعليق"}
              {confirmAction?.type === "block" && "🚫 إيقاف"}
              {confirmAction?.type === "reactivate" && "🔄 إعادة تفعيل"}
              {confirmAction?.type === "renew" && "📅 تجديد الاشتراك"}
              {confirmAction?.type === "feature" && "جعله مميزاً"}
              {confirmAction?.type === "unfeature" && "إلغاء التمييز"}
              {confirmAction?.type === "verify" && "توثيق"}
              {confirmAction?.type === "unverify" && "إلغاء التوثيق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
