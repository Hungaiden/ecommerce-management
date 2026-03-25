'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/components/admin/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { CheckCircle2, MessageCircle, Pencil, Search, Star, Trash2 } from 'lucide-react';
import {
  adminApproveProductReview,
  adminDeleteProductReview,
  adminGetProductReviews,
  adminUpdateProductReview,
  type ProductReview,
} from '@/service/admin/reviews';

const PAGE_SIZE = 10;

const renderStars = (rating: number) => {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Đánh giá ${rounded} sao`}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star
          key={idx}
          className={`h-4 w-4 ${idx < rounded ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const getProductName = (review: ProductReview) => {
  if (typeof review.product_id === 'string') return review.product_id;
  return review.product_id?.name || review.product_id?._id || 'Không rõ sản phẩm';
};

const getProductSku = (review: ProductReview) => {
  if (typeof review.product_id === 'string') return '';
  return review.product_id?.sku || '';
};

const getReviewerName = (review: ProductReview) => {
  const user = review.user_id as any;

  if (!user) return 'Ẩn danh';
  if (typeof user === 'string') return user;

  const displayName =
    user.fullName || user.full_name || user.fullname || user.name || user.username;

  if (typeof displayName === 'string' && displayName.trim()) {
    return displayName.trim();
  }

  if (typeof user.email === 'string' && user.email.trim()) {
    return user.email.trim();
  }

  if (typeof user._id === 'string' && user._id.trim()) {
    return user._id;
  }

  if (typeof user._id?.toString === 'function') {
    const idAsString = user._id.toString();
    if (idAsString) return idAsString;
  }

  return 'Ẩn danh';
};

const toDatetime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductReview | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductReview | null>(null);
  const [editRating, setEditRating] = useState('5');
  const [editComment, setEditComment] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetProductReviews({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        keyword: keyword || undefined,
        field: keyword ? 'comment' : undefined,
        sortBy: 'created_at',
        sortType: 'desc',
      });
      setReviews(data.hits ?? []);
      setTotalRows(data.pagination?.totalRows ?? 0);
    } catch {
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const pageSummary = useMemo(() => {
    const start = Math.min((page - 1) * PAGE_SIZE + 1, totalRows);
    const end = Math.min(page * PAGE_SIZE, totalRows);
    return totalRows > 0 ? `${start}-${end} / ${totalRows}` : '0';
  }, [page, totalRows]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setKeyword(keywordInput.trim());
  };

  const handleApprove = async (review: ProductReview) => {
    setProcessingId(review._id);
    try {
      await adminApproveProductReview(review._id);
      setReviews((prev) =>
        prev.map((item) => (item._id === review._id ? { ...item, is_approved: true } : item)),
      );
      toast.success('Đã duyệt đánh giá');
    } catch {
      toast.error('Duyệt đánh giá thất bại');
    } finally {
      setProcessingId(null);
    }
  };

  const openEdit = (review: ProductReview) => {
    setEditTarget(review);
    setEditRating(String(Math.round(review.rating)));
    setEditComment(review.comment || '');
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    const ratingNumber = Number(editRating);

    if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      toast.error('Điểm đánh giá phải trong khoảng 1-5');
      return;
    }

    setProcessingId(editTarget._id);
    try {
      const updated = await adminUpdateProductReview(editTarget._id, {
        rating: ratingNumber,
        comment: editComment.trim(),
      });
      setReviews((prev) =>
        prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)),
      );
      setEditOpen(false);
      setEditTarget(null);
      toast.success('Cập nhật đánh giá thành công');
    } catch {
      toast.error('Cập nhật đánh giá thất bại');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminDeleteProductReview(deleteTarget._id);
      setReviews((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setTotalRows((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
      toast.success('Đã xoá đánh giá');
    } catch {
      toast.error('Xoá đánh giá thất bại');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader title="Quản lý đánh giá sản phẩm" description={`${totalRows} đánh giá`} />

      <div className="flex-1 space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </h2>
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="pl-9"
              placeholder="Tìm trong nội dung đánh giá"
            />
          </form>
        </div>

        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Người đánh giá</TableHead>
                <TableHead className="w-28">Điểm</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead className="w-36">Trạng thái</TableHead>
                <TableHead className="w-36">Thời gian</TableHead>
                <TableHead className="w-36 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 8 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <MessageCircle className="h-10 w-10" />
                      <p className="text-sm">Chưa có đánh giá nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review, idx) => (
                  <TableRow key={review._id} className="hover:bg-gray-50">
                    <TableCell className="text-xs text-gray-400">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[220px]">
                        <p className="line-clamp-1 font-medium text-gray-900">
                          {getProductName(review)}
                        </p>
                        {getProductSku(review) && (
                          <p className="text-xs text-gray-500">SKU: {getProductSku(review)}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {getReviewerName(review)}
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>
                      <p className="max-w-[280px] line-clamp-2 text-sm text-gray-600">
                        {review.comment?.trim() || '(Không có nội dung)'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.is_approved ? 'default' : 'secondary'}
                        className={
                          review.is_approved
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        }
                      >
                        {review.is_approved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {toDatetime(review.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {!review.is_approved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                            onClick={() => handleApprove(review)}
                            disabled={processingId === review._id}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                          onClick={() => openEdit(review)}
                          disabled={processingId === review._id}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => setDeleteTarget(review)}
                          disabled={processingId === review._id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalRows > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Hiển thị {pageSummary} đánh giá</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((prev) => Math.max(1, prev - 1));
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (current) =>
                      current === 1 || current === totalPages || Math.abs(current - page) <= 1,
                  )
                  .reduce<(number | 'ellipsis')[]>((acc, current, idx, arr) => {
                    if (idx > 0 && current - arr[idx - 1] > 1) {
                      acc.push('ellipsis');
                    }
                    acc.push(current);
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
                      setPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm text-gray-600">Điểm đánh giá (1-5)</p>
              <Input
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
                type="number"
                min={1}
                max={5}
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-gray-600">Nội dung</p>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Nội dung đánh giá"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Huỷ
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!editTarget || processingId === editTarget?._id}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ ẩn đánh giá khỏi hệ thống hiển thị của khách hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xóa đánh giá'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
