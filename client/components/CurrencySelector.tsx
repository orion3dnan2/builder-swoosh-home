import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, DollarSign, Check, MapPin } from "lucide-react";
import { useCurrencySafe } from "@/contexts/CurrencyContext";
import { countryCurrencies } from "@/lib/currencies";

interface CurrencySelectorProps {
  variant?: "dropdown" | "card" | "badge";
  size?: "sm" | "md" | "lg";
  showCountry?: boolean;
  className?: string;
}

export function CurrencySelector({
  variant = "dropdown",
  size = "md",
  showCountry = true,
  className = "",
}: CurrencySelectorProps) {
  const { currentCurrency, storeCountry, updateCurrencyByCountry } = useCurrencySafe();
  const [isOpen, setIsOpen] = useState(false);

  const availableCountries = Object.keys(countryCurrencies);

  const handleCountrySelect = (country: string) => {
    updateCurrencyByCountry(country);
    setIsOpen(false);
  };

  const getCurrentFlag = (country: string) => {
    const flags: Record<string, string> = {
      "دولة الكويت": "🇰🇼",
      "الكويت": "🇰🇼",
      "السعودية": "🇸🇦",
      "المملكة العربية السعودية": "🇸🇦",
      "الإمارات": "🇦🇪",
      "الإمارات العربية المتحدة": "🇦🇪",
      "قطر": "🇶🇦",
      "دولة قطر": "🇶🇦",
      "البحرين": "🇧🇭",
      "مملكة البحرين": "🇧🇭",
      "عمان": "🇴🇲",
      "سلطنة عمان": "🇴🇲",
      "مصر": "🇪🇬",
      "جمهورية مصر العربية": "🇪🇬",
      "الأردن": "🇯🇴",
      "المملكة الأردنية الهاشمية": "🇯🇴",
      "لبنان": "🇱🇧",
      "الجمهورية اللبنانية": "🇱🇧",
      "السودان": "🇸🇩",
      "جمهورية السودان": "🇸🇩",
    };
    return flags[country] || "🌍";
  };

  if (variant === "badge") {
    return (
      <Badge variant="outline" className={`gap-2 ${className}`}>
        <DollarSign className="w-3 h-3" />
        <span className="arabic">{currentCurrency.nameAr}</span>
        <span className="text-xs">({currentCurrency.symbol})</span>
      </Badge>
    );
  }

  if (variant === "card") {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getCurrentFlag(storeCountry)}</div>
              <div>
                <div className="font-semibold arabic text-sm">
                  {showCountry && storeCountry}
                </div>
                <div className="text-xs text-gray-600 arabic">
                  العملة: {currentCurrency.nameAr} ({currentCurrency.symbol})
                </div>
              </div>
            </div>
            
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="arabic">
                  <Globe className="w-4 h-4 ml-2" />
                  تغيير
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <div className="p-2">
                  <div className="text-sm font-semibold arabic mb-2">اختر الدولة:</div>
                  {availableCountries.map((country) => {
                    const currency = countryCurrencies[country];
                    const isSelected = country === storeCountry;
                    
                    return (
                      <DropdownMenuItem
                        key={country}
                        onClick={() => handleCountrySelect(country)}
                        className="flex items-center justify-between p-2 arabic cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCurrentFlag(country)}</span>
                          <div>
                            <div className="font-medium text-sm">{country}</div>
                            <div className="text-xs text-gray-500">
                              {currency.nameAr} ({currency.symbol})
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`gap-2 arabic ${className}`}
        >
          <span className="text-lg">{getCurrentFlag(storeCountry)}</span>
          <span className="hidden sm:inline">{currentCurrency.nameAr}</span>
          <span className="text-xs">({currentCurrency.symbol})</span>
          <Globe className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <div className="p-2">
          <div className="text-sm font-semibold arabic mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            اختر دولة المتجر:
          </div>
          {availableCountries.map((country) => {
            const currency = countryCurrencies[country];
            const isSelected = country === storeCountry;
            
            return (
              <DropdownMenuItem
                key={country}
                onClick={() => handleCountrySelect(country)}
                className="flex items-center justify-between p-2 arabic cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCurrentFlag(country)}</span>
                  <div>
                    <div className="font-medium text-sm">{country}</div>
                    <div className="text-xs text-gray-500">
                      {currency.nameAr} ({currency.symbol})
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// مكون مبسط لعرض العملة الحالية فقط
export function CurrencyDisplay({ className = "" }: { className?: string }) {
  const { currentCurrency, storeCountry } = useCurrencySafe();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DollarSign className="w-4 h-4 text-gray-500" />
      <span className="text-sm arabic text-gray-700">
        العملة: {currentCurrency.nameAr} ({currentCurrency.symbol})
      </span>
    </div>
  );
}

export default CurrencySelector;
