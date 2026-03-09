"use client";

import Image from "next/image";
import { useCart, type CartItem } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncreaseQuantity = () => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item._id);
  };

  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-card border-ocean-100 transition-all duration-300 hover:shadow-md group">
      <div className="relative w-full sm:w-48 h-48">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/shop/${item.product_id}`}
              className="font-semibold text-lg hover:text-ocean-600 transition-colors"
            >
              {item.name}
            </Link>
            <div className="flex gap-3 mt-1">
              {item.size && (
                <p className="text-muted-foreground text-sm">
                  Size:{" "}
                  <span className="font-medium text-foreground">
                    {item.size}
                  </span>
                </p>
              )}
              {item.color && (
                <p className="text-muted-foreground text-sm">
                  Màu:{" "}
                  <span className="font-medium text-foreground">
                    {item.color}
                  </span>
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xoá sản phẩm</span>
          </Button>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4">
          <div className="flex items-center border rounded-md border-ocean-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecreaseQuantity}
              disabled={item.quantity <= 1}
              className="h-8 w-8 text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Giảm số lượng</span>
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncreaseQuantity}
              className="h-8 w-8 text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Tăng số lượng</span>
            </Button>
          </div>

          <div className="text-right">
            <p className="font-medium text-ocean-700">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.quantity > 1 && `${formatCurrency(item.price)} / sản phẩm`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
