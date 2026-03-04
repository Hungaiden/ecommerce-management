"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Facebook,
  Instagram,
  Youtube,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  User,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Left Section - Social Icons + Menu (Desktop) */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Khám phá cửa hàng của chúng tôi
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 py-6">
                  <Link
                    href="/"
                    className="text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/shop"
                    className="text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    Cửa hàng
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    Về chúng tôi
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Social Icons - Desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
              >
                <Facebook
                  className="h-3.5 w-3.5 text-white"
                  fill="currentColor"
                />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
              >
                <Instagram className="h-3.5 w-3.5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
              >
                <Youtube
                  className="h-3.5 w-3.5 text-white"
                  fill="currentColor"
                />
              </Link>
            </div>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center gap-10 ml-10">
              {(
                [
                  { href: "/", label: "Trang chủ", exact: true },
                  { href: "/shop", label: "Cửa hàng", exact: false },
                  { href: "/about", label: "Về chúng tôi", exact: false },
                ] as { href: string; label: string; exact: boolean }[]
              ).map(({ href, label, exact }) => {
                const isActive = exact
                  ? pathname === href
                  : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative text-[15px] font-normal tracking-wide hover:text-black transition-colors pb-1 group"
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-80 transition-opacity"
          >
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-light tracking-wide">
                TrendVibe
              </h1>
              <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-[0.2em] mt-1">
                THEME
              </p>
            </div>
          </Link>

          {/* Right Section - Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/contact"
              className="hidden md:flex items-center text-[15px] font-normal tracking-wide hover:text-black transition-colors px-3 py-2"
            >
              Liên hệ
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
              <span className="sr-only">Tìm kiếm</span>
            </Button>

            {/* Desktop: hiện dropdown khi đã đăng nhập, hiện link khi chưa */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-transparent"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
                      {user.fullName?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <span className="text-[15px] font-normal tracking-wide max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Hồ sơ của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      Đơn hàng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center text-[15px] font-normal tracking-wide hover:text-black transition-colors px-3 py-2"
              >
                Đăng nhập
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-transparent"
                >
                  <User className="h-5 w-5 stroke-[1.5]" />
                  <span className="sr-only">Tài khoản</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      {user?.fullName || "Tài khoản của tôi"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="cursor-pointer">
                        Đơn hàng của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer">
                        Đăng ký
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent relative"
            >
              <div className="relative">
                <Heart className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
              </div>
              <span className="sr-only">Yêu thích</span>
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent relative"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center bg-black text-white text-[10px] font-medium rounded-full">
                    {cartCount}
                  </span>
                </div>
                <span className="sr-only">Giỏ hàng</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
