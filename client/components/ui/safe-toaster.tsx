import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  SafeToast,
  SafeToastClose,
  SafeToastDescription,
  SafeToastProvider,
  SafeToastTitle,
  SafeToastViewport,
} from "./safe-toast";

// Fallback toaster that doesn't rely on Radix UI
const FallbackToaster: React.FC = () => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      // Try to get toasts from the useToast hook if available
      const { toasts: hookToasts } = useToast();
      if (hookToasts && Array.isArray(hookToasts)) {
        setToasts(hookToasts);
      }
    } catch (error) {
      console.warn("FallbackToaster: useToast failed, using empty toasts:", error);
      setToasts([]);
    }
  }, []);

  if (!toasts || toasts.length === 0) {
    return (
      <div className="toast-container fixed top-0 z-[100] w-full sm:bottom-0 sm:right-0 sm:top-auto md:max-w-[420px]" data-fallback="true">
      </div>
    );
  }

  return (
    <div className="toast-container fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" data-fallback="true">
      {toasts.map((toast) => (
        <div
          key={toast.id || Math.random()}
          className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg mb-2 bg-background text-foreground"
        >
          <div className="grid gap-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          {toast.action}
          <button 
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            onClick={() => {
              // Remove toast from state
              setToasts(prevToasts => prevToasts.filter(t => t.id !== toast.id));
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export function SafeToaster() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Try to use the useToast hook and safe components
    const { toasts } = useToast();

    return (
      <SafeToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <SafeToast key={id} {...props}>
              <div className="grid gap-1">
                {title && <SafeToastTitle>{title}</SafeToastTitle>}
                {description && (
                  <SafeToastDescription>{description}</SafeToastDescription>
                )}
              </div>
              {action}
              <SafeToastClose />
            </SafeToast>
          );
        })}
        <SafeToastViewport />
      </SafeToastProvider>
    );
  } catch (error) {
    console.warn("SafeToaster: Safe components failed, using fallback toaster:", error);
    return <FallbackToaster />;
  }
}

// Export as Toaster for compatibility
export { SafeToaster as Toaster };
