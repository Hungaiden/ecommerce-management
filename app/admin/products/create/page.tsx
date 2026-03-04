"use client";

import { AdminHeader } from "@/components/admin/header";
import { ProductForm } from "@/components/admin/products/product-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Thêm sản phẩm mới"
        description="Điền thông tin để tạo sản phẩm"
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/admin/products" className="hover:text-gray-900">
            Sản phẩm
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900">Thêm mới</span>
        </nav>

        <ProductForm mode="create" />
      </div>
    </div>
  );
}
