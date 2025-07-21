import { Moon, Sun, Languages, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme, arabicFonts, englishFonts } from "../contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative text-current hover:bg-white/10 transition-colors"
      title={t("theme.toggle")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("theme.toggle")}</span>
    </Button>
  );
}

export function LanguageToggle() {
  const { language, toggleLanguage, t, isRTL } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative text-current hover:bg-white/10 transition-colors"
      title={t("language.toggle")}
    >
      <div className="flex items-center justify-center">
        <span className="text-sm font-bold">
          {language === "ar" ? "ع" : "En"}
        </span>
      </div>
      <span className="sr-only">{t("language.toggle")}</span>
    </Button>
  );
}

export function FontFamilySelector() {
  const { arabicFont, englishFont, setArabicFont, setEnglishFont, t, language, getCurrentFont } = useTheme();
  const { arabicFonts, englishFonts } = require("../contexts/ThemeContext");

  const currentFonts = language === "ar" ? arabicFonts : englishFonts;
  const currentFontId = language === "ar" ? arabicFont : englishFont;
  const currentFontName = currentFonts.find((f: any) => f.id === currentFontId)?.name ||
                         (language === "ar" ? "أميري" : "Inter");

  const handleFontChange = (fontId: string) => {
    if (language === "ar") {
      setArabicFont(fontId as any);
    } else {
      setEnglishFont(fontId as any);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-current hover:bg-white/10"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="text-xs">
            {currentFontName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={language === "ar" ? "start" : "end"}
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        {currentFonts.map((font: any) => (
          <DropdownMenuItem
            key={font.id}
            onClick={() => handleFontChange(font.id)}
            className={`cursor-pointer ${currentFontId === font.id ? "bg-primary-50 dark:bg-primary-900/20" : ""}`}
          >
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <span className="font-medium">{font.name}</span>
                {currentFontId === font.id && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                )}
              </div>
              <span
                className={`text-sm text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'arabic' : 'english'}`}
                style={{ fontFamily: `var(--font-${font.id})` }}
              >
                {font.preview}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageAndThemeControls() {
  const { isRTL } = useTheme();

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
    >
      <LanguageToggle />
      <ThemeToggle />
      <div className="hidden md:block">
        <FontFamilySelector />
      </div>
    </div>
  );
}
