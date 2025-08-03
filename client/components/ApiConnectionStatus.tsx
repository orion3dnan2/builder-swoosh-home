import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Wifi,
  WifiOff,
  Server,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useApiConnectionStatus } from "@/hooks/use-api-config";
import { ApiService } from "@/lib/apiService";

interface ApiConnectionStatusProps {
  variant?: "compact" | "full" | "badge";
  showRefresh?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

export function ApiConnectionStatus({
  variant = "compact",
  showRefresh = true,
  autoRefresh = true,
  className = "",
}: ApiConnectionStatusProps) {
  const { isExternal, activeConfig, baseUrl, lastCheck, refreshStatus } =
    useApiConnectionStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionTest, setConnectionTest] = useState<{
    success: boolean;
    message: string;
    responseTime?: number;
  } | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await ApiService.testConnection();
      setConnectionTest(result);
      refreshStatus();
    } catch (error) {
      setConnectionTest({
        success: false,
        message: "فشل الاختبار",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (autoRefresh) {
      handleRefresh();
    }
  }, [autoRefresh, activeConfig]);

  const getStatusColor = () => {
    if (connectionTest === null) return "secondary";
    return connectionTest.success ? "default" : "destructive";
  };

  const getStatusIcon = () => {
    if (isRefreshing) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }

    if (connectionTest === null) {
      return <Clock className="w-4 h-4" />;
    }

    if (connectionTest.success) {
      return isExternal ? (
        <Globe className="w-4 h-4" />
      ) : (
        <Server className="w-4 h-4" />
      );
    }

    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isRefreshing) return "جاري الفحص...";
    if (connectionTest === null) return "لم يتم الفحص";
    if (connectionTest.success) {
      return isExternal ? "متصل بخادم خارجي" : "متصل بالخادم المحلي";
    }
    return "غير متصل";
  };

  const getDetailedInfo = () => {
    return {
      serverType: isExternal ? "خادم خارجي" : "خادم محلي",
      serverName: activeConfig?.name || "الخادم الافتراضي",
      baseUrl: baseUrl,
      status: connectionTest?.success ? "متصل" : "غير متصل",
      responseTime: connectionTest?.responseTime
        ? `${connectionTest.responseTime}ms`
        : "-",
      lastCheck: lastCheck ? lastCheck.toLocaleTimeString("ar-SA") : "-",
    };
  };

  if (variant === "badge") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={getStatusColor()}
              className={`flex items-center space-x-1 space-x-reverse cursor-help ${className}`}
            >
              {getStatusIcon()}
              <span className="arabic text-xs">{getStatusText()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="arabic">
            <div className="space-y-1">
              <p>
                <strong>الخادم:</strong> {getDetailedInfo().serverName}
              </p>
              <p>
                <strong>النوع:</strong> {getDetailedInfo().serverType}
              </p>
              <p>
                <strong>الحالة:</strong> {getDetailedInfo().status}
              </p>
              {connectionTest?.responseTime && (
                <p>
                  <strong>وقت الاستجابة:</strong>{" "}
                  {getDetailedInfo().responseTime}
                </p>
              )}
              <p>
                <strong>آخر فحص:</strong> {getDetailedInfo().lastCheck}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center space-x-2 space-x-reverse ${className}`}
      >
        <Badge
          variant={getStatusColor()}
          className="flex items-center space-x-1 space-x-reverse"
        >
          {getStatusIcon()}
          <span className="arabic text-xs">{getStatusText()}</span>
        </Badge>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        )}
      </div>
    );
  }

  const info = getDetailedInfo();

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            {getStatusIcon()}
            <span className="font-semibold arabic">{getStatusText()}</span>
            <Badge variant={getStatusColor()}>
              {connectionTest?.success ? "نشط" : "غير نشط"}
            </Badge>
          </div>
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="arabic"
            >
              <RefreshCw
                className={`w-4 h-4 ml-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "جاري الفحص..." : "فحص الاتصال"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 arabic">نوع الخادم:</span>
            <p className="font-medium arabic">{info.serverType}</p>
          </div>
          <div>
            <span className="text-gray-600 arabic">اسم الخادم:</span>
            <p className="font-medium arabic">{info.serverName}</p>
          </div>
          <div>
            <span className="text-gray-600 arabic">الرابط:</span>
            <p className="font-mono text-xs break-all">{info.baseUrl}</p>
          </div>
          <div>
            <span className="text-gray-600 arabic">وقت الاستجابة:</span>
            <p className="font-medium">{info.responseTime}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600 arabic">آخر فحص:</span>
            <p className="font-medium arabic">{info.lastCheck}</p>
          </div>
        </div>

        {connectionTest && !connectionTest.success && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 arabic">
                خطأ في الاتصال:
              </span>
            </div>
            <p className="text-sm text-red-600 mt-1 arabic">
              {connectionTest.message}
            </p>
          </div>
        )}

        {connectionTest && connectionTest.success && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 arabic">
                الاتصال ناجح
              </span>
              {connectionTest.responseTime && (
                <span className="text-xs text-green-600">
                  ({connectionTest.responseTime}ms)
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick status component for headers/navbars
export function QuickApiStatus() {
  return (
    <ApiConnectionStatus
      variant="badge"
      showRefresh={false}
      autoRefresh={true}
    />
  );
}

// Detailed status component for settings/admin pages
export function DetailedApiStatus() {
  return (
    <ApiConnectionStatus variant="full" showRefresh={true} autoRefresh={true} />
  );
}
