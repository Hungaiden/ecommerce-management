"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/service/admin/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Eye } from "lucide-react";
import { DeleteProductDialog } from "./delete-dialog";
import { formatCurrency } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&q=80";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  active: { label: "Đang bán", variant: "default" },
  inactive: { label: "Ẩn", variant: "secondary" },
  out_of_stock: { label: "Hết hàng", variant: "destructive" },
};

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onDeleted?: (id: string) => void;
}

export function ProductTable({
  products,
  loading,
  onDeleted,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-gray-500">
        Không có sản phẩm nào.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-14">Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Giá</TableHead>
              <TableHead className="text-right">Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-28 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status = statusMap[product.status ?? "active"];
              return (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-gray-100">
                      <Image
                        src={product.thumbnail || FALLBACK_IMAGE}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate font-medium text-gray-900">
                      {product.name}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {product.sku ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {product.category ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(product.price)}
                    {(product.discount ?? 0) > 0 && (
                      <span className="ml-1 text-xs text-rose-500">
                        -{product.discount}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    <span
                      className={
                        (product.stock ?? 0) === 0 ? "text-rose-500" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                        title="Xem chi tiết"
                      >
                        <Link href={`/shop/${product._id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                        title="Chỉnh sửa"
                      >
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <Pencil className="h-4 w-4 text-indigo-600" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Xóa"
                        onClick={() => setDeletingId(product._id)}
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

      <DeleteProductDialog
        open={!!deletingId}
        productId={deletingId}
        onClose={() => setDeletingId(null)}
        onDeleted={(id: string) => {
          setDeletingId(null);
          onDeleted?.(id);
        }}
      />
    </>
  );
}
