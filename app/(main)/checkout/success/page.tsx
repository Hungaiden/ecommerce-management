"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Package } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") ?? "";

  if (!orderId) {
    router.replace("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
      </div>

      <h1 className="mt-6 text-2xl font-bold">Đặt hàng thành công!</h1>
      <p className="mt-3 text-muted-foreground">
        Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm
        nhất có thể.
      </p>

      <div className="mt-4 inline-block rounded-lg bg-muted px-4 py-2 text-sm">
        Mã đơn hàng: <span className="font-mono font-semibold">{orderId}</span>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
        <Button asChild>
          <Link href="/bookings">
            <Package className="mr-2 h-4 w-4" />
            Xem đơn hàng của tôi
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
