"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Shield,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Gọi API cập nhật thông tin
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      setLoading(true);
      // TODO: Gọi API đổi mật khẩu
      toast.success("Đổi mật khẩu thành công!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const roleLabel: Record<string, string> = {
    admin: "Quản trị viên",
    user: "Người dùng",
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-700">Tài khoản</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Profile Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500" />

          <div className="px-8 pb-7 relative">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-800">
                  {initials}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </Button>
            </div>

            {/* Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {user?.fullName ?? "—"}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
              </div>
              <Badge
                variant="secondary"
                className="w-fit bg-gray-900 text-white hover:bg-gray-800 text-xs px-3 py-1 rounded-full"
              >
                {roleLabel[user?.role ?? ""] ?? user?.role ?? "user"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="bg-white border border-gray-100 rounded-xl shadow-sm p-1 h-auto w-full grid grid-cols-3 gap-1">
            <TabsTrigger
              value="info"
              className="rounded-lg py-2.5 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow text-sm font-normal transition-all gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Thông tin</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg py-2.5 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow text-sm font-normal transition-all gap-2"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-lg py-2.5 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow text-sm font-normal transition-all gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Đơn hàng</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Thông tin cá nhân ── */}
          <TabsContent value="info">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Thông tin cá nhân
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Xem và cập nhật thông tin của bạn
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-400">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <Input
                        defaultValue={user?.fullName ?? ""}
                        className="pl-9 h-11 rounded-xl border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-400">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <Input
                        type="email"
                        defaultValue={user?.email ?? ""}
                        disabled
                        className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-400">
                      Vai trò
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <Input
                        value={roleLabel[user?.role ?? ""] ?? user?.role ?? ""}
                        disabled
                        className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 hover:bg-black text-white rounded-xl px-7 h-11 text-sm tracking-wide transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Đang lưu...
                      </span>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* ── Bảo mật ── */}
          <TabsContent value="security">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Đổi mật khẩu
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Cập nhật mật khẩu để bảo vệ tài khoản
                </p>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="space-y-5 max-w-md"
              >
                {[
                  {
                    id: "current",
                    label: "Mật khẩu hiện tại",
                    show: showCurrent,
                    toggle: () => setShowCurrent((v) => !v),
                    value: passwords.current,
                    onChange: (v: string) =>
                      setPasswords((p) => ({ ...p, current: v })),
                  },
                  {
                    id: "new",
                    label: "Mật khẩu mới",
                    show: showNew,
                    toggle: () => setShowNew((v) => !v),
                    value: passwords.newPass,
                    onChange: (v: string) =>
                      setPasswords((p) => ({ ...p, newPass: v })),
                  },
                  {
                    id: "confirm",
                    label: "Xác nhận mật khẩu mới",
                    show: showConfirm,
                    toggle: () => setShowConfirm((v) => !v),
                    value: passwords.confirm,
                    onChange: (v: string) =>
                      setPasswords((p) => ({ ...p, confirm: v })),
                  },
                ].map(({ id, label, show, toggle, value, onChange }) => (
                  <div key={id} className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-400">
                      {label}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <Input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        required
                        className="pl-9 pr-11 h-11 rounded-xl border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 bg-gray-50 focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {show ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 hover:bg-black text-white rounded-xl px-7 h-11 text-sm tracking-wide transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Đang xử lý...
                      </span>
                    ) : (
                      "Đổi mật khẩu"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* ── Đơn hàng ── */}
          <TabsContent value="orders">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Đơn hàng của tôi
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Lịch sử mua hàng và trạng thái đơn hàng
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="h-7 w-7 text-gray-300" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Chưa có đơn hàng</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Hãy khám phá cửa hàng và đặt hàng ngay!
                  </p>
                </div>
                <Link href="/shop">
                  <Button className="bg-gray-900 hover:bg-black text-white rounded-xl px-6 h-10 text-sm mt-2 transition-colors">
                    Khám phá cửa hàng
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
