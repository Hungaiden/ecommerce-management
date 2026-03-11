"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Package,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Sản phẩm",
    href: "/admin/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    label: "Danh mục",
    href: "/admin/categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Giỏ hàng",
    href: "/admin/carts",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-700 px-4">
        {!collapsed && (
          <span className="text-lg font-bold tracking-wide text-white">
            Admin Panel
          </span>
        )}
        {collapsed && (
          <span className="mx-auto text-lg font-bold text-white">A</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-gray-300 bg-white text-gray-600 shadow hover:bg-gray-100"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
