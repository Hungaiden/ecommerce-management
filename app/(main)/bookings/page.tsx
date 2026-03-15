"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  getMyOrders,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from "@/service/orders";
import { AlertCircle, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type FilterStatus = "all" | OrderStatus;

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "COD",
  bank_transfer: "Chuyển khoản",
  vnpay: "VNPay",
  momo: "MoMo",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("vi-VN");
};

const statusClassName = (status: OrderStatus) => {
  if (status === "delivered") return "border-emerald-200 text-emerald-700";
  if (status === "shipping") return "border-sky-200 text-sky-700";
  if (status === "confirmed") return "border-indigo-200 text-indigo-700";
  if (status === "cancelled") return "border-rose-200 text-rose-700";
  return "border-amber-200 text-amber-700";
};

const paymentStatusClassName = (status: PaymentStatus) => {
  if (status === "paid") return "border-emerald-200 text-emerald-700";
  if (status === "refunded") return "border-violet-200 text-violet-700";
  if (status === "failed") return "border-rose-200 text-rose-700";
  return "border-slate-200 text-slate-700";
};

export default function BookingsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMyOrders(user.userId, {
          offset: 0,
          limit: 50,
          sortBy: "createdAt",
          sortType: "desc",
        });
        if (!cancelled) {
          setOrders(data.hits || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Không thể tải đơn hàng.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  const statusCount: Record<FilterStatus, number> = {
    all: orders.length,
    pending: orders.filter((item) => item.status === "pending").length,
    confirmed: orders.filter((item) => item.status === "confirmed").length,
    shipping: orders.filter((item) => item.status === "shipping").length,
    delivered: orders.filter((item) => item.status === "delivered").length,
    cancelled: orders.filter((item) => item.status === "cancelled").length,
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((item) => item.status === filter);

  if (!user) {
    return (
      <main className="container py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Đơn hàng của tôi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bạn cần đăng nhập để xem danh sách đơn hàng của mình.
            </p>
            <Button asChild>
              <Link href="/login">Đăng nhập ngay</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container py-12">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-7 w-56 rounded bg-muted animate-pulse" />
          <div className="h-24 w-full rounded bg-muted animate-pulse" />
          <div className="h-32 w-full rounded bg-muted animate-pulse" />
          <div className="h-32 w-full rounded bg-muted animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi trạng thái và thông tin thanh toán cho các đơn hàng đã đặt.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Tất cả ({statusCount.all})
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Chờ xác nhận ({statusCount.pending})
              </Button>
              <Button
                variant={filter === "confirmed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("confirmed")}
              >
                Đã xác nhận ({statusCount.confirmed})
              </Button>
              <Button
                variant={filter === "shipping" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("shipping")}
              >
                Đang giao ({statusCount.shipping})
              </Button>
              <Button
                variant={filter === "delivered" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("delivered")}
              >
                Đã giao ({statusCount.delivered})
              </Button>
              <Button
                variant={filter === "cancelled" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("cancelled")}
              >
                Đã huỷ ({statusCount.cancelled})
              </Button>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Card className="border-rose-200">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </CardContent>
          </Card>
        ) : null}

        {!error && filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-3">
              <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="font-medium">
                Bạn chưa có đơn hàng nào trong mục này.
              </p>
              <p className="text-sm text-muted-foreground">
                Hãy khám phá thêm sản phẩm mới và đặt đơn đầu tiên của bạn.
              </p>
              <Button asChild>
                <Link href="/shop">Tiếp tục mua sắm</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {filteredOrders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Đơn hàng #
                    {(order.order_code || order._id).slice(-8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Đặt lúc: {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={statusClassName(order.status)}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={paymentStatusClassName(order.payment_status)}
                  >
                    {PAYMENT_STATUS_LABELS[order.payment_status] ||
                      order.payment_status}
                  </Badge>
                  <Badge variant="secondary">
                    {PAYMENT_METHOD_LABELS[order.payment_method] ||
                      order.payment_method}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={`${item.product_id}-${idx}`}
                    className="flex items-center gap-3 rounded-md border p-3"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[item.size ? `Size ${item.size}` : "", item.color]
                          .filter(Boolean)
                          .join(" / ") || "Phân loại mặc định"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      x{item.quantity}
                    </p>
                    <p className="text-sm font-medium whitespace-nowrap">
                      {formatCurrency(
                        item.subtotal || item.price * item.quantity,
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 rounded-md bg-muted/50 p-3 text-sm md:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Người nhận:</span>{" "}
                  {order.contact_info?.name || "--"}
                </p>
                <p>
                  <span className="text-muted-foreground">Số điện thoại:</span>{" "}
                  {order.contact_info?.phone || "--"}
                </p>
                <p className="md:col-span-2">
                  <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                  {order.contact_info?.address || "--"}
                </p>
                {order.note ? (
                  <p className="md:col-span-2">
                    <span className="text-muted-foreground">Ghi chú:</span>{" "}
                    {order.note}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end text-base font-semibold">
                <span>
                  Tổng thanh toán: {formatCurrency(order.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
