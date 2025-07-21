import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Type, Check, Palette, Globe, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { arabicFonts, englishFonts, ArabicFontFamily, EnglishFontFamily } from "@/contexts/ThemeContext";

export function FontSettings() {
  const { 
    t, 
    isRTL, 
    language, 
    arabicFont, 
    englishFont, 
    setArabicFont, 
    setEnglishFont,
    getCurrentFont 
  } = useTheme();
  
  const [previewText, setPreviewText] = useState({
    arabic: "أهلاً وسهلاً بكم في البيت السوداني - منصة شاملة للمجتمع السوداني",
    english: "Welcome to Sudan House - Your comprehensive platform for the Sudanese community"
  });

  const handleArabicFontChange = (fontId: ArabicFontFamily) => {
    setArabicFont(fontId);
  };

  const handleEnglishFontChange = (fontId: EnglishFontFamily) => {
    setEnglishFont(fontId);
  };

  const resetToDefaults = () => {
    setArabicFont("amiri");
    setEnglishFont("inter");
  };

  const FontPreview = ({ 
    fontId, 
    fontName, 
    englishName, 
    preview, 
    isSelected, 
    onClick, 
    type 
  }: {
    fontId: string;
    fontName: string;
    englishName: string;
    preview: string;
    isSelected: boolean;
    onClick: () => void;
    type: 'arabic' | 'english';
  }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {fontName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {englishName}
            </p>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div 
          className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border ${
            type === 'arabic' ? 'text-right arabic' : 'text-left english'
          }`}
          style={{ 
            fontFamily: type === 'arabic' 
              ? `var(--font-${fontId}), "Noto Sans Arabic", serif`
              : `var(--font-${fontId}), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
          }}
        >
          <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {preview}
          </p>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {type === 'arabic' ? 'عربي' : 'English'}
          </Badge>
          {isSelected && (
            <Badge variant="default" className="text-xs">
              {t("common.selected", "محدد")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 arabic">
              {t("font_settings.title", "إعدادات الخطوط")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 arabic">
              {t("font_settings.subtitle", "اختر الخطوط المناسبة للنصوص العربية والإنجليزية")}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={resetToDefaults}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <RefreshCw className="w-4 h-4" />
          {t("font_settings.reset", "إعادة تعيين")}
        </Button>
      </div>

      {/* Current Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 arabic ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <Palette className="w-5 h-5" />
            {t("font_settings.current_settings", "الإعدادات الحالية")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 arabic">
                {t("font_settings.arabic_font", "الخط العربي")}
              </h4>
              <p className="text-blue-800 dark:text-blue-200 arabic">
                {arabicFonts.find(f => f.id === arabicFont)?.name || "أميري"}
              </p>
              <div 
                className={`mt-2 p-2 bg-white dark:bg-blue-800 rounded text-right arabic`}
                style={{ fontFamily: `var(--font-${arabicFont}), "Noto Sans Arabic", serif` }}
              >
                {previewText.arabic}
              </div>
            </div>
            
            <div className={`p-4 bg-green-50 dark:bg-green-900/20 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 arabic">
                {t("font_settings.english_font", "الخط الإنجليزي")}
              </h4>
              <p className="text-green-800 dark:text-green-200">
                {englishFonts.find(f => f.id === englishFont)?.name || "Inter"}
              </p>
              <div 
                className={`mt-2 p-2 bg-white dark:bg-green-800 rounded text-left english`}
                style={{ fontFamily: `var(--font-${englishFont}), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` }}
              >
                {previewText.english}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Selection Tabs */}
      <Tabs defaultValue="arabic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="arabic" className="arabic">
            {t("font_settings.arabic_fonts", "الخطوط العربية")}
          </TabsTrigger>
          <TabsTrigger value="english" className="english">
            {t("font_settings.english_fonts", "English Fonts")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="arabic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arabicFonts.map((font) => (
              <FontPreview
                key={font.id}
                fontId={font.id}
                fontName={font.name}
                englishName={font.englishName}
                preview={font.preview}
                isSelected={arabicFont === font.id}
                onClick={() => handleArabicFontChange(font.id)}
                type="arabic"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="english" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {englishFonts.map((font) => (
              <FontPreview
                key={font.id}
                fontId={font.id}
                fontName={font.name}
                englishName={font.name}
                preview={font.preview}
                isSelected={englishFont === font.id}
                onClick={() => handleEnglishFontChange(font.id)}
                type="english"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Custom Preview Text */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 arabic ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <Globe className="w-5 h-5" />
            {t("font_settings.custom_preview", "معاينة مخصصة")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 arabic ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("font_settings.arabic_preview_text", "نص المعاينة العربي")}
            </label>
            <textarea
              value={previewText.arabic}
              onChange={(e) => setPreviewText(prev => ({ ...prev, arabic: e.target.value }))}
              className={`w-full p-3 border rounded-lg arabic ${isRTL ? 'text-right' : 'text-left'}`}
              rows={3}
              style={{ fontFamily: `var(--font-${arabicFont}), "Noto Sans Arabic", serif` }}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("font_settings.english_preview_text", "English Preview Text")}
            </label>
            <textarea
              value={previewText.english}
              onChange={(e) => setPreviewText(prev => ({ ...prev, english: e.target.value }))}
              className="w-full p-3 border rounded-lg text-left english"
              rows={3}
              style={{ fontFamily: `var(--font-${englishFont}), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
