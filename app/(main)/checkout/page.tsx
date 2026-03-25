'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Banknote, Building2, Loader2, ShoppingBag, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder } from '@/service/orders';
import { createVNPayPaymentUrl } from '@/service/payment';
import Image from 'next/image';
import {
  incrementDiscountUsage,
  validateDiscountCode,
  type ValidateDiscountResponse,
} from '@/service/admin/discounts';

export default function CheckoutPage() {
  const { selectedItems, removeSelectedItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Contact form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'vnpay'>('cash');
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountResponse | null>(null);

  // Pre-fill from auth
  useEffect(() => {
    if (user) {
      if (user.fullName) setName(user.fullName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Redirect if empty cart (but not while processing or right after placing an order)
  useEffect(() => {
    if (selectedItems.length === 0 && !isProcessing && !isOrderPlaced) {
      router.replace('/cart');
    }
  }, [selectedItems, router, isProcessing, isOrderPlaced]);

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.min(appliedDiscount?.discountAmount ?? 0, totalPrice);
  const finalTotalPrice = Math.max(totalPrice - discountAmount, 0);

  const handleApplyDiscount = async () => {
    const code = discountCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const result = await validateDiscountCode(code, totalPrice);
      setAppliedDiscount(result);
      setDiscountCodeInput(result.code);
      toast.success('Áp dụng mã khuyến mãi thành công');
    } catch (err: any) {
      setAppliedDiscount(null);
      toast.error(
        err?.response?.data?.message ?? 'Không thể áp dụng mã khuyến mãi. Vui lòng thử lại.',
      );
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCodeInput('');
    toast.success('Đã hủy mã khuyến mãi');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    setIsProcessing(true);
    try {
      const order = await createOrder({
        items: selectedItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          thumbnail: item.image,
          price: item.price,
          discount: 0,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        contact_info: { name, phone, email, address },
        note,
        total_price: finalTotalPrice,
        discount_id: appliedDiscount?.discountId,
        discount_code: appliedDiscount?.code,
        discount_amount: discountAmount,
        payment_method: paymentMethod,
      });

      const orderId = order?._id;
      if (!orderId) {
        throw new Error('Không thể lấy mã đơn hàng sau khi thanh toán.');
      }

      if (appliedDiscount?.discountId) {
        try {
          await incrementDiscountUsage(appliedDiscount.discountId);
        } catch {
          // Do not block checkout success if usage tracking fails.
        }
      }

      setIsOrderPlaced(true);

      if (paymentMethod === 'vnpay') {
        try {
          const paymentUrl = await createVNPayPaymentUrl(orderId);
          removeSelectedItems(selectedItems.map((item) => item._id)).catch(() => {});
          window.location.assign(paymentUrl);
          return;
        } catch {
          toast.error(
            'Don hang da tao nhung khong lay duoc link VNPay. Vui long vao Don hang cua toi de xu ly tiep.',
          );
          router.push('/bookings');
          return;
        }
      }

      // Navigate first, then clear cart (to avoid empty-cart redirect firing before navigation)
      if (paymentMethod === 'bank_transfer') {
        toast.success('Đặt hàng thành công. Vui lòng chuyển khoản để xác nhận.');
        router.push(
          `/checkout/bank-transfer?orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(finalTotalPrice.toString())}`,
        );
      } else {
        toast.success('Đặt hàng COD thành công!');
        router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
      }

      removeSelectedItems(selectedItems.map((item) => item._id)).catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0 && !isOrderPlaced) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Contact info */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="0912345678"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ giao hàng</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Số nhà, đường, phường, quận, thành phố"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment method */}
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as 'cash' | 'bank_transfer' | 'vnpay')}
                    className="space-y-3"
                  >
                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <RadioGroupItem value="cash" id="cash" className="mt-0.5" />
                      <div className="flex-1">
                        <Label
                          htmlFor="cash"
                          className="cursor-pointer flex items-center gap-2 font-medium"
                        >
                          <Banknote className="h-4 w-4" />
                          Thanh toán khi nhận hàng (COD)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Thanh toán bằng tiền mặt khi nhận được hàng.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => setPaymentMethod('vnpay')}
                    >
                      <RadioGroupItem value="vnpay" id="vnpay" className="mt-0.5" />
                      <div className="flex-1">
                        <Label
                          htmlFor="vnpay"
                          className="cursor-pointer flex items-center gap-2 font-medium"
                        >
                          <Wallet className="h-4 w-4" />
                          Thanh toan VNPay
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Thanh toan online qua cong VNPay, ho tro app ngan hang va the noi dia.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border'}`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-0.5" />
                      <div className="flex-1">
                        <Label
                          htmlFor="bank_transfer"
                          className="cursor-pointer flex items-center gap-2 font-medium"
                        >
                          <Building2 className="h-4 w-4" />
                          Chuyển khoản ngân hàng
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Chuyển khoản qua ngân hàng. Thông tin tài khoản sẽ hiển thị sau khi đặt
                          hàng.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Discount code */}
              <Card>
                <CardHeader>
                  <CardTitle>Mã khuyến mãi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      placeholder="Nhập mã khuyến mãi"
                      className="uppercase"
                      disabled={isApplyingDiscount}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                    >
                      {isApplyingDiscount ? 'Đang áp dụng...' : 'Áp dụng'}
                    </Button>
                    {appliedDiscount && (
                      <Button type="button" variant="ghost" onClick={handleRemoveDiscount}>
                        Bỏ mã
                      </Button>
                    )}
                  </div>
                  {appliedDiscount && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                      <p>
                        Đã áp dụng mã <strong>{appliedDiscount.code}</strong>.
                      </p>
                      <p>
                        Giảm: <strong>{discountAmount.toLocaleString('vi-VN')}₫</strong>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mobile order summary */}
              <Card className="lg:hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Đơn hàng ({selectedItems.length} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` / ${item.color}`} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                  <Separator />
                  {appliedDiscount && (
                    <>
                      <div className="flex justify-between text-green-700">
                        <span>Giảm giá ({appliedDiscount.code})</span>
                        <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{finalTotalPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : paymentMethod === 'bank_transfer' ? (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Đặt hàng &amp; Xem thông tin chuyển khoản
                  </>
                ) : paymentMethod === 'vnpay' ? (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Dat hang &amp; Thanh toan VNPay
                  </>
                ) : (
                  <>
                    <Banknote className="mr-2 h-4 w-4" />
                    Đặt hàng (COD)
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Order summary */}
        <div className="hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Đơn hàng ({selectedItems.length} sản phẩm)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` / ${item.color}`} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-green-700">
                    <span>Giảm giá ({appliedDiscount.code})</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Tổng cộng</span>
                <span className="text-primary">{finalTotalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
