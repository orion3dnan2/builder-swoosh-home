import * as React from "react";
import { cn } from "@/lib/utils";

// Fallback components for when Radix UI fails
const FallbackDropdownMenu = ({ children, ...props }: any) => (
  <div className="relative inline-block" {...props}>
    {children}
  </div>
);

const FallbackDropdownMenuTrigger = ({ children, asChild, ...props }: any) => {
  if (asChild) {
    return React.cloneElement(children, props);
  }
  return <button {...props}>{children}</button>;
};

const FallbackDropdownMenuContent = ({ children, className, ...props }: any) => (
  <div
    className={cn(
      "absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const FallbackDropdownMenuItem = ({ children, className, onClick, asChild, ...props }: any) => {
  if (asChild) {
    return React.cloneElement(children, {
      className: cn("block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", className),
      onClick,
      ...props
    });
  }
  return (
    <button
      className={cn("block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const FallbackDropdownMenuLabel = ({ children, className, ...props }: any) => (
  <div className={cn("px-4 py-2 text-sm font-semibold text-gray-900", className)} {...props}>
    {children}
  </div>
);

const FallbackDropdownMenuSeparator = ({ className, ...props }: any) => (
  <hr className={cn("my-1 border-gray-200", className)} {...props} />
);

// Safe wrapper that tries Radix UI first, falls back to simple components
export const SafeDropdownMenu = ({ children, ...props }: any) => {
  // Check for browser environment
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenu {...props}>{children}</FallbackDropdownMenu>;
  }

  try {
    // Try to load Radix UI dynamically
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Root {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenu: Falling back to basic dropdown:', error);
    return <FallbackDropdownMenu {...props}>{children}</FallbackDropdownMenu>;
  }
};

export const SafeDropdownMenuTrigger = ({ children, ...props }: any) => {
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenuTrigger {...props}>{children}</FallbackDropdownMenuTrigger>;
  }

  try {
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Trigger {...props}>
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenuTrigger: Using fallback');
    return <FallbackDropdownMenuTrigger {...props}>{children}</FallbackDropdownMenuTrigger>;
  }
};

export const SafeDropdownMenuContent = ({ children, className, ...props }: any) => {
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenuContent className={className} {...props}>{children}</FallbackDropdownMenuContent>;
  }

  try {
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            className,
          )}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenuContent: Using fallback');
    return <FallbackDropdownMenuContent className={className} {...props}>{children}</FallbackDropdownMenuContent>;
  }
};

export const SafeDropdownMenuItem = ({ children, className, ...props }: any) => {
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenuItem className={className} {...props}>{children}</FallbackDropdownMenuItem>;
  }

  try {
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Item
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Item>
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenuItem: Using fallback');
    return <FallbackDropdownMenuItem className={className} {...props}>{children}</FallbackDropdownMenuItem>;
  }
};

export const SafeDropdownMenuLabel = ({ children, className, ...props }: any) => {
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenuLabel className={className} {...props}>{children}</FallbackDropdownMenuLabel>;
  }

  try {
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Label
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Label>
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenuLabel: Using fallback');
    return <FallbackDropdownMenuLabel className={className} {...props}>{children}</FallbackDropdownMenuLabel>;
  }
};

export const SafeDropdownMenuSeparator = ({ className, ...props }: any) => {
  if (typeof window === 'undefined') {
    return <FallbackDropdownMenuSeparator className={className} {...props} />;
  }

  try {
    const DropdownMenuPrimitive = require("@radix-ui/react-dropdown-menu");
    return (
      <DropdownMenuPrimitive.Separator
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
      />
    );
  } catch (error) {
    console.warn('⚠️ SafeDropdownMenuSeparator: Using fallback');
    return <FallbackDropdownMenuSeparator className={className} {...props} />;
  }
};

// Default exports for backwards compatibility
export {
  SafeDropdownMenu as DropdownMenu,
  SafeDropdownMenuTrigger as DropdownMenuTrigger,
  SafeDropdownMenuContent as DropdownMenuContent,
  SafeDropdownMenuItem as DropdownMenuItem,
  SafeDropdownMenuLabel as DropdownMenuLabel,
  SafeDropdownMenuSeparator as DropdownMenuSeparator,
};
