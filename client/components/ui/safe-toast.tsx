import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Safe fallback interfaces
interface SafeToastProviderProps {
  children: React.ReactNode;
}

interface SafeToastProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive";
}

interface SafeToastActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SafeToastCloseProps {
  className?: string;
  onClick?: () => void;
}

interface SafeToastTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SafeToastDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface SafeToastViewportProps {
  className?: string;
}

// Try to import original Radix UI components with fallbacks
let OriginalToastProvider: React.ComponentType<any> | null = null;
let OriginalToastViewport: React.ComponentType<any> | null = null;
let OriginalToast: React.ComponentType<any> | null = null;
let OriginalToastAction: React.ComponentType<any> | null = null;
let OriginalToastClose: React.ComponentType<any> | null = null;
let OriginalToastTitle: React.ComponentType<any> | null = null;
let OriginalToastDescription: React.ComponentType<any> | null = null;

// Safe initialization
if (typeof window !== 'undefined') {
  try {
    const ToastModule = require("@radix-ui/react-toast");
    const toastVariants = require("class-variance-authority").cva;
    
    OriginalToastProvider = ToastModule.Provider;
    OriginalToastViewport = React.forwardRef<any, any>(({ className, ...props }, ref) => (
      React.createElement(ToastModule.Viewport, {
        ref,
        className: cn(
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
          className,
        ),
        ...props
      })
    ));
    
    const toastVariantStyles = toastVariants(
      "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
      {
        variants: {
          variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
          },
        },
        defaultVariants: {
          variant: "default",
        },
      },
    );
    
    OriginalToast = React.forwardRef<any, any>(({ className, variant, ...props }, ref) => {
      return React.createElement(ToastModule.Root, {
        ref,
        className: cn(toastVariantStyles({ variant }), className),
        ...props
      });
    });
    
    OriginalToastAction = React.forwardRef<any, any>(({ className, ...props }, ref) => (
      React.createElement(ToastModule.Action, {
        ref,
        className: cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
          className,
        ),
        ...props
      })
    ));
    
    OriginalToastClose = React.forwardRef<any, any>(({ className, ...props }, ref) => (
      React.createElement(ToastModule.Close, {
        ref,
        className: cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
          className,
        ),
        "toast-close": "",
        ...props,
        children: React.createElement(X, { className: "h-4 w-4" })
      })
    ));
    
    OriginalToastTitle = React.forwardRef<any, any>(({ className, ...props }, ref) => (
      React.createElement(ToastModule.Title, {
        ref,
        className: cn("text-sm font-semibold", className),
        ...props
      })
    ));
    
    OriginalToastDescription = React.forwardRef<any, any>(({ className, ...props }, ref) => (
      React.createElement(ToastModule.Description, {
        ref,
        className: cn("text-sm opacity-90", className),
        ...props
      })
    ));
  } catch (error) {
    console.warn("Failed to load Radix UI Toast components, using fallbacks:", error);
  }
}

// Fallback components
const FallbackToastProvider: React.FC<SafeToastProviderProps> = ({ children }) => {
  return (
    <div className="toast-provider" data-fallback="true">
      {children}
    </div>
  );
};

const FallbackToastViewport: React.FC<SafeToastViewportProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      data-fallback="true"
    />
  );
};

const FallbackToast: React.FC<SafeToastProps> = ({ children, className, variant = "default" }) => {
  const variantClasses = {
    default: "border bg-background text-foreground",
    destructive: "border-destructive bg-destructive text-destructive-foreground"
  };

  return (
    <div 
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg",
        variantClasses[variant],
        className
      )}
      data-fallback="true"
    >
      {children}
    </div>
  );
};

const FallbackToastAction: React.FC<SafeToastActionProps> = ({ children, className, onClick }) => {
  return (
    <button 
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={onClick}
      data-fallback="true"
    >
      {children}
    </button>
  );
};

const FallbackToastClose: React.FC<SafeToastCloseProps> = ({ className, onClick }) => {
  return (
    <button 
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
        className
      )}
      onClick={onClick}
      data-fallback="true"
    >
      <X className="h-4 w-4" />
    </button>
  );
};

const FallbackToastTitle: React.FC<SafeToastTitleProps> = ({ children, className }) => {
  return (
    <div 
      className={cn("text-sm font-semibold", className)}
      data-fallback="true"
    >
      {children}
    </div>
  );
};

const FallbackToastDescription: React.FC<SafeToastDescriptionProps> = ({ children, className }) => {
  return (
    <div 
      className={cn("text-sm opacity-90", className)}
      data-fallback="true"
    >
      {children}
    </div>
  );
};

// Safe wrapper components that try Radix UI first, then fall back
export const SafeToastProvider: React.FC<SafeToastProviderProps> = ({ children }) => {
  try {
    if (OriginalToastProvider && typeof window !== 'undefined') {
      return React.createElement(OriginalToastProvider, {}, children);
    }
  } catch (error) {
    console.warn("SafeToastProvider: Radix UI failed, using fallback:", error);
  }
  return <FallbackToastProvider>{children}</FallbackToastProvider>;
};

export const SafeToastViewport = React.forwardRef<HTMLDivElement, SafeToastViewportProps>(
  ({ className, ...props }, ref) => {
    try {
      if (OriginalToastViewport && typeof window !== 'undefined') {
        return React.createElement(OriginalToastViewport, { ref, className, ...props });
      }
    } catch (error) {
      console.warn("SafeToastViewport: Radix UI failed, using fallback:", error);
    }
    return <FallbackToastViewport className={className} />;
  }
);
SafeToastViewport.displayName = "SafeToastViewport";

export const SafeToast = React.forwardRef<HTMLDivElement, SafeToastProps>(
  ({ children, className, variant, ...props }, ref) => {
    try {
      if (OriginalToast && typeof window !== 'undefined') {
        return React.createElement(OriginalToast, { ref, className, variant, ...props }, children);
      }
    } catch (error) {
      console.warn("SafeToast: Radix UI failed, using fallback:", error);
    }
    return <FallbackToast className={className} variant={variant}>{children}</FallbackToast>;
  }
);
SafeToast.displayName = "SafeToast";

export const SafeToastAction = React.forwardRef<HTMLButtonElement, SafeToastActionProps>(
  ({ children, className, onClick, ...props }, ref) => {
    try {
      if (OriginalToastAction && typeof window !== 'undefined') {
        return React.createElement(OriginalToastAction, { ref, className, onClick, ...props }, children);
      }
    } catch (error) {
      console.warn("SafeToastAction: Radix UI failed, using fallback:", error);
    }
    return <FallbackToastAction className={className} onClick={onClick}>{children}</FallbackToastAction>;
  }
);
SafeToastAction.displayName = "SafeToastAction";

export const SafeToastClose = React.forwardRef<HTMLButtonElement, SafeToastCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    try {
      if (OriginalToastClose && typeof window !== 'undefined') {
        return React.createElement(OriginalToastClose, { ref, className, onClick, ...props });
      }
    } catch (error) {
      console.warn("SafeToastClose: Radix UI failed, using fallback:", error);
    }
    return <FallbackToastClose className={className} onClick={onClick} />;
  }
);
SafeToastClose.displayName = "SafeToastClose";

export const SafeToastTitle = React.forwardRef<HTMLDivElement, SafeToastTitleProps>(
  ({ children, className, ...props }, ref) => {
    try {
      if (OriginalToastTitle && typeof window !== 'undefined') {
        return React.createElement(OriginalToastTitle, { ref, className, ...props }, children);
      }
    } catch (error) {
      console.warn("SafeToastTitle: Radix UI failed, using fallback:", error);
    }
    return <FallbackToastTitle className={className}>{children}</FallbackToastTitle>;
  }
);
SafeToastTitle.displayName = "SafeToastTitle";

export const SafeToastDescription = React.forwardRef<HTMLDivElement, SafeToastDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    try {
      if (OriginalToastDescription && typeof window !== 'undefined') {
        return React.createElement(OriginalToastDescription, { ref, className, ...props }, children);
      }
    } catch (error) {
      console.warn("SafeToastDescription: Radix UI failed, using fallback:", error);
    }
    return <FallbackToastDescription className={className}>{children}</FallbackToastDescription>;
  }
);
SafeToastDescription.displayName = "SafeToastDescription";

// Type exports for compatibility
export type SafeToastProps = SafeToastProps;
export type SafeToastActionElement = React.ReactElement<typeof SafeToastAction>;
