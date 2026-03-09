"use client";

import { getCookie, removeCookie, setCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    userInfo: User,
    remember?: boolean,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const userInfo = getCookie("userInfo");

    return JSON.parse(userInfo ? userInfo : "null");
  });
  const router = useRouter();

  const login = (
    accessToken: string,
    refreshToken: string,
    userInfo: User,
    remember: boolean = false,
  ) => {
    try {
      const accessExpiry = remember ? 7 : 1;
      const refreshExpiry = remember ? 30 : 7;

      setCookie("accessToken", accessToken, { expires: accessExpiry });
      setCookie("refreshToken", refreshToken, { expires: refreshExpiry });
      setCookie("userInfo", JSON.stringify(userInfo), {
        expires: accessExpiry,
      });

      setUser(userInfo);
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  };

  const logout = () => {
    console.log("Logout called");
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("userInfo");
    setUser(null);
    toast.success("Đăng xuất thành công!");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
