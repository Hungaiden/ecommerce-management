'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search, Copy, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  adminGetDiscounts,
  adminCreateDiscount,
  adminUpdateDiscount,
  adminDeleteDiscount,
  type Discount,
} from '@/service/admin/discounts';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  const PAGE_SIZE = 10;

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const result = await adminGetDiscounts({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        keyword: searchKeyword || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      setDiscounts(result.hits);
      setTotalRows(result.pagination.totalRows);
    } catch (error) {
      console.error('Lỗi khi tải khuyến mãi:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [page, searchKeyword, filterStatus]);

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.code.trim()) {
        toast.error('Vui lòng nhập mã khuyến mãi');
        return;
      }
      if (formData.discountValue <= 0) {
        toast.error('Giá trị giảm phải lớn hơn 0');
        return;
      }
      if (!formData.validFrom || !formData.validUntil) {
        toast.error('Vui lòng chọn ngày bắt đầu và kết thúc');
        return;
      }
      if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
        toast.error('Ngày kết thúc phải sau ngày bắt đầu');
        return;
      }

      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minPurchaseAmount: Number(formData.minPurchaseAmount) || undefined,
        maxDiscountAmount:
          formData.discountType === 'percentage' && formData.maxDiscountAmount
            ? Number(formData.maxDiscountAmount)
            : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      };

      if (editingId) {
        await adminUpdateDiscount(editingId, payload);
        toast.success('Cập nhật khuyến mãi thành công');
      } else {
        await adminCreateDiscount(payload);
        toast.success('Tạo khuyến mãi thành công');
      }

      resetForm();
      fetchDiscounts();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(message);
    }
  };

  const handleEdit = (discount: Discount) => {
    setFormData({
      code: discount.code,
      description: discount.description || '',
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      minPurchaseAmount: discount.minPurchaseAmount || 0,
      maxDiscountAmount: discount.maxDiscountAmount || 0,
      usageLimit: discount.usageLimit || 0,
      validFrom: discount.validFrom.split('T')[0],
      validUntil: discount.validUntil.split('T')[0],
      isActive: discount.isActive,
    });
    setEditingId(discount._id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteDiscount(id);
      toast.success('Xóa khuyến mãi thành công');
      fetchDiscounts();
      setDeleteTargetId(null);
    } catch (error) {
      toast.error('Không thể xóa khuyến mãi');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      validFrom: '',
      validUntil: '',
      isActive: true,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoạt động' },
      inactive: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chưa kích hoạt' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Hết hạn' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã lưu trữ' },
    };
    const badge = badges[status] || badges.inactive;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {getStatusIcon(status)}
        {badge.label}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-sm text-gray-600 mt-1">Tạo và quản lý các mã giảm giá</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Tạo khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi mới'}</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho khuyến mãi</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mã khuyến mãi *</label>
                  <Input
                    placeholder="VD: SUMMER2024"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    disabled={!!editingId}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Loại giảm giá *</label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(val: any) => setFormData({ ...formData, discountType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Theo %</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Giá trị giảm *</label>
                  <Input
                    type="number"
                    placeholder={formData.discountType === 'percentage' ? 'Nhập %' : 'Nhập số tiền'}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    min={0}
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Giảm tối đa (nếu %)</label>
                  <Input
                    type="number"
                    placeholder="Giảm tối đa"
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })
                    }
                    disabled={formData.discountType !== 'percentage'}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  placeholder="Mô tả khuyến mãi"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ngày bắt đầu *</label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày kết thúc *</label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mua tối thiểu</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.minPurchaseAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Giới hạn lượt sử dụng</label>
                  <Input
                    type="number"
                    placeholder="Không giới hạn"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Kích hoạt ngay</label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Cập nhật' : 'Tạo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm mã hoặc mô tả..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setPage(1);
            }}
            className="border-0 outline-none"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(val) => {
            setFilterStatus(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Chưa kích hoạt</SelectItem>
            <SelectItem value="expired">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg border overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có khuyến mãi nào</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Mã</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Loại</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Giá trị</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hạn sử dụng</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Lượt sử dụng</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {discounts.map((discount) => (
                    <tr key={discount._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {discount.code}
                          </code>
                          <button
                            onClick={() => copyCode(discount.code)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {discount.discountType === 'percentage' ? 'Theo %' : 'Cố định'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {discount.discountValue}
                        {discount.discountType === 'percentage' ? '%' : '₫'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(discount.validFrom).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(discount.validUntil).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {discount.usageCount}
                        {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(discount.status)}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(discount)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Dialog open={deleteTargetId === discount._id}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTargetId(discount._id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                              <DialogDescription>
                                Bạn có chắc muốn xóa khuyến mãi "{discount.code}"? Thao tác này
                                không thể hoàn tác.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
                                Hủy
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(discount._id)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Hiển thị {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, totalRows)} trên{' '}
                {totalRows}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                    className={p === page ? 'bg-blue-600' : ''}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
