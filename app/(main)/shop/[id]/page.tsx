"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Heart,
  RefreshCw,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, type Product } from "@/service/products";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=90";

// category có thể là object {_id, title} sau khi populate, hoặc string
function getCategoryTitle(category: any): string {
  if (!category) return "";
  if (typeof category === "object") return category.title ?? "";
  return category;
}

function getCategoryId(category: any): string {
  if (!category) return "";
  if (typeof category === "object") return category._id ?? "";
  return category;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openInfo, setOpenInfo] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem({
        product_id: product._id,
        quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem({
        product_id: product._id,
        quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
      router.push("/cart");
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
        if (data.sizes?.[0]) setSelectedSize(data.sizes[0]);
        if (data.colors?.[0]) setSelectedColor(data.colors[0]);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm.</p>
        <Link href="/shop">
          <Button variant="outline">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE];

  const discountedPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b py-3">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/shop"
              className="hover:text-gray-900 transition-colors"
            >
              Cửa hàng
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/shop?category=${getCategoryId(product.category)}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {getCategoryTitle(product.category)}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 line-clamp-1 max-w-[200px]">
              {product.name}
            </span>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Quay lại trang trước
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main image */}
            <div className="relative h-[500px] overflow-hidden bg-gray-100 mb-3">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500"
              />
              {product.discount && product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-semibold px-3 py-1">
                  -{product.discount}%
                </span>
              )}
              {product.status === "out_of_stock" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold tracking-widest">
                    HẾT HÀNG
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                      activeImage === i
                        ? "border-gray-900"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Name & Price */}
            <div>
              <h1 className="text-2xl font-light tracking-wide mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                {discountedPrice ? (
                  <>
                    <span className="text-2xl font-semibold text-red-600">
                      {discountedPrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-gray-800">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Màu sắc: <span className="font-medium">{selectedColor}</span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 h-8 border text-sm font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-900 text-gray-700"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Kích cỡ: <span className="font-medium">{selectedSize}</span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-900 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedSize("")}
                    className="text-sm text-gray-500 underline hover:text-gray-900 transition-colors ml-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock ?? 99, q + 1))
                  }
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <Button
                className="flex-1 bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white rounded-none h-12 text-sm font-normal tracking-widest flex items-center gap-2"
                disabled={product.status === "out_of_stock" || isAdding}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {isAdding ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
              </Button>
            </div>

            {/* OR + Buy Now */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 tracking-widest">
                  HOẶC
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <Button
                className="w-full bg-[#1a1a1a] hover:bg-black text-white rounded-none h-12 text-sm font-normal tracking-widest flex items-center justify-center gap-2"
                disabled={product.status === "out_of_stock" || isAdding}
                onClick={handleBuyNow}
              >
                <ShoppingCart className="h-4 w-4" />
                MUA NGAY
              </Button>
            </div>

            {/* Wishlist */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors">
                <Heart className="h-4 w-4 text-gray-500" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Safe Checkout */}
            <div className="border border-gray-200 p-4">
              <p className="text-center text-xs tracking-widest text-gray-500 mb-3">
                <span className="text-green-600 font-semibold">THANH TOÁN</span>{" "}
                <span className="font-semibold">AN TOÀN</span>{" "}
                <span className="text-green-600 font-semibold">ĐẢM BẢO</span>
              </p>
              <div className="flex items-center justify-center gap-2 mb-3">
                {["VISA", "MC", "PayPal", "AMEX", "Maestro", "₿"].map(
                  (icon) => (
                    <div
                      key={icon}
                      className="h-8 px-2 bg-gray-100 border border-gray-200 flex items-center justify-center rounded text-xs font-bold text-gray-700 min-w-[40px]"
                    >
                      {icon}
                    </div>
                  ),
                )}
              </div>
              <p className="text-center text-xs text-gray-400">
                Thanh toán của bạn được bảo mật 100%
              </p>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 text-sm">
              {product.brand && (
                <p>
                  <span className="font-medium text-gray-800">
                    Thương hiệu:{" "}
                  </span>
                  <span className="text-blue-600">{product.brand}</span>
                </p>
              )}
              {product.sku && (
                <p>
                  <span className="font-medium text-gray-800">SKU: </span>
                  <span className="text-gray-500">{product.sku}</span>
                </p>
              )}
              {product.category && (
                <p>
                  <span className="font-medium text-gray-800">Danh mục: </span>
                  <span className="text-gray-500">
                    {getCategoryTitle(product.category)}
                  </span>
                </p>
              )}
              <p>
                <span className="font-medium text-gray-800">Tồn kho: </span>
                <span
                  className={
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
                </span>
              </p>
            </div>

            {/* Additional Information */}
            <div className="border border-gray-200">
              <button
                onClick={() => setOpenInfo(!openInfo)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold tracking-widest text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-400">{openInfo ? "—" : "+"}</span>
                THÔNG TIN BỔ SUNG
              </button>
              {openInfo && (
                <div className="divide-y divide-gray-100">
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="grid grid-cols-2 px-4 py-3 text-sm">
                      <span className="text-gray-500">Kích cỡ</span>
                      <span className="text-gray-800">
                        {product.sizes.join(", ")}
                      </span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="grid grid-cols-2 px-4 py-3 text-sm">
                      <span className="text-gray-500">Màu sắc</span>
                      <span className="text-gray-800">
                        {product.colors.join(", ")}
                      </span>
                    </div>
                  )}
                  {product.material && (
                    <div className="grid grid-cols-2 px-4 py-3 text-sm">
                      <span className="text-gray-500">Chất liệu</span>
                      <span className="text-gray-800">{product.material}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
