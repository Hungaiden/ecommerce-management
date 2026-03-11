"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Eye, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import {
  adminGetAllAccounts,
  adminUpdateAccount,
  adminDeleteAccount,
  type Account,
  type AccountRole,
  type AccountStatus,
} from "@/service/admin/accounts";

const PAGE_SIZE = 10;

const ROLE_MAP: Record<
  AccountRole,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  admin: { label: "Admin", variant: "default" },
  staff: { label: "Nhân viên", variant: "secondary" },
  customer: { label: "Khách hàng", variant: "outline" },
};

const STATUS_MAP: Record<
  AccountStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  active: { label: "Hoạt động", variant: "default" },
  inactive: { label: "Không hoạt động", variant: "secondary" },
  suspended: { label: "Bị khoá", variant: "destructive" },
};

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?background=6366f1&color=fff&size=40&name=";

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    phone: string;
    role_id: AccountRole;
    status: AccountStatus;
  } | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminGetAllAccounts({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        keyword: keyword || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: "createdAt",
        sortType: "desc",
      });
      setAccounts(result.hits ?? []);
      setTotalRows(result.pagination?.totalRows ?? 0);
    } catch {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, statusFilter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAccounts();
  };

  const openEdit = (acc: Account) => {
    setEditAccount(acc);
    setEditForm({
      fullName: acc.fullName,
      phone: acc.phone ?? "",
      role_id: acc.role_id,
      status: acc.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editAccount || !editForm) return;
    setEditSaving(true);
    try {
      const updated = await adminUpdateAccount(editAccount._id, editForm);
      toast.success("Cập nhật thành công");
      setAccounts((prev) =>
        prev.map((a) => (a._id === editAccount._id ? { ...a, ...updated } : a)),
      );
      setEditAccount(null);
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteAccount(deleteId);
      toast.success("Đã xoá tài khoản");
      setAccounts((prev) => prev.filter((a) => a._id !== deleteId));
      setTotalRows((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Xoá thất bại");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý tài khoản"
        description={`${totalRows} tài khoản`}
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="relative flex-1 min-w-[220px] max-w-sm"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email..."
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
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="suspended">Bị khoá</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Tài khoản</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : accounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-400"
                  >
                    Không có tài khoản nào
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((acc, idx) => {
                  const roleInfo = ROLE_MAP[acc.role_id] ?? {
                    label: acc.role_id,
                    variant: "secondary",
                  };
                  const statusInfo = STATUS_MAP[acc.status] ?? {
                    label: acc.status,
                    variant: "secondary",
                  };
                  const avatarSrc =
                    acc.avatar ||
                    `${FALLBACK_AVATAR}${encodeURIComponent(acc.fullName)}`;
                  return (
                    <TableRow key={acc._id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-400 text-xs">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={avatarSrc}
                              alt={acc.fullName}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  `${FALLBACK_AVATAR}${encodeURIComponent(acc.fullName)}`;
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {acc.fullName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {acc.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {acc.phone || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleInfo.variant}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-400">
                        {new Date(acc.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                            onClick={() => openEdit(acc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => setDeleteId(acc._id)}
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
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
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

      {/* Edit Dialog */}
      <Dialog
        open={!!editAccount}
        onOpenChange={(v) => !v && setEditAccount(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Họ và tên</Label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Số điện thoại</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="Nhập SĐT"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Vai trò</Label>
                <Select
                  value={editForm.role_id}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, role_id: v as AccountRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Trạng thái</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, status: v as AccountStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Bị khoá</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAccount(null)}>
              Huỷ
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={editSaving}
              onClick={handleSaveEdit}
            >
              {editSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài khoản sẽ bị xoá khỏi hệ
              thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
