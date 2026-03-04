"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Grid, List } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts, type Product } from "@/service/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80";

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>(
    {},
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(8);
  const [sortBy, setSortBy] = useState("default");

  const getSortParams = (value: string) => {
    switch (value) {
      case "price-low":
        return { sortBy: "price", sortType: "asc" as const };
      case "price-high":
        return { sortBy: "price", sortType: "desc" as const };
      case "latest":
        return { sortBy: "createdAt", sortType: "desc" as const };
      case "rating":
        return { sortBy: "rating", sortType: "desc" as const };
      default:
        return {};
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const sort = getSortParams(sortBy);
        const result = await getProducts({
          offset: 0,
          limit,
          status: "active",
          ...sort,
        });
        setProducts((result?.hits as Product[]) ?? []);
        setTotalRows(result?.pagination?.totalRows ?? 0);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit, sortBy]);

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSize((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Sắp xếp mặc định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Sắp xếp mặc định</SelectItem>
                  <SelectItem value="rating">Sắp xếp theo đánh giá</SelectItem>
                  <SelectItem value="latest">Sắp xếp theo mới nhất</SelectItem>
                  <SelectItem value="price-low">Giá: thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá: cao đến thấp</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-1 ml-4">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-9 w-9"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-9 w-9"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Hiển thị {products.length} / {totalRows} sản phẩm
              </span>
              <Select
                value={String(limit)}
                onValueChange={(val) => setLimit(Number(val))}
              >
                <SelectTrigger className="w-[80px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-[400px] mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-2 mx-auto w-1/2" />
                <div className="h-4 bg-gray-200 rounded mx-auto w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Không có sản phẩm nào.</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-6"
            }
          >
            {products.map((product, index) => {
              const thumbnail =
                product.thumbnail || product.images?.[0] || FALLBACK_IMAGE;
              const discountedPrice =
                product.discount && product.discount > 0
                  ? product.price * (1 - product.discount / 100)
                  : null;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? (
                    <div className="group cursor-pointer">
                      <Link href={`/shop/${product._id}`}>
                        <div className="relative h-[400px] overflow-hidden bg-gray-100 mb-4">
                          <Image
                            src={thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.discount && product.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1">
                              -{product.discount}%
                            </span>
                          )}
                          {product.status === "out_of_stock" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm tracking-widest">
                                HẾT HÀNG
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-2 mb-3 justify-center flex-wrap">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() =>
                                handleSizeSelect(product._id, size)
                              }
                              className={`w-8 h-8 border text-sm font-medium transition-colors ${
                                selectedSize[product._id] === size
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 hover:border-gray-900"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="font-medium text-base mb-1 group-hover:text-gray-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-sm text-gray-500 mb-1">
                            {product.brand}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mb-3">
                          {discountedPrice ? (
                            <>
                              <span className="font-semibold text-lg text-red-600">
                                {discountedPrice.toLocaleString("vi-VN")}₫
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {product.price.toLocaleString("vi-VN")}₫
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-lg">
                              {product.price.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
                          size="lg"
                          disabled={product.status === "out_of_stock"}
                        >
                          THÊM VÀO GIỎ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-6 group border-b pb-6">
                      <Link href={`/shop/${product._id}`} className="shrink-0">
                        <div className="relative w-[160px] h-[200px] overflow-hidden bg-gray-100">
                          <Image
                            src={thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col justify-center gap-2">
                        <Link href={`/shop/${product._id}`}>
                          <h3 className="font-medium text-lg hover:text-gray-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.brand && (
                          <p className="text-sm text-gray-500">
                            {product.brand}
                          </p>
                        )}
                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          {discountedPrice ? (
                            <>
                              <span className="font-semibold text-lg text-red-600">
                                {discountedPrice.toLocaleString("vi-VN")}₫
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {product.price.toLocaleString("vi-VN")}₫
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-lg">
                              {product.price.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-fit bg-gray-900 hover:bg-gray-800 text-white"
                          disabled={product.status === "out_of_stock"}
                        >
                          THÊM VÀO GIỎ
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
