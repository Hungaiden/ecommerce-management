"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { GetProductsParams } from "@/service/admin/products";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";

export type Filters = Pick<
  GetProductsParams,
  "keyword" | "status" | "category" | "sortBy" | "sortType"
>;

interface ProductFiltersProps {
  onChange: (filters: Filters) => void;
}

const CATEGORIES = [
  "Pullovers",
  "Shirts",
  "Pants",
  "T-Shirts",
  "Shoes",
  "Accessories",
  "Jackets",
];

export function ProductFilters({ onChange }: ProductFiltersProps) {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState<"asc" | "desc">("desc");

  const debouncedKeyword = useDebounce(keyword, 400);

  const emitChange = useCallback(
    (overrides: Partial<Filters> = {}) => {
      onChange({
        keyword: debouncedKeyword || undefined,
        status: status === "all" ? undefined : status,
        category: category === "all" ? undefined : category,
        sortBy: sortBy || undefined,
        sortType: sortType,
        ...overrides,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedKeyword, status, category, sortBy, sortType],
  );

  useEffect(() => {
    emitChange();
  }, [emitChange]);

  const handleReset = () => {
    setKeyword("");
    setStatus("all");
    setCategory("all");
    setSortBy("createdAt");
    setSortType("desc");
  };

  const isDirty =
    keyword !== "" ||
    status !== "all" ||
    category !== "all" ||
    sortBy !== "createdAt" ||
    sortType !== "desc";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border bg-gray-50 p-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm tên, mô tả, thương hiệu..."
          className="pl-8 bg-white"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Status */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-36 bg-white">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Đang bán</SelectItem>
          <SelectItem value="inactive">Ẩn</SelectItem>
          <SelectItem value="out_of_stock">Hết hàng</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-36 bg-white">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${sortBy}-${sortType}`}
        onValueChange={(v) => {
          const [field, type] = v.split("-");
          setSortBy(field);
          setSortType(type as "asc" | "desc");
        }}
      >
        <SelectTrigger className="w-44 bg-white">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
          <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
          <SelectItem value="price-asc">Giá tăng dần</SelectItem>
          <SelectItem value="price-desc">Giá giảm dần</SelectItem>
          <SelectItem value="stock-asc">Tồn kho thấp nhất</SelectItem>
          <SelectItem value="sold-desc">Bán chạy nhất</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-1 text-gray-500"
        >
          <X className="h-3.5 w-3.5" />
          Xóa lọc
        </Button>
      )}
    </div>
  );
}
