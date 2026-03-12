"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Copy, Home, Package } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const BANK_NAME = "Vietcombank";
const BANK_ACCOUNT = "1234567890";
const BANK_ACCOUNT_NAME = "TRENDVIBE SHOP";

function BankTransferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") ?? "";
  const amount = Number(searchParams.get("amount") ?? 0);
  const transferContent = `ORDER ${orderId.toUpperCase()}`;

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã sao chép ${label}`);
    });
  };

  if (!orderId) {
    router.replace("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
          <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold">Thanh toán chuyển khoản</h1>
        <p className="text-muted-foreground mt-2">
          Đơn hàng đã được tạo. Vui lòng chuyển khoản theo thông tin bên dưới.
        </p>
        <Badge variant="secondary" className="mt-2">
          Mã đơn hàng: {orderId}
        </Badge>
      </div>

      {/* Bank info card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin tài khoản nhận</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Ngân hàng</span>
            <span className="font-semibold">{BANK_NAME}</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Số tài khoản</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-lg">
                {BANK_ACCOUNT}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => copyText(BANK_ACCOUNT, "số tài khoản")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Chủ tài khoản</span>
            <span className="font-semibold">{BANK_ACCOUNT_NAME}</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Số tiền</span>
            <span className="font-bold text-xl text-primary">
              {amount.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Nội dung chuyển khoản</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{transferContent}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  copyText(transferContent, "nội dung chuyển khoản")
                }
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
        <CardContent className="pt-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Lưu ý:</strong> Vui lòng nhập đúng nội dung chuyển khoản{" "}
            <strong>{transferContent}</strong> để chúng tôi xác nhận đơn hàng
            nhanh nhất. Đơn hàng sẽ được xử lý trong vòng{" "}
            <strong>24 giờ</strong> sau khi nhận được thanh toán.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
        <Button
          className="flex-1"
          onClick={() => router.push(`/checkout/success?orderId=${orderId}`)}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Tôi đã chuyển khoản
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href={`/bookings`}>
            <Package className="mr-1 h-3.5 w-3.5" />
            Xem đơn hàng của tôi
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function BankTransferPage() {
  return (
    <Suspense>
      <BankTransferContent />
    </Suspense>
  );
}
