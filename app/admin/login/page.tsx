'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { adminLogin } from '@/service/auth';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await adminLogin(email, password);

      authLogin(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.userInfo,
        remember,
        '/admin',
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bạn không có quyền truy cập khu vực quản trị.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(249,115,22,0.2),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.2),transparent_45%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl sm:p-9"
        >
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400/20 p-2.5 text-cyan-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Admin Zone</p>
              <h1 className="text-2xl font-semibold tracking-wide">/admin/login</h1>
            </div>
          </div>

          <p className="mb-7 text-sm text-slate-200/90">
            Chỉ tài khoản có quyền admin mới được đăng nhập vào khu vực này.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-slate-200">
                Email quản trị
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-white/20 bg-slate-900/60 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs uppercase tracking-[0.2em] text-slate-200"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-white/20 bg-slate-900/60 pr-12 text-white placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-cyan-400"
              />
              Ghi nhớ đăng nhập
            </label>

            <Button
              type="submit"
              className="h-12 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập quản trị'}
            </Button>
          </form>

          <div className="mt-7 flex items-center justify-between text-sm text-slate-300">
            <Link href="/login" className="hover:text-cyan-300">
              Đăng nhập người dùng
            </Link>
            <Link href="/" className="hover:text-cyan-300">
              Về trang chủ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
