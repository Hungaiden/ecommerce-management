"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Home } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-gray-600"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-600 text-xs text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {user?.fullName ?? "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.fullName ?? "Admin"}</span>
                <span className="text-xs font-normal text-gray-500">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Hồ sơ cá nhân
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
