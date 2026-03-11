"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CreateCategoryPayload,
} from "@/service/admin/categories";

const PAGE_SIZE = 10;

const emptyForm: CreateCategoryPayload = {
  title: "",
  description: "",
  status: "active",
  position: 1,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateCategoryPayload>(emptyForm);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState<CreateCategoryPayload>(emptyForm);
  const [editLoading, setEditLoading] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCategories({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setCategories(result?.hits ?? []);
      setTotalRows(result?.pagination?.totalRows ?? 0);
    } catch {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!createForm.title.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    setCreateLoading(true);
    try {
      const created = await createCategory(createForm);
      setCategories((prev) => [created, ...prev]);
      setTotalRows((prev) => prev + 1);
      setCreateOpen(false);
      setCreateForm(emptyForm);
      toast.success("Tạo danh mục thành công");
    } catch {
      toast.error("Tạo danh mục thất bại");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setEditForm({
      title: cat.title,
      description: cat.description ?? "",
      status: cat.status,
      position: cat.position,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    if (!editForm.title.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    setEditLoading(true);
    try {
      const updated = await updateCategory(editTarget._id, editForm);
      setCategories((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
      setEditOpen(false);
      toast.success("Cập nhật danh mục thành công");
    } catch {
      toast.error("Cập nhật danh mục thất bại");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const openDelete = (cat: Category) => {
    setDeleteTarget(cat);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget._id);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setTotalRows((prev) => Math.max(0, prev - 1));
      setDeleteOpen(false);
      toast.success("Xóa danh mục thành công");
    } catch {
      toast.error("Xóa danh mục thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý danh mục"
        description={`${totalRows} danh mục`}
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </h2>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              setCreateForm(emptyForm);
              setCreateOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-28">Trạng thái</TableHead>
                <TableHead className="w-24 text-center">Vị trí</TableHead>
                <TableHead className="w-28 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Tags className="h-10 w-10" />
                      <p className="text-sm">Chưa có danh mục nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat, idx) => (
                  <TableRow key={cat._id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-400 text-xs">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{cat.title}</TableCell>
                    <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cat.status === "active" ? "default" : "secondary"
                        }
                        className={
                          cat.status === "active"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {cat.status === "active" ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {cat.position}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                          onClick={() => openEdit(cat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => openDelete(cat)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* ── Create Dialog ──────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="create-title">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="VD: Áo thun"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-desc">Mô tả</Label>
              <Textarea
                id="create-desc"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Mô tả ngắn về danh mục..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={createForm.status}
                  onValueChange={(v) =>
                    setCreateForm((f) => ({
                      ...f,
                      status: v as "active" | "inactive",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hiển thị</SelectItem>
                    <SelectItem value="inactive">Ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-pos">Vị trí</Label>
                <Input
                  id="create-pos"
                  type="number"
                  min={1}
                  value={createForm.position}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      position: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleCreate}
              disabled={createLoading}
            >
              {createLoading ? "Đang tạo..." : "Tạo danh mục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Mô tả</Label>
              <Textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) =>
                    setEditForm((f) => ({
                      ...f,
                      status: v as "active" | "inactive",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hiển thị</SelectItem>
                    <SelectItem value="inactive">Ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pos">Vị trí</Label>
                <Input
                  id="edit-pos"
                  type="number"
                  min={1}
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      position: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleEdit}
              disabled={editLoading}
            >
              {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ─────────────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa danh mục{" "}
              <strong>&quot;{deleteTarget?.title}&quot;</strong>? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
