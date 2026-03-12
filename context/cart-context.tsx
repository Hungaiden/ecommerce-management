"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as cartService from "@/service/cart/cart";
import type { CartItem as BackendCartItem } from "@/service/cart/cart";
import { getCookie } from "@/lib/cookies";

export type CartItem = {
  _id: string; // item._id từ backend
  product_id: string; // id của sản phẩm
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

type AddToCartPayload = {
  product_id: string;
  quantity?: number;
  size?: string;
  color?: string;
};

type CartContextType = {
  items: CartItem[];
  isLoading: boolean;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Map từ backend CartItem sang CartItem của context
const mapCartItems = (backendItems: BackendCartItem[]): CartItem[] => {
  return backendItems
    .filter((item) => item.product_id != null)
    .map((item) => ({
      _id: item._id,
      product_id: item.product_id._id,
      name: item.product_id.name,
      image: item.product_id.thumbnail ?? "",
      price: item.product_id.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = () => !!getCookie("userInfo");

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      return;
    }
    try {
      setIsLoading(true);
      const cart = await cartService.getCart();
      setItems(mapCartItems(cart.items));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải giỏ hàng khi mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (payload: AddToCartPayload) => {
    if (!isLoggedIn()) throw new Error("Vui lòng đăng nhập!");
    setIsLoading(true);
    try {
      const cart = await cartService.addToCart(payload);
      setItems(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isLoggedIn()) throw new Error("Vui lòng đăng nhập!");
    setIsLoading(true);
    try {
      const cart = await cartService.removeCartItem(itemId);
      setItems(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isLoggedIn()) throw new Error("Vui lòng đăng nhập!");
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    setIsLoading(true);
    try {
      const cart = await cartService.updateCartItem(itemId, { quantity });
      setItems(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn()) throw new Error("Vui lòng đăng nhập!");
    setIsLoading(true);
    try {
      await cartService.clearCart();
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
