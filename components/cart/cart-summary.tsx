'use client';

import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartSummary() {
  const { getSelectedTotal, getSelectedCount } = useCart();
  const selectedCount = getSelectedCount();
  const subtotal = getSelectedTotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 0 ? 15 : 0; // $15 shipping fee if cart is not empty
  const total = subtotal + tax + shipping;

  return (
    <div className="border rounded-lg p-6 bg-card border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-black">Tóm tắt đơn hàng</h2>
      <p className="mb-4 text-sm text-muted-foreground">{selectedCount} sản phẩm đã chọn</p>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Thuế (10%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="font-medium">
            {shipping > 0 ? formatCurrency(shipping) : 'Miễn phí'}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-black">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-black hover:bg-gray-900 text-white"
          size="lg"
          disabled={subtotal === 0}
          asChild
        >
          <Link href="/checkout">
            Tiến hành thanh toán
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Thanh toán an toàn & bảo mật</p>
          <p className="mt-1">Hỗ trợ đổi trả trong vòng 48 giờ</p>
        </div>
      </div>
    </div>
  );
}
