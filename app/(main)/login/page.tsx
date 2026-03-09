"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/service/auth";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);

      authLogin(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.userInfo,
        formData.remember,
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — fashion image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGZhc2hpb258ZW58MHx8MHx8fDA%3D"
          alt="TrendVibe Fashion"
          fill
          className="object-cover object-center"
          priority
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Quote overlay */}
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-4xl font-light tracking-[0.15em]">TrendVibe</h1>
            <p className="text-xs text-gray-300 uppercase tracking-[0.3em] mt-1">
              Fashion & Style
            </p>
          </Link>
          <blockquote className="italic text-xl font-light text-gray-100 leading-relaxed max-w-sm">
            "Thời trang không phải về những bộ quần áo bạn mặc — mà là câu
            chuyện bạn kể."
          </blockquote>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/">
              <h1 className="text-3xl font-light tracking-[0.15em]">
                TrendVibe
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-1">
                Fashion & Style
              </p>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
              Chào mừng trở lại
            </p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Đăng nhập
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-widest text-gray-500"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest text-gray-500"
                >
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-2"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors bg-gray-50 focus:bg-white pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={(e) =>
                  setFormData({ ...formData, remember: e.target.checked })
                }
                className="w-4 h-4 accent-gray-900 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-500 cursor-pointer select-none"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-none text-sm tracking-widest font-normal mt-2 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                "ĐĂNG NHẬP"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              hoặc
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-gray-900 font-medium underline underline-offset-2 hover:no-underline transition-all"
            >
              Đăng ký ngay
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-4">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
