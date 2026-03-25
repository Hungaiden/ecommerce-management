'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
import { Search, Eye, Trash2, ShoppingCart, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  adminGetAllCarts,
  adminClearUserCart,
  adminRemoveCartItem,
  type AdminCart,
  type CartItem,
} from '@/service/admin/cart';

const PAGE_SIZE = 10;
const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=40';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&q=80';

function calcCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const product = item.product_id;
    if (!product || typeof product !== 'object') return sum;
    const price = product.price ?? 0;
    const discount = product.discount ?? 0;
    const finalPrice = price * (1 - discount / 100);
    return sum + finalPrice * item.quantity;
  }, 0);
}

function calcTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function formatCartUpdatedAt(rawDate?: string) {
  if (!rawDate) return '—';
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('vi-VN');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function normalizeCartUser(userId: AdminCart['user_id']) {
  if (userId && typeof userId === 'object') {
    return {
      id: userId._id || '',
      fullName: userId.fullName || 'Người dùng',
      email: userId.email || '—',
      avatar: userId.avatar,
      populated: true,
    };
  }

  if (typeof userId === 'string' && userId.trim()) {
    return {
      id: userId,
      fullName: 'Người dùng đã xoá',
      email: userId,
      avatar: undefined,
      populated: false,
    };
  }

  return {
    id: '',
    fullName: 'Cart lỗi: thiếu user_id',
    email: '—',
    avatar: undefined,
    populated: false,
  };
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Detail dialog
  const [selectedCart, setSelectedCart] = useState<AdminCart | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Clear confirm
  const [clearingUserId, setClearingUserId] = useState<string | null>(null);
  const [clearingName, setClearingName] = useState('');

  // Remove item confirm
  const [removingItem, setRemovingItem] = useState<{
    userId: string;
    itemId: string;
    name: string;
  } | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminGetAllCarts({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        keyword: keyword || undefined,
      });
      setCarts(result?.hits ?? []);
      setTotalRows(result?.pagination?.totalRows ?? 0);
    } catch {
      toast.error('Lỗi khi tải danh sách giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
    setPage(1);
  };

  const handleClearCart = async () => {
    if (!clearingUserId) return;
    try {
      await adminClearUserCart(clearingUserId);
      toast.success('Đã xoá toàn bộ giỏ hàng');
      setCarts((prev) =>
        prev.map((c) => {
          const uid =
            c.user_id && typeof c.user_id === 'object' ? c.user_id._id : String(c.user_id);
          return uid === clearingUserId ? { ...c, items: [] } : c;
        }),
      );
      // Cập nhật detail nếu đang mở
      if (selectedCart) {
        const uid =
          selectedCart.user_id && typeof selectedCart.user_id === 'object'
            ? selectedCart.user_id._id
            : String(selectedCart.user_id);
        if (uid === clearingUserId) {
          setSelectedCart({ ...selectedCart, items: [] });
        }
      }
    } catch {
      toast.error('Xoá giỏ hàng thất bại');
    } finally {
      setClearingUserId(null);
    }
  };

  const handleRemoveItem = async () => {
    if (!removingItem) return;
    try {
      const updated = await adminRemoveCartItem(removingItem.userId, removingItem.itemId);
      toast.success('Đã xoá sản phẩm khỏi giỏ hàng');
      // Cập nhật list
      setCarts((prev) =>
        prev.map((c) => {
          const uid =
            c.user_id && typeof c.user_id === 'object' ? c.user_id._id : String(c.user_id);
          return uid === removingItem.userId ? { ...c, items: updated.items } : c;
        }),
      );
      // Cập nhật detail dialog nếu đang mở
      if (selectedCart) {
        const uid =
          selectedCart.user_id && typeof selectedCart.user_id === 'object'
            ? selectedCart.user_id._id
            : String(selectedCart.user_id);
        if (uid === removingItem.userId) {
          setSelectedCart({ ...selectedCart, items: updated.items });
        }
      }
    } catch {
      toast.error('Xoá sản phẩm thất bại');
    } finally {
      setRemovingItem(null);
    }
  };

  const openDetail = (cart: AdminCart) => {
    setSelectedCart(cart);
    setDetailOpen(true);
  };

  return (
    <div className="flex flex-col">
      <AdminHeader title="Quản lý giỏ hàng" description={`${totalRows} giỏ hàng`} />

      <div className="flex-1 space-y-4 p-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            Tìm
          </Button>
          {keyword && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setKeyword('');
                setSearchInput('');
                setPage(1);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : carts.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-gray-500">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Không có giỏ hàng nào.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead className="text-center">Số sản phẩm</TableHead>
                  <TableHead className="text-right">Tổng giá trị</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                  <TableHead className="w-28 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts.map((cart) => {
                  const user = normalizeCartUser(cart.user_id);
                  const total = calcCartTotal(cart.items);
                  const totalQty = calcTotalQuantity(cart.items);
                  const userId = user.id;

                  return (
                    <TableRow key={cart._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <div className="relative h-9 w-9 overflow-hidden rounded-full border">
                              <Image
                                src={user.avatar}
                                alt={user.fullName}
                                fill
                                className="object-cover"
                                unoptimized
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                              {getInitials(user.fullName)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={totalQty === 0 ? 'secondary' : 'default'}>
                          {totalQty} sản phẩm
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {total > 0 ? formatCurrency(total) : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatCartUpdatedAt(cart.updatedAt || cart.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Xem chi tiết"
                            onClick={() => openDetail(cart)}
                          >
                            <Eye className="h-4 w-4 text-indigo-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Xoá giỏ hàng"
                            disabled={cart.items.length === 0 || !userId}
                            onClick={() => {
                              setClearingUserId(userId);
                              setClearingName(user.fullName);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalRows > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {Math.min((page - 1) * PAGE_SIZE + 1, totalRows)}–
              {Math.min(page * PAGE_SIZE, totalRows)} trong {totalRows} giỏ hàng
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={page === 1}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                      acc.push('ellipsis');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={page === item}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(item as number);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* ── Detail Dialog ── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-indigo-600" />
              Chi tiết giỏ hàng
              {selectedCart && (
                <span className="text-sm font-normal text-gray-500">
                  — {normalizeCartUser(selectedCart.user_id).fullName} (
                  {calcTotalQuantity(selectedCart.items)} sản phẩm)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {!selectedCart || selectedCart.items.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500">
              Giỏ hàng trống
            </div>
          ) : (
            <div className="space-y-3">
              {selectedCart.items.map((item) => {
                const product =
                  item.product_id && typeof item.product_id === 'object' ? item.product_id : null;
                const finalPrice = product
                  ? product.price * (1 - (product.discount ?? 0) / 100)
                  : 0;
                const userId =
                  selectedCart.user_id && typeof selectedCart.user_id === 'object'
                    ? selectedCart.user_id._id
                    : String(selectedCart.user_id);

                return (
                  <div key={item._id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                      <Image
                        src={product?.thumbnail || FALLBACK_IMAGE}
                        alt={product?.name ?? 'Sản phẩm'}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product?.name ?? 'Sản phẩm không tồn tại'}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.size && (
                          <Badge variant="outline" className="text-xs">
                            Size: {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="outline" className="text-xs">
                            Màu: {item.color}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatCurrency(finalPrice)} × {item.quantity} ={' '}
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(finalPrice * item.quantity)}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      title="Xoá sản phẩm"
                      onClick={() =>
                        setRemovingItem({
                          userId,
                          itemId: item._id,
                          name: product?.name ?? 'sản phẩm',
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                );
              })}

              {/* Tổng cộng */}
              <div className="flex justify-end border-t pt-3">
                <p className="text-sm">
                  Tổng cộng:{' '}
                  <span className="text-base font-bold text-indigo-600">
                    {formatCurrency(calcCartTotal(selectedCart.items))}
                  </span>
                </p>
              </div>

              {/* Clear button */}
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const userId =
                      selectedCart.user_id && typeof selectedCart.user_id === 'object'
                        ? selectedCart.user_id._id
                        : String(selectedCart.user_id);
                    const name =
                      selectedCart.user_id && typeof selectedCart.user_id === 'object'
                        ? selectedCart.user_id.fullName
                        : userId;
                    setClearingUserId(userId);
                    setClearingName(name);
                  }}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Xoá toàn bộ giỏ hàng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Clear Cart Confirm ── */}
      <AlertDialog
        open={!!clearingUserId}
        onOpenChange={(open) => !open && setClearingUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá toàn bộ giỏ hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xoá toàn bộ giỏ hàng của <strong>{clearingName}</strong>? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={handleClearCart}>
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Remove Item Confirm ── */}
      <AlertDialog open={!!removingItem} onOpenChange={(open) => !open && setRemovingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xoá <strong>{removingItem?.name}</strong> khỏi giỏ hàng?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={handleRemoveItem}>
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
