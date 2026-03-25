'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '@/service/cart/cart';
import type { CartItem as BackendCartItem } from '@/service/cart/cart';
import { getCookie } from '@/lib/cookies';

export type CartItem = {
  _id: string; // item._id từ backend
  product_id: string; // id của sản phẩm
  name: string;
  image: string;
  price: number;
  stock: number;
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
  selectedItemIds: string[];
  selectedItems: CartItem[];
  isLoading: boolean;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  removeSelectedItems: (itemIds?: string[]) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  toggleItemSelection: (itemId: string, checked: boolean) => void;
  toggleSelectAll: (checked: boolean) => void;
  isItemSelected: (itemId: string) => boolean;
  getCartTotal: () => number;
  getSelectedTotal: () => number;
  getSelectedCount: () => number;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Map từ backend CartItem sang CartItem của context
const mapCartItems = (backendItems: BackendCartItem[]): CartItem[] => {
  return backendItems
    .filter((item) => item.product_id != null)
    .map((item) => {
      const thumbnail = item.product_id.thumbnail?.trim?.() || '';
      const firstImage = item.product_id.images?.[0]?.trim?.() || '';

      return {
        _id: item._id,
        product_id: item.product_id._id,
        name: item.product_id.name,
        image: thumbnail || firstImage,
        price: item.product_id.price,
        stock: item.product_id.stock,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      };
    });
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = () => !!getCookie('userInfo');

  const syncItemsWithSelection = (nextItems: CartItem[]) => {
    setItems((prevItems) => {
      setSelectedItemIds((prevSelectedIds) => {
        if (nextItems.length === 0) return [];

        const nextIds = new Set(nextItems.map((item) => item._id));
        const prevItemIds = new Set(prevItems.map((item) => item._id));
        const isInitialLoad = prevItems.length === 0 && prevSelectedIds.length === 0;

        if (isInitialLoad) {
          return nextItems.map((item) => item._id);
        }

        const keptSelected = prevSelectedIds.filter((id) => nextIds.has(id));
        const newItemIds = nextItems.map((item) => item._id).filter((id) => !prevItemIds.has(id));

        return Array.from(new Set([...keptSelected, ...newItemIds]));
      });

      return nextItems;
    });
  };

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      setSelectedItemIds([]);
      return;
    }
    try {
      setIsLoading(true);
      const cart = await cartService.getCart();
      syncItemsWithSelection(mapCartItems(cart.items));
    } catch {
      setItems([]);
      setSelectedItemIds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải giỏ hàng khi mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (payload: AddToCartPayload) => {
    if (!isLoggedIn()) throw new Error('Vui lòng đăng nhập!');
    setIsLoading(true);
    try {
      const cart = await cartService.addToCart(payload);
      syncItemsWithSelection(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isLoggedIn()) throw new Error('Vui lòng đăng nhập!');
    setIsLoading(true);
    try {
      const cart = await cartService.removeCartItem(itemId);
      syncItemsWithSelection(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelectedItems = async (itemIds?: string[]) => {
    if (!isLoggedIn()) throw new Error('Vui lòng đăng nhập!');
    const idsToRemove = itemIds ?? selectedItemIds;
    if (idsToRemove.length === 0) return;

    setIsLoading(true);
    try {
      for (const itemId of idsToRemove) {
        await cartService.removeCartItem(itemId);
      }
      const cart = await cartService.getCart();
      syncItemsWithSelection(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isLoggedIn()) throw new Error('Vui lòng đăng nhập!');
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    setIsLoading(true);
    try {
      const cart = await cartService.updateCartItem(itemId, { quantity });
      syncItemsWithSelection(mapCartItems(cart.items));
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn()) throw new Error('Vui lòng đăng nhập!');
    setIsLoading(true);
    try {
      await cartService.clearCart();
      setItems([]);
      setSelectedItemIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItemIds((prev) => {
      if (checked) {
        if (prev.includes(itemId)) return prev;
        return [...prev, itemId];
      }
      return prev.filter((id) => id !== itemId);
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedItemIds([]);
      return;
    }
    setSelectedItemIds(items.map((item) => item._id));
  };

  const isItemSelected = (itemId: string) => selectedItemIds.includes(itemId);

  const selectedItems = items.filter((item) => selectedItemIds.includes(item._id));

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedCount = () => {
    return selectedItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItemIds,
        selectedItems,
        isLoading,
        addItem,
        removeItem,
        removeSelectedItems,
        updateQuantity,
        clearCart,
        refreshCart,
        toggleItemSelection,
        toggleSelectAll,
        isItemSelected,
        getCartTotal,
        getSelectedTotal,
        getSelectedCount,
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
