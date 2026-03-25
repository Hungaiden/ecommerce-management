'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { Search, Eye, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateOrder,
  adminDeleteOrder,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from '@/service/admin/orders';

const PAGE_SIZE = 10;

const ORDER_STATUS_MAP: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: { label: 'Chờ xử lý', variant: 'secondary' },
  confirmed: { label: 'Đã xác nhận', variant: 'default' },
  shipping: { label: 'Đang giao', variant: 'outline' },
  delivered: { label: 'Đã giao', variant: 'default' },
  cancelled: { label: 'Đã huỷ', variant: 'destructive' },
};

const PAYMENT_STATUS_MAP: Record<
  PaymentStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: { label: 'Chưa thanh toán', variant: 'secondary' },
  paid: { label: 'Đã thanh toán', variant: 'default' },
  failed: { label: 'Thất bại', variant: 'destructive' },
  refunded: { label: 'Hoàn tiền', variant: 'outline' },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
};

const formatOrderDate = (order: Order, withTime = false) => {
  const rawDate = order.createdAt || order.created_at;
  if (!rawDate) return '—';
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return '—';
  return withTime ? date.toLocaleString('vi-VN') : date.toLocaleDateString('vi-VN');
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminGetAllOrders({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        keyword: keyword || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        payment_status: paymentFilter !== 'all' ? paymentFilter : undefined,
        sortBy: 'created_at',
        sortType: 'desc',
      });
      setOrders(result.hits ?? []);
      setTotalRows(result.pagination?.totalRows ?? 0);
    } catch {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, statusFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const openDetail = async (id: string) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const order = await adminGetOrderById(id);
      setDetailOrder(order);
    } catch {
      toast.error('Không thể tải chi tiết đơn hàng');
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    field: 'status' | 'payment_status',
    value: string,
  ) => {
    setUpdating(id);
    try {
      await adminUpdateOrder(id, { [field]: value as any });
      toast.success('Cập nhật thành công');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, [field]: value } : o)));
      if (detailOrder?._id === id) {
        setDetailOrder((prev) => (prev ? { ...prev, [field]: value as any } : prev));
      }
    } catch {
      toast.error('Cập nhật thất bại');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteOrder(deleteId);
      toast.success('Đã xoá đơn hàng');
      setOrders((prev) => prev.filter((o) => o._id !== deleteId));
      setTotalRows((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error('Xoá thất bại');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader title="Quản lý đơn hàng" description={`${totalRows} đơn hàng`} />

      <div className="flex-1 space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, SĐT..."
              className="pl-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Trạng thái đơn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="shipping">Đang giao</SelectItem>
              <SelectItem value="delivered">Đã giao</SelectItem>
              <SelectItem value="cancelled">Đã huỷ</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(v) => {
              setPaymentFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thanh toán</SelectItem>
              <SelectItem value="pending">Chưa thanh toán</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
              <SelectItem value="refunded">Hoàn tiền</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái đơn</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, idx) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
                    label: order.status,
                    variant: 'secondary',
                  };
                  const payInfo = PAYMENT_STATUS_MAP[order.payment_status] ?? {
                    label: order.payment_status,
                    variant: 'secondary',
                  };
                  const customer =
                    order.contact_info?.name ||
                    (typeof order.user_id === 'object' ? order.user_id?.fullName : '') ||
                    '—';
                  return (
                    <TableRow key={order._id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-400 text-xs">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-800 truncate max-w-[140px]">
                          {customer}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-[140px]">
                          {order.contact_info?.phone}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-indigo-700">
                        {formatCurrency(order.total_price)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          disabled={updating === order._id}
                          onValueChange={(v) => handleUpdateStatus(order._id, 'status', v)}
                        >
                          <SelectTrigger className="h-7 w-36 text-xs">
                            <Badge variant={statusInfo.variant} className="text-xs">
                              {statusInfo.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ORDER_STATUS_MAP).map(([val, { label }]) => (
                              <SelectItem key={val} value={val} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status}
                          disabled={updating === order._id}
                          onValueChange={(v) => handleUpdateStatus(order._id, 'payment_status', v)}
                        >
                          <SelectTrigger className="h-7 w-40 text-xs">
                            <Badge variant={payInfo.variant} className="text-xs">
                              {payInfo.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PAYMENT_STATUS_MAP).map(([val, { label }]) => (
                              <SelectItem key={val} value={val} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {order.payment_method
                          ? (PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method)
                          : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-gray-400">
                        {formatOrderDate(order)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                            onClick={() => openDetail(order._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => setDeleteId(order._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : detailOrder ? (
            <div className="space-y-5 text-sm">
              {/* ID + trạng thái */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-400 text-xs font-mono">{detailOrder._id}</span>
                <Badge variant={ORDER_STATUS_MAP[detailOrder.status]?.variant ?? 'secondary'}>
                  {ORDER_STATUS_MAP[detailOrder.status]?.label ?? detailOrder.status}
                </Badge>
                <Badge
                  variant={PAYMENT_STATUS_MAP[detailOrder.payment_status]?.variant ?? 'secondary'}
                >
                  {PAYMENT_STATUS_MAP[detailOrder.payment_status]?.label ??
                    detailOrder.payment_status}
                </Badge>
              </div>

              {/* Thông tin khách */}
              <div className="rounded-lg border p-4 space-y-1">
                <p className="font-semibold text-gray-700 mb-2">Thông tin khách hàng</p>
                <div className="grid grid-cols-2 gap-1 text-gray-600">
                  <span className="text-gray-400">Họ tên:</span>
                  <span>{detailOrder.contact_info?.name}</span>
                  <span className="text-gray-400">SĐT:</span>
                  <span>{detailOrder.contact_info?.phone}</span>
                  <span className="text-gray-400">Email:</span>
                  <span>{detailOrder.contact_info?.email}</span>
                  <span className="text-gray-400">Địa chỉ:</span>
                  <span>{detailOrder.contact_info?.address}</span>
                  {detailOrder.note && (
                    <>
                      <span className="text-gray-400">Ghi chú:</span>
                      <span>{detailOrder.note}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Sản phẩm */}
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-700">
                  Sản phẩm ({detailOrder.items.length})
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-400 text-xs">
                      <th className="px-4 py-2 text-left font-normal">Tên</th>
                      <th className="px-4 py-2 text-center font-normal">Phân loại</th>
                      <th className="px-4 py-2 text-center font-normal">SL</th>
                      <th className="px-4 py-2 text-right font-normal">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailOrder.items.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-4 py-2 text-gray-800">{item.name}</td>
                        <td className="px-4 py-2 text-center text-gray-500 text-xs">
                          {[item.size, item.color].filter(Boolean).join(' / ') || '—'}
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-indigo-700 font-medium">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tổng */}
              <div className="flex justify-between items-center font-semibold text-base border-t pt-3">
                <span>Tổng cộng</span>
                <span className="text-indigo-700">{formatCurrency(detailOrder.total_price)}</span>
              </div>

              {/* Thanh toán */}
              <div className="text-gray-500 text-xs space-y-0.5">
                {detailOrder.payment_method && (
                  <p>
                    Phương thức:{' '}
                    {PAYMENT_METHOD_LABEL[detailOrder.payment_method] ?? detailOrder.payment_method}
                  </p>
                )}
                {detailOrder.transaction_code && (
                  <p>
                    Mã GD: <span className="font-mono">{detailOrder.transaction_code}</span>
                  </p>
                )}
                <p>Ngày đặt: {formatOrderDate(detailOrder, true)}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-400">Trạng thái đơn</p>
                  <Select
                    value={detailOrder.status}
                    disabled={updating === detailOrder._id}
                    onValueChange={(v) => handleUpdateStatus(detailOrder._id, 'status', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUS_MAP).map(([val, { label }]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-400">Trạng thái thanh toán</p>
                  <Select
                    value={detailOrder.payment_status}
                    disabled={updating === detailOrder._id}
                    onValueChange={(v) => handleUpdateStatus(detailOrder._id, 'payment_status', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_STATUS_MAP).map(([val, { label }]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá đơn hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đơn hàng sẽ bị xoá khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
