import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme, arabicFonts } from "../contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AdminFontSelector() {
  const { arabicFont, setArabicFont, t } = useTheme();

  const currentFontName =
    arabicFonts.find((f) => f.id === arabicFont)?.name || "أميري";

  const handleFontChange = (fontId: string) => {
    setArabicFont(fontId as any);
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
          <span className="text-xs">{currentFontName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        {arabicFonts.map((font) => (
          <DropdownMenuItem
            key={font.id}
            onClick={() => handleFontChange(font.id)}
            className={`cursor-pointer ${arabicFont === font.id ? "bg-primary-50 dark:bg-primary-900/20" : ""}`}
          >
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <span className="font-medium">{font.name}</span>
                {arabicFont === font.id && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                )}
              </div>
              <span
                className="text-sm text-gray-600 dark:text-gray-400 arabic text-right"
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
