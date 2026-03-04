"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductFilters, type Filters } from "@/components/admin/products/product-filters";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { adminGetProducts, type Product } from "@/service/admin/products";
import { useEffect } from "react";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminGetProducts({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        ...filters,
      });
      setProducts((result?.hits as Product[]) ?? []);
      setTotalRows(result?.pagination?.totalRows ?? 0);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleDeleted = (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setTotalRows((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý sản phẩm"
        description={`${totalRows} sản phẩm`}
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </h2>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/admin/products/create">
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm sản phẩm
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters onChange={handleFiltersChange} />

        {/* Table */}
        <ProductTable
          products={products}
          loading={loading}
          onDeleted={handleDeleted}
        />

        {/* Pagination */}
        {totalPages > 1 && (
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
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
