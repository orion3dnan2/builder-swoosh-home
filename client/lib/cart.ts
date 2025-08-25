import { useState, useEffect } from "react";
import { Product } from "../../shared/types";

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export class CartService {
  static readonly STORAGE_KEY = "bayt_al_sudani_cart";

  // Get cart from localStorage
  static getCart(): CartItem[] {
    try {
      if (typeof window === 'undefined') return [];
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Failed to get cart from localStorage:", error);
      return [];
    }
  }

  // Save cart to localStorage
  static saveCart(cart: CartItem[]): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }

  // Add item to cart
  static addToCart(product: Product, quantity: number = 1): CartItem[] {
    try {
      const cart = this.getCart();
      const existingItemIndex = cart.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: product.id,
          quantity,
          product,
          addedAt: new Date().toISOString(),
        };
        cart.push(newItem);
      }

      this.saveCart(cart);
      return cart;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return this.getCart();
    }
  }

  // Remove item from cart
  static removeFromCart(productId: string): CartItem[] {
    try {
      const cart = this.getCart();
      const updatedCart = cart.filter(item => item.productId !== productId);
      this.saveCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return this.getCart();
    }
  }

  // Update item quantity
  static updateQuantity(productId: string, quantity: number): CartItem[] {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }

      const cart = this.getCart();
      const itemIndex = cart.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
        this.saveCart(cart);
      }
      
      return cart;
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      return this.getCart();
    }
  }

  // Clear cart
  static clearCart(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }

  // Get cart summary
  static getCartSummary(): Cart {
    try {
      const items = this.getCart();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      return {
        items,
        totalItems,
        totalPrice,
      };
    } catch (error) {
      console.error("Failed to get cart summary:", error);
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }
  }

  // Check if product is in cart
  static isInCart(productId: string): boolean {
    try {
      const cart = this.getCart();
      return cart.some(item => item.productId === productId);
    } catch (error) {
      console.error("Failed to check if product is in cart:", error);
      return false;
    }
  }

  // Get product quantity in cart
  static getProductQuantity(productId: string): number {
    try {
      const cart = this.getCart();
      const item = cart.find(item => item.productId === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      console.error("Failed to get product quantity:", error);
      return 0;
    }
  }
}

// React hook for cart management
export const useCart = () => {
  // Check for browser environment
  if (typeof window === 'undefined') {
    return {
      cart: { items: [], totalItems: 0, totalPrice: 0 },
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      isInCart: () => false,
      getProductQuantity: () => 0,
    };
  }

  let cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  let setCart: (cart: Cart) => void = () => {};

  try {
    const [cartState, setCartState] = useState<Cart>(CartService.getCartSummary());
    cart = cartState;
    setCart = setCartState;
  } catch (error) {
    console.error("useCart: useState failed:", error);
    return {
      cart: CartService.getCartSummary(),
      addToCart: (product: Product, quantity: number = 1) => {
        try {
          CartService.addToCart(product, quantity);
        } catch (error) {
          console.error("useCart: addToCart failed:", error);
        }
      },
      removeFromCart: (productId: string) => {
        try {
          CartService.removeFromCart(productId);
        } catch (error) {
          console.error("useCart: removeFromCart failed:", error);
        }
      },
      updateQuantity: (productId: string, quantity: number) => {
        try {
          CartService.updateQuantity(productId, quantity);
        } catch (error) {
          console.error("useCart: updateQuantity failed:", error);
        }
      },
      clearCart: () => {
        try {
          CartService.clearCart();
        } catch (error) {
          console.error("useCart: clearCart failed:", error);
        }
      },
      isInCart: (productId: string) => {
        try {
          return CartService.isInCart(productId);
        } catch (error) {
          console.error("useCart: isInCart failed:", error);
          return false;
        }
      },
      getProductQuantity: (productId: string) => {
        try {
          return CartService.getProductQuantity(productId);
        } catch (error) {
          console.error("useCart: getProductQuantity failed:", error);
          return 0;
        }
      },
    };
  }

  // Listen for cart updates
  try {
    useEffect(() => {
      try {
        const updateCart = () => {
          try {
            const updatedCart = CartService.getCartSummary();
            setCart(updatedCart);
          } catch (error) {
            console.error("useCart: updateCart failed:", error);
          }
        };

        // Initial load
        updateCart();

        // Listen for cart updates
        const handleCartUpdate = () => {
          try {
            updateCart();
          } catch (error) {
            console.error("useCart: handleCartUpdate failed:", error);
          }
        };

        if (typeof window !== 'undefined') {
          window.addEventListener("cartUpdated", handleCartUpdate);
          window.addEventListener("storage", (e) => {
            try {
              if (e.key === CartService.STORAGE_KEY) {
                updateCart();
              }
            } catch (error) {
              console.error("useCart: storage event failed:", error);
            }
          });
        }

        return () => {
          try {
            if (typeof window !== 'undefined') {
              window.removeEventListener("cartUpdated", handleCartUpdate);
            }
          } catch (error) {
            console.error("useCart: cleanup failed:", error);
          }
        };
      } catch (error) {
        console.error("useCart: useEffect setup failed:", error);
        return () => {};
      }
    }, []);
  } catch (error) {
    console.error("useCart: useEffect failed:", error);
  }

  return {
    cart,
    addToCart: (product: Product, quantity: number = 1) => {
      try {
        CartService.addToCart(product, quantity);
      } catch (error) {
        console.error("useCart: addToCart failed:", error);
      }
    },
    removeFromCart: (productId: string) => {
      try {
        CartService.removeFromCart(productId);
      } catch (error) {
        console.error("useCart: removeFromCart failed:", error);
      }
    },
    updateQuantity: (productId: string, quantity: number) => {
      try {
        CartService.updateQuantity(productId, quantity);
      } catch (error) {
        console.error("useCart: updateQuantity failed:", error);
      }
    },
    clearCart: () => {
      try {
        CartService.clearCart();
      } catch (error) {
        console.error("useCart: clearCart failed:", error);
      }
    },
    isInCart: (productId: string) => {
      try {
        return CartService.isInCart(productId);
      } catch (error) {
        console.error("useCart: isInCart failed:", error);
        return false;
      }
    },
    getProductQuantity: (productId: string) => {
      try {
        return CartService.getProductQuantity(productId);
      } catch (error) {
        console.error("useCart: getProductQuantity failed:", error);
        return 0;
      }
    },
  };
};
