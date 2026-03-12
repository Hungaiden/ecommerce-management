"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
  productId: string;
  size?: string;
  color?: string;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  size,
  color,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem({ product_id: productId, quantity, size, color });
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: "Sản phẩm đã được thêm vào giỏ hàng của bạn.",
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Thêm thất bại",
        description: err?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
    </Button>
  );
}
