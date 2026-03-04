"use client";

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
import { adminDeleteProduct } from "@/service/admin/products";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProductDialogProps {
  open: boolean;
  productId: string | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeleteProductDialog({
  open,
  productId,
  onClose,
  onDeleted,
}: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      await adminDeleteProduct(productId);
      toast.success("Xóa sản phẩm thành công!");
      onDeleted(productId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Xóa sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn
            khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
