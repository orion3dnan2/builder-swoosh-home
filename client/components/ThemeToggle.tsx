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

// Language toggle removed - Arabic only app

// FontFamilySelector moved to AdminFontSelector for admin/merchant areas only

export function LanguageAndThemeControls() {
  const { isRTL } = useTheme();

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
    >
      <ThemeToggle />
    </div>
  );
}
