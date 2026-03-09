"use client";

import { useCart } from "@/context/cart-context";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { items, getCartCount, isLoading, clearCart } = useCart();
  const cartCount = getCartCount();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
      </div>
    );
  }

  if (cartCount === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Giỏ hàng của bạn ({cartCount}{" "}
        {cartCount === 1 ? "sản phẩm" : "sản phẩm"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link href="/shop">Tiếp tục mua sắm</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={clearCart}
            >
              Xoá toàn bộ giỏ hàng
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
          <Button className="w-full mt-4" size="lg" asChild>
            <Link href="/checkout">Tiến hành thanh toán</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
