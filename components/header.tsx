'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Trang chủ', exact: true },
    { href: '/shop', label: 'Cửa hàng', exact: false },
    { href: '/about', label: 'Về chúng tôi', exact: false },
  ] as const;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-200'
          : 'bg-white border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* 3-column grid: logo | nav | icons */}
        <div className="grid grid-cols-[1fr_auto_1fr] h-18 py-4 items-center">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gray-100 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">TrendVibe</SheetTitle>
                  <SheetDescription>Khám phá cửa hàng của chúng tôi</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-5 py-6">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-base font-medium text-black/70 hover:text-black transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    className="text-base font-medium text-black/70 hover:text-black transition-colors"
                  >
                    Liên hệ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo - desktop */}
            <Link href="/" className="hidden md:block group">
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide group-hover:opacity-75 transition-opacity">
                TrendVibe
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] mt-0.5">THEME</p>
            </Link>

            {/* Logo - mobile (centered via grid) */}
            <Link href="/" className="md:hidden">
              <h1 className="text-2xl font-bold tracking-wide">TrendVibe</h1>
            </Link>
          </div>

          {/* Center - Navigation (desktop only) */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map(({ href, label, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-base font-medium tracking-wide transition-colors pb-1 group ${
                    isActive ? 'text-black' : 'text-black/70 hover:text-black'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-black transition-all duration-300 ${
                      isActive ? 'w-6' : 'w-0 group-hover:w-6'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right - Action icons */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            {/* User - desktop */}
            {!mounted ? (
              <div className="hidden md:block w-10 h-10" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex w-10 h-10 hover:bg-gray-100 transition-colors rounded-full"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
                      {user.fullName?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">{user.email}</span>
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
                className="hidden md:flex items-center text-base font-medium tracking-wide text-black/70 hover:text-black transition-colors px-2 py-2 rounded-md hover:bg-gray-100"
              >
                Đăng nhập
              </Link>
            )}

            {/* User - mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden w-10 h-10 hover:bg-gray-100 transition-colors rounded-full"
                >
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                  <span className="sr-only">Tài khoản</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel>{user?.fullName || 'Tài khoản của tôi'}</DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
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

            {/*
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 hover:bg-gray-100 hover:text-black transition-colors rounded-full"
            >
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
              <span className="sr-only">Yêu thích</span>
            </Button>
            */}

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 hover:bg-gray-100 hover:text-black transition-colors rounded-full relative"
              >
                <ShoppingCart className="h-[18px] w-[18px] stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-black text-white text-[10px] font-semibold rounded-full leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                <span className="sr-only">Giỏ hàng</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
