"use client";

import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type PaymentStatus = "paid" | "failed" | "pending" | "unknown";

type PaymentStatusConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  paid: {
    title: "Thanh toan thanh cong",
    description: "Don hang cua ban da duoc ghi nhan thanh toan thanh cong.",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  failed: {
    title: "Thanh toan that bai",
    description:
      "Giao dich chua hoan tat. Ban co the thu thanh toan lai trong trang don hang.",
    icon: AlertTriangle,
    iconClassName: "bg-rose-50 text-rose-600",
  },
  pending: {
    title: "Thanh toan dang xu ly",
    description:
      "He thong dang doi xac nhan giao dich. Vui long kiem tra lai sau it phut.",
    icon: Clock3,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  unknown: {
    title: "Khong xac dinh duoc ket qua",
    description:
      "Chung toi chua nhan duoc trang thai thanh toan ro rang. Vui long kiem tra trong danh sach don hang.",
    icon: AlertTriangle,
    iconClassName: "bg-slate-100 text-slate-700",
  },
};

const normalizeStatus = (rawStatus: string | null): PaymentStatus => {
  if (!rawStatus) {
    return "unknown";
  }

  if (
    rawStatus === "paid" ||
    rawStatus === "failed" ||
    rawStatus === "pending"
  ) {
    return rawStatus;
  }

  return "unknown";
};

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = normalizeStatus(searchParams.get("status"));
  const orderId = searchParams.get("bookingId") || searchParams.get("orderId");
  const currentStatus = PAYMENT_STATUS_CONFIG[status];
  const StatusIcon = currentStatus.icon;

  return (
    <main className="container py-12">
      <Card className="mx-auto max-w-xl">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${currentStatus.iconClassName}`}
          >
            <StatusIcon className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">{currentStatus.title}</CardTitle>
          <CardDescription className="text-sm">
            {currentStatus.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderId ? (
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
              Ma don hang: <span className="font-semibold">{orderId}</span>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link href="/bookings">Xem don hang cua toi</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Ve trang chu</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
