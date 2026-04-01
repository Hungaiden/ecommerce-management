'use client';

import Image from 'next/image';
import { useCart, type CartItem } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem, isItemSelected, toggleItemSelection } = useCart();
  const imageSrc = item.image?.trim() ? item.image : '/placeholder.svg';
  const maxQuantity = item.stock > 0 ? item.stock : item.quantity;
  const [quantityInput, setQuantityInput] = useState(String(item.quantity));
  const isSelected = isItemSelected(item._id);

  useEffect(() => {
    setQuantityInput(String(item.quantity));
  }, [item.quantity]);

  const handleIncreaseQuantity = async () => {
    if (item.quantity >= maxQuantity) return;
    await updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = async () => {
    if (item.quantity > 1) {
      await updateQuantity(item._id, item.quantity - 1);
    }
  };

  const applyQuantityInput = async () => {
    const parsed = Number.parseInt(quantityInput, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setQuantityInput(String(item.quantity));
      return;
    }
    const nextQuantity = Math.min(parsed, maxQuantity);
    if (nextQuantity === item.quantity) {
      setQuantityInput(String(item.quantity));
      return;
    }
    await updateQuantity(item._id, nextQuantity);
  };

  const handleRemove = () => {
    removeItem(item._id);
  };

  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-card border-gray-200 transition-all duration-300 hover:shadow-md group">
      <div className="relative w-full sm:w-48 h-48">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => toggleItemSelection(item._id, checked === true)}
              aria-label={`Chọn sản phẩm ${item.name} để thanh toán`}
              className="mt-1"
            />
            <div>
              <Link
                href={`/shop/${item.product_id}`}
                className="font-semibold text-lg hover:text-black transition-colors"
              >
                {item.name}
              </Link>
              <div className="flex gap-3 mt-1">
                {item.size && (
                  <p className="text-muted-foreground text-sm">
                    Size: <span className="font-medium text-foreground">{item.size}</span>
                  </p>
                )}
                {item.color && (
                  <p className="text-muted-foreground text-sm">
                    Màu: <span className="font-medium text-foreground">{item.color}</span>
                  </p>
                )}
              </div>
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
          <div>
            <div className="flex items-center border rounded-md border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={item.quantity <= 1}
                className="h-8 w-8 text-black hover:text-gray-700 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Giảm số lượng</span>
              </Button>
              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                onBlur={applyQuantityInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void applyQuantityInput();
                  }
                }}
                className="w-14 h-8 text-center text-sm bg-transparent outline-none"
                aria-label="Số lượng sản phẩm"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncreaseQuantity}
                disabled={item.quantity >= maxQuantity}
                className="h-8 w-8 text-black hover:text-gray-700 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Tăng số lượng</span>
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Còn {maxQuantity} sản phẩm</p>
          </div>

          <div className="text-right">
            <p className="font-medium text-black">{formatCurrency(item.price * item.quantity)}</p>
            <p className="text-sm text-muted-foreground">
              {item.quantity > 1 && `${formatCurrency(item.price)} / sản phẩm`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
