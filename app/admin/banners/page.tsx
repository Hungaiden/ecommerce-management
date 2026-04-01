'use client';

import { useState, useEffect } from 'react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import http from '@/service/http';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  type Banner,
} from '@/service/admin/banners';

interface FormDataState extends Partial<Banner> {
  imageFile?: File | null;
  imagePreview?: string;
  imageUrl?: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataState>({
    imageFile: null,
    imagePreview: '',
    title: '',
    subtitle: '',
    link: '',
    order: 1,
    isActive: true,
  });

  const PAGE_SIZE = 10;

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const isActive = filterStatus === 'all' ? undefined : filterStatus === 'active';
      const result = await getAllBanners(isActive, (page - 1) * PAGE_SIZE, PAGE_SIZE);
      // Filter by search keyword client-side
      const filtered = result.data.hits.filter((banner) =>
        (banner.title?.toLowerCase() || '').includes(searchKeyword.toLowerCase()),
      );
      setBanners(filtered);
      setTotalRows(filtered.length);
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách banner');
      console.error('Banner load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page, searchKeyword, filterStatus]);

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner._id || null);
      setFormData({
        imageFile: null,
        imagePreview: banner.imageUrl,
        imageUrl: banner.imageUrl,
        title: banner.title,
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        order: banner.order,
        isActive: banner.isActive,
        startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
        endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        imageFile: null,
        imagePreview: '',
        imageUrl: '',
        title: '',
        subtitle: '',
        link: '',
        order: 1,
        isActive: true,
        startDate: '',
        endDate: '',
      });
    }
    setIsCreating(true);
  };

  const handleCloseDialog = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      imageFile: null,
      imagePreview: '',
      imageUrl: '',
      title: '',
      subtitle: '',
      link: '',
      order: 1,
      isActive: true,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (formData.order === undefined) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // For new banner, imageUrl or imageFile is required
      if (!editingId && !formData.imageUrl && !formData.imageFile) {
        toast.error('Vui lòng chọn hình ảnh');
        return;
      }

      let imageUrl: string | undefined = formData.imageUrl;

      // If new file is selected, upload it first
      if (formData.imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('images', formData.imageFile);

          // Upload to /upload/multiple endpoint
          const uploadResponse = await http.post('/upload/multiple', uploadFormData);
          const uploadedUrls = uploadResponse.data?.data?.urls || [];

          if (!uploadedUrls.length) {
            toast.error('Lỗi khi upload ảnh');
            return;
          }

          imageUrl = uploadedUrls[0]; // Get first uploaded URL
        } catch (error: any) {
          toast.error('Lỗi khi upload ảnh: ' + (error.response?.data?.message || error.message));
          return;
        }
      }

      // Prepare JSON payload with imageUrl
      const payload: Partial<Banner> = {
        imageUrl,
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim(),
        link: formData.link?.trim(),
        order: formData.order,
        isActive: formData.isActive,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };

      if (editingId) {
        await updateBanner(editingId, payload);
        toast.success('Cập nhật banner thành công');
      } else {
        await createBanner(payload);
        toast.success('Tạo banner thành công');
      }

      handleCloseDialog();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu banner');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      toast.success('Xóa banner thành công');
      fetchBanners();
      setDeleteTargetId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa banner');
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Banner</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tạo và quản lý các banner hiển thị trên trang chủ
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-black hover:bg-gray-900">
              <Plus className="h-4 w-4" />
              Thêm Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Cập nhật banner' : 'Tạo banner mới'}</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho banner</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Hình ảnh {!editingId && '*'}
                </label>
                <div className="flex flex-col gap-3">
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {formData.imagePreview && (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tiêu đề</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Tiêu đề banner"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tiêu đề phụ</label>
                <Input
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Mô tả ngắn"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Liên kết</label>
                <Input
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Thứ tự hiển thị *</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                  <Select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onValueChange={(val) =>
                      setFormData({ ...formData, isActive: val === 'active' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tắt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ngày bắt đầu</label>
                  <Input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ngày kết thúc</label>
                  <Input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-black hover:bg-gray-900">
                {editingId ? 'Cập nhật' : 'Tạo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm tiêu đề banner..."
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
            <SelectItem value="inactive">Tắt</SelectItem>
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
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có banner nào</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hình ảnh</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Thứ tự</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ngày bắt đầu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ngày kết thúc</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {banners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-10 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{banner.title}</td>
                      <td className="px-6 py-4 text-sm text-center">{banner.order}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            banner.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {banner.isActive ? 'Hoạt động' : 'Tắt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {banner.startDate
                          ? new Date(banner.startDate).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {banner.endDate
                          ? new Date(banner.endDate).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(banner)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTargetId(banner._id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Delete Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm"
          >
            <h2 className="text-lg font-semibold mb-2">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa banner này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
                Hủy
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  handleDelete(deleteTargetId);
                }}
              >
                Xóa
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
