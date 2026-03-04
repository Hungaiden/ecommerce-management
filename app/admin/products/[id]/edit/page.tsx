"use client";

import { use, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/header";
import { ProductForm } from "@/components/admin/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { adminGetProduct, type Product } from "@/service/admin/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await adminGetProduct(id);
        setProduct(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Chỉnh sửa sản phẩm"
        description={product?.name ?? "Đang tải..."}
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/admin/products" className="hover:text-gray-900">
            Sản phẩm
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate max-w-[200px] text-gray-900">
            {loading ? "Đang tải..." : (product?.name ?? "Không tìm thấy")}
          </span>
        </nav>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        {!loading && product && (
          <ProductForm mode="edit" initialData={product} />
        )}
      </div>
    </div>
  );
}
