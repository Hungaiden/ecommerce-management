"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Shield, RotateCcw, Headphones } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/service/products";
import { formatCurrency } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 129,
    hours: 1,
    mins: 5,
    secs: 31,
  });

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) {
          secs = 59;
          mins--;
        }
        if (mins < 0) {
          mins = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          mins = 0;
          secs = 0;
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getProducts({ isFeatured: true, limit: 6, status: "active" })
      .then((res) => setFeaturedProducts((res?.hits as Product[]) ?? []))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex min-h-screen flex-col"
    >
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#e8e8e8] min-h-[700px] flex items-center">
          <div className="w-full">
            <div
              className="hidden lg:grid"
              style={{ gridTemplateColumns: "1fr 1.8fr 1fr" }}
            >
              {/* Left - Model in Black Hoodie */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="h-[700px] bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=90)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 40%, #e8e8e8 100%)",
                  }}
                />
              </motion.div>

              {/* Center - Content */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center flex flex-col items-center justify-center px-8"
              >
                <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
                  TrendVibe
                </h1>
                <p className="text-base md:text-lg text-gray-500 mb-10 max-w-xl mx-auto tracking-wide">
                  Make yours celebrations even more special this years with
                  beautiful.
                </p>
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white px-10 py-6 text-base font-normal rounded-none tracking-wide transition-all duration-300"
                  >
                    Go to shop
                  </Button>
                </Link>
              </motion.div>

              {/* Right - Model in Gray Sweater */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-[700px] bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=90)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to left, transparent 40%, #e8e8e8 100%)",
                  }}
                />
              </motion.div>
            </div>

            {/* Mobile view */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:hidden text-center py-20 px-8"
            >
              <h1 className="text-4xl font-light tracking-tight mb-6">
                TrendVibe
              </h1>
              <p className="text-base text-gray-500 mb-10 max-w-xl mx-auto tracking-wide">
                Make yours celebrations even more special this years with
                beautiful.
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white px-10 py-6 text-base font-normal rounded-none tracking-wide transition-all duration-300"
                >
                  Go to shop
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#2d2d2d] py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <Package className="h-12 w-12 text-gray-400 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-white font-normal text-lg mb-1">
                    Giao hàng nhanh nhất
                  </h3>
                  <p className="text-gray-400 text-sm">Đơn hàng từ 800.000đ</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <Shield className="h-12 w-12 text-gray-400 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-white font-normal text-lg mb-1">
                    Thanh toán an toàn 100%
                  </h3>
                  <p className="text-gray-400 text-sm">Trả góp 9 tháng</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <RotateCcw className="h-12 w-12 text-gray-400 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-white font-normal text-lg mb-1">
                    Đổi trả trong 14 ngày
                  </h3>
                  <p className="text-gray-400 text-sm">Mua sắm với sự tự tin</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <Headphones className="h-12 w-12 text-gray-400 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-white font-normal text-lg mb-1">
                    Hỗ trợ 24/7
                  </h3>
                  <p className="text-gray-400 text-sm">Giao hàng tận nhà</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            {/* Section Title */}
            <div className="flex items-center gap-6 mb-10">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-2xl font-light tracking-wide whitespace-nowrap">
                Sản phẩm nổi bật
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Top Row: Banner + 2 Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Left - Banner with countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden group cursor-pointer"
                style={{ height: "480px" }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80)",
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-10 left-8 text-white">
                  {/* Countdown */}
                  <div className="flex gap-2 mb-4">
                    {[
                      { val: timeLeft.days, label: "Days" },
                      { val: timeLeft.hours, label: "Hours" },
                      { val: timeLeft.mins, label: "Mins" },
                      { val: timeLeft.secs, label: "Secs" },
                    ].map(({ val, label }) => (
                      <div
                        key={label}
                        className="bg-white text-black text-sm font-medium px-3 py-1.5 min-w-[64px] text-center"
                      >
                        {String(val).padStart(2, "0")} {label}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light mb-5">
                    The Classics Make A Comeback
                  </h3>
                  <Link href="/shop">
                    <Button className="bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white rounded-none px-8 py-5 text-sm font-normal tracking-wide">
                      Mua ngay
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Right - 2 product cards stacked */}
              <div className="grid grid-cols-2 gap-4">
                {productsLoading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div
                          className="bg-gray-200"
                          style={{ height: "230px" }}
                        />
                        <div className="pt-3 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  : featuredProducts.slice(0, 2).map((product, i) => {
                      const thumb =
                        product.thumbnail ||
                        product.images?.[0] ||
                        FALLBACK_IMAGE;
                      const discounted =
                        product.discount && product.discount > 0
                          ? product.price * (1 - product.discount / 100)
                          : null;
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="group cursor-pointer"
                        >
                          <Link href={`/shop/${product._id}`}>
                            <div
                              className="overflow-hidden"
                              style={{ height: "230px" }}
                            >
                              <Image
                                src={thumb}
                                alt={product.name}
                                width={600}
                                height={230}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                              />
                            </div>
                            <div className="pt-3">
                              <h3 className="text-sm font-normal text-gray-800 mb-1 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {discounted
                                  ? formatCurrency(discounted)
                                  : formatCurrency(product.price)}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
              </div>
            </div>

            {/* Bottom Row: 4 Products */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div
                        className="bg-gray-200"
                        style={{ height: "260px" }}
                      />
                      <div className="pt-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : featuredProducts.slice(2, 6).map((product, i) => {
                    const thumb =
                      product.thumbnail ||
                      product.images?.[0] ||
                      FALLBACK_IMAGE;
                    const discounted =
                      product.discount && product.discount > 0
                        ? product.price * (1 - product.discount / 100)
                        : null;
                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/shop/${product._id}`}>
                          <div
                            className="overflow-hidden"
                            style={{ height: "260px" }}
                          >
                            <Image
                              src={thumb}
                              alt={product.name}
                              width={600}
                              height={260}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                          <div className="pt-3">
                            <h3 className="text-sm font-normal text-gray-800 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {discounted
                                ? formatCurrency(discounted)
                                : formatCurrency(product.price)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
