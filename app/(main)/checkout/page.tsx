"use client";

import type React from "react";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Form states
    const [paymentMethod, setPaymentMethod] = useState("credit-card");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
            clearCart();

            // Redirect to confirmation page after 2 seconds
            setTimeout(() => {
                router.push("/checkout/confirmation");
            }, 2000);
        }, 2000);
    };

    // if (state.items.length === 0 && !isComplete) {
    //     router.push("/cart");
    //     return null;
    // }

    if (isComplete) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
                </div>
                <h1 className="mt-6 text-2xl font-bold">Thanh toán thành công!</h1>
                <p className="mt-2 text-muted-foreground">
                    Đơn hàng của bạn đã được xử lý thành công.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <a href="/">Về trang chủ</a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin khách hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">
                                                Họ
                                            </Label>
                                            <Input id="firstName" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">
                                                Tên
                                            </Label>
                                            <Input id="lastName" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input id="phone" type="tel" required />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Billing Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Địa chỉ giao hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Input id="address" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Thành phố</Label>
                                            <Input id="city" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">
                                                Tỉnh/Quận
                                            </Label>
                                            <Input id="state" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">
                                                Mã bưu chính
                                            </Label>
                                            <Input id="zip" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">
                                                Quốc gia
                                            </Label>
                                            <Input id="country" required />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phương thức thanh toán</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs
                                        defaultValue="credit-card"
                                        onValueChange={setPaymentMethod}
                                    >
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="credit-card">
                                                Thẻ tín dụng
                                            </TabsTrigger>
                                            <TabsTrigger value="paypal">
                                                PayPal
                                            </TabsTrigger>
                                            <TabsTrigger value="bank-transfer">
                                                Chuyển khoản
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value="credit-card"
                                            className="space-y-4 mt-4"
                                        >
                                            <div className="space-y-2">
                                                <Label htmlFor="cardName">
                                                    Tên trên thẻ
                                                </Label>
                                                <Input
                                                    id="cardName"
                                                    required={
                                                        paymentMethod ===
                                                        "credit-card"
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">
                                                    Số thẻ
                                                </Label>
                                                <Input
                                                    id="cardNumber"
                                                    placeholder="1234 5678 9012 3456"
                                                    required={
                                                        paymentMethod ===
                                                        "credit-card"
                                                    }
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">
                                                        Ngày hết hạn
                                                    </Label>
                                                    <Input
                                                        id="expiry"
                                                        placeholder="MM/YY"
                                                        required={
                                                            paymentMethod ===
                                                            "credit-card"
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">
                                                        Mã CVV/CVC
                                                    </Label>
                                                    <Input
                                                        id="cvc"
                                                        placeholder="123"
                                                        required={
                                                            paymentMethod ===
                                                            "credit-card"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value="paypal"
                                            className="mt-4"
                                        >
                                            <div className="text-center p-4">
                                                <p className="mb-4">
                                                    Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán.
                                                </p>
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                >
                                                    Tiếp tục với PayPal
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value="bank-transfer"
                                            className="mt-4"
                                        >
                                            <div className="p-4 border rounded-md bg-muted">
                                                <h3 className="font-medium mb-2">
                                                    Thông tin chuyển khoản
                                                </h3>
                                                <p className="text-sm mb-1">
                                                    Ngân hàng: Vietcombank
                                                </p>
                                                <p className="text-sm mb-1">
                                                    Tên tài khoản: TrendVibe
                                                </p>
                                                <p className="text-sm mb-1">
                                                    Số tài khoản: 1234567890
                                                </p>
                                                <p className="text-sm mt-4">
                                                    Vui lòng ghi mã đơn hàng vào nội dung chuyển khoản.
                                                </p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <div className="lg:hidden">
                                {/* <CartSummary
                                    subtotal={items.subtotal}
                                    tax={items.tax}
                                    shipping={items.shipping}
                                    total={items.total}
                                    onCheckout={() => {}}
                                    isProcessing={false}
                                /> */}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Thanh toán ngay
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="hidden lg:block">
                    {/* <CartSummary
            subtotal={items.subtotal}
            tax={items.tax}
            shipping={items.shipping}
            total={items.total}
            onCheckout={() => {}}
            isProcessing={false}
          /> */}

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Sản phẩm ({items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="flex-1 truncate">
                                        {item.name}
                                        <span className="text-muted-foreground ml-1">
                                            x{item.quantity}
                                        </span>
                                    </span>
                                    <span>
                                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
