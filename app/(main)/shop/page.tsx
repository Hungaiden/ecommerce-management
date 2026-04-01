'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, List, ChevronLeft, ChevronRight, Tag, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProducts, type Product } from '@/service/products';
import { getCategories, type Category } from '@/service/admin/categories';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80';

const PAGE_SIZE = 8;

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { addItem } = useCart();

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const getSortParams = (value: string) => {
    switch (value) {
      case 'price-low':
        return { sortBy: 'price', sortType: 'asc' as const };
      case 'price-high':
        return { sortBy: 'price', sortType: 'desc' as const };
      case 'latest':
        return { sortBy: 'createdAt', sortType: 'desc' as const };
      case 'rating':
        return { sortBy: 'rating', sortType: 'desc' as const };
      default:
        return {};
    }
  };

  // Load categories
  useEffect(() => {
    getCategories({ limit: 100 })
      .then((res) => setCategories(res?.hits?.filter((c) => c.status === 'active') ?? []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sort = getSortParams(sortBy);
      const trimmedKeyword = searchKeyword.trim();
      const result = await getProducts({
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        status: 'active',
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        keyword: trimmedKeyword || undefined,
        field: trimmedKeyword ? 'name' : undefined,
        ...sort,
      });
      setProducts((result?.hits as Product[]) ?? []);
      setTotalRows(result?.pagination?.totalRows ?? 0);
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, selectedCategory, searchKeyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setPage(1);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchKeyword(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    setPage(1);
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSize((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = async (product: Product) => {
    if (!product?._id || product.status === 'out_of_stock') return;

    const size = selectedSize[product._id] || product.sizes?.[0] || '';
    const color = product.colors?.[0] || '';

    setAddingProductId(product._id);
    try {
      await addItem({
        product_id: product._id,
        quantity: 1,
        size: size || undefined,
        color: color || undefined,
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setAddingProductId((current) => (current === product._id ? null : current));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  className="pl-9 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" variant="outline" className="bg-white">
                  Tìm kiếm
                </Button>
                {searchKeyword && (
                  <Button type="button" variant="ghost" onClick={clearSearch}>
                    Xóa lọc
                  </Button>
                )}
              </div>
            </form>

            {searchKeyword && (
              <p className="text-sm text-gray-500">
                Kết quả cho từ khóa: "
                <span className="font-medium text-gray-700">{searchKeyword}</span>"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[200px] bg-white">
                    <SelectValue placeholder="Sắp xếp mặc định" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sắp xếp mặc định</SelectItem>
                    <SelectItem value="rating">Theo đánh giá</SelectItem>
                    <SelectItem value="latest">Mới nhất</SelectItem>
                    <SelectItem value="price-low">Giá: thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá: cao đến thấp</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex gap-1 ml-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-9 w-9"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-9 w-9"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Count */}
              <span className="text-sm text-gray-500">
                {totalRows > 0
                  ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalRows)} / ${totalRows} sản phẩm`
                  : '0 sản phẩm'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: sidebar + products */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar Categories ── */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-700" />
                <h2 className="font-semibold text-gray-900 uppercase tracking-wide text-sm">
                  Danh mục
                </h2>
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                      selectedCategory === 'all'
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    )}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => handleCategoryChange(cat._id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                        selectedCategory === cat._id
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      )}
                    >
                      {cat.title}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Mobile: category shown as chips below toolbar — handled separately */}
            </div>
          </aside>

          {/* ── Products ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile category chips */}
            {categories.length > 0 && (
              <div className="flex md:hidden gap-2 flex-wrap mb-4">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-full border text-sm transition-colors',
                    selectedCategory === 'all'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 text-gray-600 hover:border-gray-600',
                  )}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full border text-sm transition-colors',
                      selectedCategory === cat._id
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-300 text-gray-600 hover:border-gray-600',
                    )}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-[340px] mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
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
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {products.map((product, index) => {
                  const thumbnail = product.thumbnail || product.images?.[0] || FALLBACK_IMAGE;
                  const discountedPrice =
                    product.discount && product.discount > 0
                      ? product.price * (1 - product.discount / 100)
                      : null;

                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                    >
                      {viewMode === 'grid' ? (
                        <div className="group cursor-pointer">
                          <Link href={`/shop/${product._id}`}>
                            <div className="relative h-[340px] overflow-hidden bg-gray-100 mb-4">
                              <Image
                                src={thumbnail}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {product.discount && product.discount > 0 && (
                                <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded animate-pulse-highlight shadow-lg">
                                  -{product.discount}%
                                </span>
                              )}
                              {product.status === 'out_of_stock' && (
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
                                  onClick={() => handleSizeSelect(product._id, size)}
                                  className={`w-8 h-8 border text-sm font-medium transition-colors ${
                                    selectedSize[product._id] === size
                                      ? 'border-gray-900 bg-gray-900 text-white'
                                      : 'border-gray-300 hover:border-gray-900'
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
                              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                            )}
                            <div className="flex items-center justify-center gap-2 mb-3">
                              {discountedPrice ? (
                                <>
                                  <span className="font-semibold text-lg text-black">
                                    {discountedPrice.toLocaleString('vi-VN')}₫
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {product.price.toLocaleString('vi-VN')}₫
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-lg text-black">
                                  {product.price.toLocaleString('vi-VN')}₫
                                </span>
                              )}
                            </div>
                            <Button
                              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
                              size="lg"
                              disabled={
                                product.status === 'out_of_stock' || addingProductId === product._id
                              }
                              onClick={() => handleAddToCart(product)}
                            >
                              {addingProductId === product._id ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ'}
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
                              <p className="text-sm text-gray-500">{product.brand}</p>
                            )}
                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              {discountedPrice ? (
                                <>
                                  <span className="font-semibold text-lg text-black">
                                    {discountedPrice.toLocaleString('vi-VN')}₫
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {product.price.toLocaleString('vi-VN')}₫
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-lg text-black">
                                  {product.price.toLocaleString('vi-VN')}₫
                                </span>
                              )}
                            </div>
                            <Button
                              className="w-fit bg-gray-900 hover:bg-gray-800 text-white"
                              disabled={
                                product.status === 'out_of_stock' || addingProductId === product._id
                              }
                              onClick={() => handleAddToCart(product)}
                            >
                              {addingProductId === product._id ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  // Show first, last, current ±1
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setPage(p)}
                        className={cn(
                          'h-9 w-9 text-sm',
                          p === page && 'bg-gray-900 hover:bg-gray-800',
                        )}
                      >
                        {p}
                      </Button>
                    );
                  }
                  // Ellipsis
                  if (p === page - 2 || p === page + 2) {
                    return (
                      <span key={p} className="px-1 text-gray-400 select-none">
                        …
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
