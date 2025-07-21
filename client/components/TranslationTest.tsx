import { useTheme } from "@/contexts/ThemeContext";

export function TranslationTest() {
  const { t, language, isRTL } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Translation Test</h3>
      <div className="space-y-1 text-sm">
        <div>Language: {language}</div>
        <div>RTL: {isRTL ? 'Yes' : 'No'}</div>
        <div>Welcome: {t("common.welcome")}</div>
        <div>Login: {t("common.login")}</div>
        <div>Dashboard: {t("dashboard.admin")}</div>
        <div>Arabic Test: {t("nav.home")}</div>
      </div>
    </div>
  );
}
