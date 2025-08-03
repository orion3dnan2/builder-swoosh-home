import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Palette,
  Globe,
  Shield,
  ArrowLeft,
  Save,
  RotateCcw,
  Type,
  Image,
  Monitor,
  Smartphone,
  Eye,
  Upload,
  MapPin,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { useAppSettings } from "@/lib/appSettings";
import { useAuth } from "@/lib/auth";
import { regionsManager } from "@/lib/regionsManager";
import { useRegions, useRegionsStats, useRegionsByCountry, useCountries } from "@/hooks/use-regions";
import { useToast } from "@/hooks/use-toast";
import { apiConfigManager, ApiConfiguration } from "@/lib/apiConfig";

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    settings,
    updateTheme,
    updateBranding,
    updateFeatures,
    saveSettings,
    resetToDefaults,
    colorPalettes,
    fontFamilies,
  } = useAppSettings();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // State for managing delivery regions
  const { regions: deliveryRegions, notifyRegionsUpdate } = useRegions();
  const regionsStats = useRegionsStats();
  const countries = useCountries();
  const { regionsByCountry, addRegionToCountry, removeRegionFromCountry, updateRegionInCountry } = useRegionsByCountry();

  const [selectedCountry, setSelectedCountry] = useState<string>("SA");
  const [newRegion, setNewRegion] = useState("");
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // State for API configurations
  const [apiConfigs, setApiConfigs] = useState<ApiConfiguration[]>(apiConfigManager.getAllConfigs());
  const [activeApiConfig, setActiveApiConfig] = useState<ApiConfiguration | null>(apiConfigManager.getActiveConfig());
  const [showAddApiForm, setShowAddApiForm] = useState(false);
  const [editingApiConfig, setEditingApiConfig] = useState<ApiConfiguration | null>(null);
  const [testingConfigId, setTestingConfigId] = useState<string | null>(null);
  const [newApiConfig, setNewApiConfig] = useState({
    name: "",
    baseUrl: "",
    description: "",
    isActive: true,
    isDefault: false,
    endpoints: {
      auth: "/auth",
      users: "/users",
      stores: "/stores",
      products: "/products",
      companies: "/companies",
      jobs: "/jobs",
      orders: "/orders",
      analytics: "/analytics"
    },
    authentication: {
      type: 'bearer' as const
    },
    timeout: 10000,
    retries: 3
  });

  const handleThemeChange = (key: string, value: any) => {
    const updatedSettings = {
      ...localSettings,
      theme: { ...localSettings.theme, [key]: value },
    };
    setLocalSettings(updatedSettings);
    setUnsavedChanges(true);
  };

  const handleBrandingChange = (key: string, value: any) => {
    const updatedSettings = {
      ...localSettings,
      branding: { ...localSettings.branding, [key]: value },
    };
    setLocalSettings(updatedSettings);
    setUnsavedChanges(true);
  };

  const handleFeatureChange = (key: string, value: boolean) => {
    const updatedSettings = {
      ...localSettings,
      features: { ...localSettings.features, [key]: value },
    };
    setLocalSettings(updatedSettings);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    handleSaveAll();
  };

  const handleReset = () => {
    resetToDefaults();
    window.location.reload(); // Reload to apply changes
  };

  const applyColorPalette = (palette: {
    primary: string;
    secondary: string;
  }) => {
    handleThemeChange("primaryColor", palette.primary);
    handleThemeChange("secondaryColor", palette.secondary);
  };

  // Functions for managing delivery regions
  const addRegion = () => {
    if (addRegionToCountry(newRegion, selectedCountry)) {
      setNewRegion("");
      setUnsavedChanges(true);
      toast({
        title: "تم إضافة المنطقة بنجاح",
        description: `تمت إضافة "${newRegion}" إلى قائمة مناطق ${countries.find(c => c.code === selectedCountry)?.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة المنطقة",
        description: "المنطقة موجودة بالفعل في هذه الدولة أو الاسم غير صحيح",
      });
    }
  };

  const deleteRegion = (regionId: string, countryCode: string, regionName: string) => {
    if (removeRegionFromCountry(regionId, countryCode)) {
      setUnsavedChanges(true);
      toast({
        title: "تم حذف المنطقة",
        description: `تم حذف "${regionName}" من قائمة المناطق`,
      });
    }
  };

  const startEditing = (regionId: string, regionName: string) => {
    setEditingRegionId(regionId);
    setEditingValue(regionName);
  };

  const saveEdit = (regionId: string, countryCode: string) => {
    const oldName = regionsByCountry[countryCode]?.find(r => r.id === regionId)?.name || "";
    if (updateRegionInCountry(regionId, countryCode, editingValue)) {
      setEditingRegionId(null);
      setEditingValue("");
      setUnsavedChanges(true);
      toast({
        title: "تم تحديث المنطقة",
        description: `تم تغيير اسم المنطقة من "${oldName}" إلى "${editingValue}"`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "خطأ في التحديث",
        description: "الاسم الجديد موجود بالفعل في هذه الدولة أو غير صحيح",
      });
    }
  };

  const cancelEdit = () => {
    setEditingRegionId(null);
    setEditingValue("");
  };

  const handleSaveAll = () => {
    saveSettings(localSettings);
    setUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 arabic">
                  إعدادات التطبيق
                </h1>
                <p className="text-gray-600 arabic">
                  تخصيص المظهر والإعدادات العامة
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <QuickApiStatus />
              {unsavedChanges && (
                <Badge variant="secondary" className="arabic">
                  تغييرات غير محفوظة
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleReset}
                className="arabic"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
              <Button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className="arabic"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="theme" className="arabic">
              المظهر
            </TabsTrigger>
            <TabsTrigger value="branding" className="arabic">
              العلامة التجارية
            </TabsTrigger>
            <TabsTrigger value="features" className="arabic">
              الميزات
            </TabsTrigger>
            <TabsTrigger value="regions" className="arabic">
              المناطق
            </TabsTrigger>
            <TabsTrigger value="content" className="arabic">
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="api" className="arabic">
              الخوادم
            </TabsTrigger>
            <TabsTrigger value="advanced" className="arabic">
              متقدم
            </TabsTrigger>
          </TabsList>

          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Color Palette */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center arabic">
                    <Palette className="w-5 h-5 ml-2" />
                    نظام الألوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold arabic">الألوان الحالية</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="arabic">اللون الأساسي</Label>
                        <div className="flex items-center space-x-2 space-x-reverse mt-2">
                          <div
                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                            style={{
                              backgroundColor: localSettings.theme.primaryColor,
                            }}
                          ></div>
                          <Input
                            type="color"
                            value={localSettings.theme.primaryColor}
                            onChange={(e) =>
                              handleThemeChange("primaryColor", e.target.value)
                            }
                            className="w-20 h-8 p-0 border-0"
                          />
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {localSettings.theme.primaryColor}
                          </code>
                        </div>
                      </div>
                      <div>
                        <Label className="arabic">اللون الثانوي</Label>
                        <div className="flex items-center space-x-2 space-x-reverse mt-2">
                          <div
                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                            style={{
                              backgroundColor:
                                localSettings.theme.secondaryColor,
                            }}
                          ></div>
                          <Input
                            type="color"
                            value={localSettings.theme.secondaryColor}
                            onChange={(e) =>
                              handleThemeChange(
                                "secondaryColor",
                                e.target.value,
                              )
                            }
                            className="w-20 h-8 p-0 border-0"
                          />
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {localSettings.theme.secondaryColor}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold arabic">الألوان المقترحة</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(colorPalettes).map(([name, palette]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="flex space-x-1 space-x-reverse">
                              <div
                                className="w-6 h-6 rounded-md"
                                style={{ backgroundColor: palette.primary }}
                              ></div>
                              <div
                                className="w-6 h-6 rounded-md"
                                style={{ backgroundColor: palette.secondary }}
                              ></div>
                            </div>
                            <span className="text-sm arabic">{name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyColorPalette(palette)}
                            className="arabic"
                          >
                            تطبيق
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center arabic">
                    <Type className="w-5 h-5 ml-2" />
                    الخطوط والنصوص
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="arabic">عائلة الخط</Label>
                    <select
                      value={localSettings.theme.fontFamily}
                      onChange={(e) =>
                        handleThemeChange("fontFamily", e.target.value)
                      }
                      className="w-full mt-2 p-2 border rounded-lg arabic"
                    >
                      {Object.entries(fontFamilies).map(([name, value]) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="arabic">تخطيط التطبيق</Label>
                    <select
                      value={localSettings.theme.layout}
                      onChange={(e) =>
                        handleThemeChange("layout", e.target.value)
                      }
                      className="w-full mt-2 p-2 border rounded-lg arabic"
                    >
                      <option value="modern">عصري</option>
                      <option value="classic">كلاسيكي</option>
                      <option value="minimal">بسيط</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold arabic">معاينة النص</h3>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h4
                        className="text-xl font-bold mb-2 arabic"
                        style={{
                          fontFamily:
                            fontFamilies[
                              localSettings.theme
                                .fontFamily as keyof typeof fontFamilies
                            ],
                        }}
                      >
                        البيت السوداني
                      </h4>
                      <p
                        className="text-gray-600 arabic"
                        style={{
                          fontFamily:
                            fontFamilies[
                              localSettings.theme
                                .fontFamily as keyof typeof fontFamilies
                            ],
                        }}
                      >
                        سوق الخدمات وشركات السودان في الخليج والعالم
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <Eye className="w-5 h-5 ml-2" />
                  معاينة المظهر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Monitor className="w-5 h-5" />
                      <span className="arabic">سطح المكتب</span>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div
                        className="h-3 rounded mb-3"
                        style={{
                          backgroundColor: localSettings.theme.primaryColor,
                        }}
                      ></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        <div
                          className="h-8 rounded"
                          style={{
                            backgroundColor: localSettings.theme.secondaryColor,
                            opacity: 0.3,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Smartphone className="w-5 h-5" />
                      <span className="arabic">الجوال</span>
                    </div>
                    <div className="border rounded-lg p-3 bg-white max-w-48">
                      <div
                        className="h-2 rounded mb-2"
                        style={{
                          backgroundColor: localSettings.theme.primaryColor,
                        }}
                      ></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded w-full"></div>
                        <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                        <div
                          className="h-4 rounded mt-2"
                          style={{
                            backgroundColor: localSettings.theme.secondaryColor,
                            opacity: 0.3,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center arabic">
                    <Image className="w-5 h-5 ml-2" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="arabic">اسم التطبيق</Label>
                    <Input
                      value={localSettings.branding.appName}
                      onChange={(e) =>
                        handleBrandingChange("appName", e.target.value)
                      }
                      className="mt-2 arabic text-right"
                      placeholder="البيت السوداني"
                    />
                  </div>

                  <div>
                    <Label className="arabic">الشعار الفرعي</Label>
                    <Input
                      value={localSettings.branding.tagline}
                      onChange={(e) =>
                        handleBrandingChange("tagline", e.target.value)
                      }
                      className="mt-2 arabic text-right"
                      placeholder="سوق الخدمات وشركات السودان في الخليج والعالم"
                    />
                  </div>

                  <div>
                    <Label className="arabic">رابط الشعار</Label>
                    <Input
                      value={localSettings.branding.logo}
                      onChange={(e) =>
                        handleBrandingChange("logo", e.target.value)
                      }
                      className="mt-2"
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline" size="sm" className="mt-2 arabic">
                      <Upload className="w-4 h-4 ml-2" />
                      رفع ��ورة
                    </Button>
                  </div>

                  <div>
                    <Label className="arabic">أيقونة الموقع (Favicon)</Label>
                    <Input
                      value={localSettings.branding.favicon}
                      onChange={(e) =>
                        handleBrandingChange("favicon", e.target.value)
                      }
                      className="mt-2"
                      placeholder="/favicon.ico"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center arabic">
                    <Image className="w-5 h-5 ml-2" />
                    صورة الخلفية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="arabic">رابط صورة الخلفية</Label>
                    <Textarea
                      value={localSettings.branding.heroBackground}
                      onChange={(e) =>
                        handleBrandingChange("heroBackground", e.target.value)
                      }
                      className="mt-2"
                      rows={3}
                      placeholder="https://example.com/background.jpg"
                    />
                    <Button variant="outline" size="sm" className="mt-2 arabic">
                      <Upload className="w-4 h-4 ml-2" />
                      رفع صور�� جديدة
                    </Button>
                  </div>

                  {localSettings.branding.heroBackground && (
                    <div>
                      <Label className="arabic">معاينة الصورة</Label>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                          src={localSettings.branding.heroBackground}
                          alt="Hero Background Preview"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regions Management */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <MapPin className="w-5 h-5 ml-2" />
                  إدارة مناطق التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Country Selection */}
                  <div className="mb-6">
                    <Label className="arabic mb-3 block font-semibold">اختر الدولة لإدارة مناطقها</Label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-3 border rounded-lg arabic text-right bg-white"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({regionsByCountry[country.code]?.length || 0} منطقة)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add New Region */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Input
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      placeholder={`أدخل اسم المنطقة الجديدة في ${countries.find(c => c.code === selectedCountry)?.name}`}
                      className="flex-1 arabic text-right"
                      onKeyPress={(e) => e.key === "Enter" && addRegion()}
                    />
                    <Button
                      onClick={addRegion}
                      disabled={
                        !newRegion.trim() ||
                        (regionsByCountry[selectedCountry] || []).some(r => r.name === newRegion.trim())
                      }
                      className="arabic"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة
                    </Button>
                  </div>

                  {/* Regions Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-600 arabic">
                          إجمالي المناطق
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700 mt-2">
                        {deliveryRegions.length}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600 arabic">
                          الدول المغطاة
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 mt-2">
                        {regionsStats.countries}
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Settings className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-orange-600 arabic">
                          حالة النظام
                        </span>
                      </div>
                      <div className="text-sm font-medium text-orange-700 mt-2 arabic">
                        {deliveryRegions.length > 0 ? "نشط" : "غير نشط"}
                      </div>
                    </div>
                  </div>

                  {/* Current Country Regions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg arabic">
                        مناطق {countries.find(c => c.code === selectedCountry)?.name} ({(regionsByCountry[selectedCountry] || []).length})
                      </h3>
                      <Badge variant="outline" className="arabic">
                        {selectedCountry}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(regionsByCountry[selectedCountry] || []).map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          {editingRegionId === region.id ? (
                            <div className="flex items-center space-x-2 space-x-reverse flex-1">
                              <Input
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                className="flex-1 arabic text-right text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") saveEdit(region.id, selectedCountry);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                              />
                              <div className="flex space-x-1 space-x-reverse">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => saveEdit(region.id, selectedCountry)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEdit}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm arabic font-medium flex-1">
                                {region.name}
                              </span>
                              <div className="flex space-x-1 space-x-reverse">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(region.id, region.name)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteRegion(region.id, selectedCountry, region.name)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {(regionsByCountry[selectedCountry] || []).length === 0 && (
                      <div className="text-center py-8">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                          <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                          <h4 className="font-semibold text-orange-700 arabic mb-2">
                            لا توجد مناطق في {countries.find(c => c.code === selectedCountry)?.name}
                          </h4>
                          <p className="text-orange-600 arabic text-sm mb-4">
                            أضف مناطق لهذه الدولة لتتمكن الشرك��ت من تحديد مناطق التوصيل
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        regionsManager.resetToDefaults();
                        notifyRegionsUpdate();
                        setUnsavedChanges(true);
                      }}
                      className="arabic"
                    >
                      <RotateCcw className="w-4 h-4 ml-2" />
                      إعادة تعيين للافتراضي
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const regions = regionsManager.getRegions();
                        const blob = new Blob(
                          [JSON.stringify(regions, null, 2)],
                          { type: "application/json" },
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "delivery-regions.json";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="arabic"
                    >
                      <Upload className="w-4 h-4 ml-2" />
                      تصدير المناطق
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 arabic mb-2">
                      تعليمات الاستخدام:
                    </h4>
                    <ul className="text-sm text-blue-700 arabic space-y-1">
                      <li>
                        • أضف المناطق التي تريد أن تظهر للتجار في إعدادات الشحن
                      </li>
                      <li>
                        • يمكن تعديل أو حذف أي منطقة بالضغط على الأيقونات
                        المناسبة
                      </li>
                      <li>
                        • المناطق تُحفظ تلقائياً ولا تحتاج للضغط على "حفظ
                        التغييرات"
                      </li>
                      <li>
                        • المناطق المحددة هنا ستظهر لجميع التجار في النظام فوراً
                      </li>
                      <li>
                        • يمكن إعادة تعيين المناطق للقيم الافتراضية أو تصديرها
                        كملف
                      </li>
                    </ul>
                  </div>

                  {/* All Countries Overview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 arabic mb-3">
                      جميع الدول والمناطق:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {countries.map((country) => {
                        const countryRegions = regionsByCountry[country.code] || [];
                        return (
                          <div
                            key={country.code}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              selectedCountry === country.code
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedCountry(country.code)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold arabic">
                                {country.name}
                              </span>
                              <Badge variant={countryRegions.length > 0 ? "default" : "secondary"}>
                                {countryRegions.length} منطقة
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 arabic">
                              {countryRegions.length > 0
                                ? countryRegions.slice(0, 3).map(r => r.name).join(', ') +
                                  (countryRegions.length > 3 ? '...' : '')
                                : 'لا توجد مناطق'
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Countries Statistics */}
                  {Object.keys(regionsStats.byCountry).length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 arabic mb-3">
                        إحصائيات المناطق حسب الدول:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(regionsStats.byCountry).map(
                          ([country, count]) => (
                            <div
                              key={country}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <span className="text-sm arabic font-medium">
                                {country}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {count} منطقة
                              </Badge>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <Shield className="w-5 h-5 ml-2" />
                  تفعيل/إلغاء الميزات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(localSettings.features).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <Label className="font-medium arabic">
                            {key === "enableMarketplace" && "السوق التجاري"}
                            {key === "enableProducts" && "ا��منتجات"}
                            {key === "enableCompanies" && "الشركات"}
                            {key === "enableJobs" && "الوظائف"}
                            {key === "enableServices" && "الخدمات"}
                            {key === "enableAds" && "الإعلانات"}
                            {key === "enableReviews" && "التقييمات"}
                            {key === "enableChat" && "الدردشة"}
                          </Label>
                          <p className="text-sm text-gray-600 arabic">
                            {key === "enableMarketplace" &&
                              "تفعيل قسم السوق التجاري"}
                            {key === "enableProducts" &&
                              "تفعيل قسم بيع المنتجات"}
                            {key === "enableCompanies" && "تفعيل دليل الشركات"}
                            {key === "enableJobs" && "تفعيل لوحة الوظائف"}
                            {key === "enableServices" && "تفعيل قائمة الخدمات"}
                            {key === "enableAds" && "تفعيل الإعلانات المدفوعة"}
                            {key === "enableReviews" && "تفعيل نظام التقييمات"}
                            {key === "enableChat" && "تفعيل الدردشة المباشرة"}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            handleFeatureChange(key, checked)
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center arabic">
                    <Globe className="w-5 h-5 ml-2" />
                    السياسات والشروط
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="arabic">الشر��ط والأحكام</Label>
                    <Textarea
                      value={localSettings.policies.termsOfService}
                      onChange={(e) =>
                        handleBrandingChange("termsOfService", e.target.value)
                      }
                      className="mt-2 arabic text-right"
                      rows={4}
                      placeholder="أدخل الشروط والأحكام..."
                    />
                  </div>

                  <div>
                    <Label className="arabic">سياسة الخصوصية</Label>
                    <Textarea
                      value={localSettings.policies.privacyPolicy}
                      onChange={(e) =>
                        handleBrandingChange("privacyPolicy", e.target.value)
                      }
                      className="mt-2 arabic text-right"
                      rows={4}
                      placeholder="أدخل سياسة الخصوصية..."
                    />
                  </div>

                  <div>
                    <Label className="arabic">سياسة الإرجاع</Label>
                    <Textarea
                      value={localSettings.policies.refundPolicy}
                      onChange={(e) =>
                        handleBrandingChange("refundPolicy", e.target.value)
                      }
                      className="mt-2 arabic text-right"
                      rows={4}
                      placeholder="أدخل سياسة الإرجاع..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Configuration */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <Settings className="w-5 h-5 ml-2" />
                  إدارة خوادم الـ API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-600 arabic">إجمالي الخوادم</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700 mt-2">
                        {apiConfigs.length}
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                        <span className="text-sm text-green-600 arabic">نشطة</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 mt-2">
                        {apiConfigs.filter(c => c.isActive).length}
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 bg-red-600 rounded-full"></div>
                        <span className="text-sm text-red-600 arabic">غير نشطة</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700 mt-2">
                        {apiConfigs.filter(c => !c.isActive).length}
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 bg-orange-600 rounded-full"></div>
                        <span className="text-sm text-orange-600 arabic">الخادم الحالي</span>
                      </div>
                      <div className="text-sm font-medium text-orange-700 mt-2 arabic">
                        {activeApiConfig?.name || "غير محدد"}
                      </div>
                    </div>
                  </div>

                  {/* Add New API Config */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg arabic">قائمة الخوادم</h3>
                    <Button
                      onClick={() => setShowAddApiForm(true)}
                      className="arabic"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة خادم جديد
                    </Button>
                  </div>

                  {/* Add/Edit Form */}
                  {(showAddApiForm || editingApiConfig) && (
                    <Card className="border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="arabic">
                          {editingApiConfig ? "تعديل الخادم" : "إضافة خادم جديد"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="arabic">اسم الخادم</Label>
                            <Input
                              value={editingApiConfig ? editingApiConfig.name : newApiConfig.name}
                              onChange={(e) => {
                                if (editingApiConfig) {
                                  setEditingApiConfig({...editingApiConfig, name: e.target.value});
                                } else {
                                  setNewApiConfig({...newApiConfig, name: e.target.value});
                                }
                              }}
                              placeholder="خادم الإنتاج"
                              className="mt-2 arabic text-right"
                            />
                          </div>
                          <div>
                            <Label className="arabic">رابط الخادم</Label>
                            <Input
                              value={editingApiConfig ? editingApiConfig.baseUrl : newApiConfig.baseUrl}
                              onChange={(e) => {
                                if (editingApiConfig) {
                                  setEditingApiConfig({...editingApiConfig, baseUrl: e.target.value});
                                } else {
                                  setNewApiConfig({...newApiConfig, baseUrl: e.target.value});
                                }
                              }}
                              placeholder="https://api.example.com"
                              className="mt-2"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="arabic">الوصف</Label>
                            <Textarea
                              value={editingApiConfig ? (editingApiConfig.description || "") : newApiConfig.description}
                              onChange={(e) => {
                                if (editingApiConfig) {
                                  setEditingApiConfig({...editingApiConfig, description: e.target.value});
                                } else {
                                  setNewApiConfig({...newApiConfig, description: e.target.value});
                                }
                              }}
                              placeholder="وصف الخادم واستخدامه"
                              className="mt-2 arabic text-right"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="font-medium arabic">خادم نشط</Label>
                              <p className="text-sm text-gray-600 arabic">يمكن استخدام هذا الخادم</p>
                            </div>
                            <Switch
                              checked={editingApiConfig ? editingApiConfig.isActive : newApiConfig.isActive}
                              onCheckedChange={(checked) => {
                                if (editingApiConfig) {
                                  setEditingApiConfig({...editingApiConfig, isActive: checked});
                                } else {
                                  setNewApiConfig({...newApiConfig, isActive: checked});
                                }
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="font-medium arabic">الخادم الافترا��ي</Label>
                              <p className="text-sm text-gray-600 arabic">الخادم المستخدم افتراضياً</p>
                            </div>
                            <Switch
                              checked={editingApiConfig ? editingApiConfig.isDefault : newApiConfig.isDefault}
                              onCheckedChange={(checked) => {
                                if (editingApiConfig) {
                                  setEditingApiConfig({...editingApiConfig, isDefault: checked});
                                } else {
                                  setNewApiConfig({...newApiConfig, isDefault: checked});
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse mt-6">
                          <Button
                            onClick={() => {
                              if (editingApiConfig) {
                                apiConfigManager.updateConfig(editingApiConfig.id, editingApiConfig);
                                setApiConfigs(apiConfigManager.getAllConfigs());
                                setActiveApiConfig(apiConfigManager.getActiveConfig());
                                setEditingApiConfig(null);
                                toast({
                                  title: "تم تحديث الخادم",
                                  description: "تم حفظ إعدادات الخادم بنجاح"
                                });
                              } else {
                                const id = apiConfigManager.addConfig(newApiConfig);
                                setApiConfigs(apiConfigManager.getAllConfigs());
                                setActiveApiConfig(apiConfigManager.getActiveConfig());
                                setShowAddApiForm(false);
                                setNewApiConfig({
                                  name: "",
                                  baseUrl: "",
                                  description: "",
                                  isActive: true,
                                  isDefault: false,
                                  endpoints: {
                                    auth: "/auth",
                                    users: "/users",
                                    stores: "/stores",
                                    products: "/products",
                                    companies: "/companies",
                                    jobs: "/jobs",
                                    orders: "/orders",
                                    analytics: "/analytics"
                                  },
                                  authentication: {
                                    type: 'bearer' as const
                                  },
                                  timeout: 10000,
                                  retries: 3
                                });
                                toast({
                                  title: "تم إضافة الخادم",
                                  description: "تم إضافة الخادم الجديد بنجاح"
                                });
                              }
                            }}
                            disabled={editingApiConfig ? !editingApiConfig.name.trim() || !editingApiConfig.baseUrl.trim() : !newApiConfig.name.trim() || !newApiConfig.baseUrl.trim()}
                            className="arabic"
                          >
                            <Save className="w-4 h-4 ml-2" />
                            {editingApiConfig ? "حفظ التعديل" : "إضافة الخادم"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddApiForm(false);
                              setEditingApiConfig(null);
                              setNewApiConfig({
                                name: "",
                                baseUrl: "",
                                description: "",
                                isActive: true,
                                isDefault: false,
                                endpoints: {
                                  auth: "/auth",
                                  users: "/users",
                                  stores: "/stores",
                                  products: "/products",
                                  companies: "/companies",
                                  jobs: "/jobs",
                                  orders: "/orders",
                                  analytics: "/analytics"
                                },
                                authentication: {
                                  type: 'bearer' as const
                                },
                                timeout: 10000,
                                retries: 3
                              });
                            }}
                            className="arabic"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* API Configs List */}
                  <div className="space-y-4">
                    {apiConfigs.map((config) => (
                      <Card key={config.id} className={`border-2 transition-all ${
                        activeApiConfig?.id === config.id
                          ? 'border-blue-500 bg-blue-50'
                          : config.isActive
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-2">
                                <h4 className="font-semibold arabic">{config.name}</h4>
                                <div className="flex space-x-2 space-x-reverse">
                                  {config.isDefault && (
                                    <Badge variant="secondary" className="arabic">
                                      افتراضي
                                    </Badge>
                                  )}
                                  {activeApiConfig?.id === config.id && (
                                    <Badge className="arabic">
                                      الحالي
                                    </Badge>
                                  )}
                                  <Badge variant={config.isActive ? "default" : "destructive"} className="arabic">
                                    {config.isActive ? "نشط" : "غير نشط"}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{config.baseUrl}</p>
                              {config.description && (
                                <p className="text-sm text-gray-500 arabic">{config.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  setTestingConfigId(config.id);
                                  try {
                                    const result = await apiConfigManager.testConfig(config);
                                    toast({
                                      title: result.success ? "اختبار ناجح" : "اختبار فاشل",
                                      description: `${result.message}${result.responseTime ? ` (${result.responseTime}ms)` : ''}`,
                                      variant: result.success ? "default" : "destructive"
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "خطأ في الاختبار",
                                      description: "فشل في اختبار الاتصال",
                                      variant: "destructive"
                                    });
                                  } finally {
                                    setTestingConfigId(null);
                                  }
                                }}
                                disabled={testingConfigId === config.id}
                                className="arabic"
                              >
                                {testingConfigId === config.id ? "جاري الاختبار..." : "اختبار"}
                              </Button>
                              {config.isActive && activeApiConfig?.id !== config.id && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    apiConfigManager.setActiveConfig(config.id);
                                    setActiveApiConfig(apiConfigManager.getActiveConfig());
                                    toast({
                                      title: "تم تغيير الخادم",
                                      description: `تم تفعيل خادم: ${config.name}`
                                    });
                                  }}
                                  className="arabic"
                                >
                                  تفعيل
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingApiConfig(config)}
                                className="arabic"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (apiConfigManager.deleteConfig(config.id)) {
                                    setApiConfigs(apiConfigManager.getAllConfigs());
                                    setActiveApiConfig(apiConfigManager.getActiveConfig());
                                    toast({
                                      title: "تم حذف الخادم",
                                      description: `تم حذف خادم: ${config.name}`
                                    });
                                  } else {
                                    toast({
                                      title: "خطأ في الحذف",
                                      description: "لا يمكن حذف الخادم الافتراضي الوحيد",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                                disabled={config.isDefault && apiConfigs.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        apiConfigManager.resetToDefaults();
                        setApiConfigs(apiConfigManager.getAllConfigs());
                        setActiveApiConfig(apiConfigManager.getActiveConfig());
                        toast({
                          title: "تم إعادة التعيين",
                          description: "تم إعادة تعيين جميع الخوادم للإعدادات الافتراضية"
                        });
                      }}
                      className="arabic"
                    >
                      <RotateCcw className="w-4 h-4 ml-2" />
                      إعادة تعيين
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const configsJson = apiConfigManager.exportConfigs();
                        const blob = new Blob([configsJson], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'api-configs.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="arabic"
                    >
                      تصدير الإعدادات
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = apiConfigManager.importConfigs(e.target?.result as string);
                              if (result.success) {
                                setApiConfigs(apiConfigManager.getAllConfigs());
                                setActiveApiConfig(apiConfigManager.getActiveConfig());
                              }
                              toast({
                                title: result.success ? "نجح الاستيراد" : "فشل الاستيراد",
                                description: result.message,
                                variant: result.success ? "default" : "destructive"
                              });
                            };
                            reader.readAsText(file);
                          }
                        };
                        input.click();
                      }}
                      className="arabic"
                    >
                      استيراد الإعدادات
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 arabic mb-2">
                      تعليمات الاستخدام:
                    </h4>
                    <ul className="text-sm text-blue-700 arabic space-y-1">
                      <li>• أضف خوادم API خارجية لربط التطبيق بقواعد البيانات المختلفة</li>
                      <li>• يمكن تفعيل خادم واحد فقط في كل مرة</li>
                      <li>• استخدم اختبار الاتصال للتأكد من عمل الخادم</li>
                      <li>• الخادم الافتراضي هو الخادم المحلي للتطوير</li>
                      <li>• يمكن تصدير واستيراد إعدادات الخوادم</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center arabic">
                  <Settings className="w-5 h-5 ml-2" />
                  الإعدادات المتقدمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 arabic">
                    ⚠️ تحذير: الإ��دادات المتقدمة قد تؤثر على أداء التطبيق. يُنصح
                    بعدم تغييرها إلا إذا كنت تعرف ما تفعل.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="arabic">اللغة الافتر��ضية</Label>
                    <select
                      value={localSettings.localization.defaultLanguage}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          localization: {
                            ...localSettings.localization,
                            defaultLanguage: e.target.value as "ar" | "en",
                          },
                        })
                      }
                      className="w-full mt-2 p-2 border rounded-lg arabic"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium arabic">
                        دعم الكتابة من اليمين لليسار
                      </Label>
                      <p className="text-sm text-gray-600 arabic">
                        تفعيل RTL للغة العربية
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.localization.rtlSupport}
                      onCheckedChange={(checked) =>
                        setLocalSettings({
                          ...localSettings,
                          localization: {
                            ...localSettings.localization,
                            rtlSupport: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    variant="destructive"
                    onClick={handleReset}
                    className="arabic"
                  >
                    <RotateCcw className="w-4 h-4 ml-2" />
                    إعادة تعيين جميع الإعدادات
                  </Button>
                  <p className="text-sm text-gray-600 mt-2 arabic">
                    سيتم حذف جميع التخصيصات والعودة للإعدادات الافتراضية
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
