'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminLoginPath = pathname === '/admin/login';

  // Bảo vệ route admin – chỉ cho phép role "admin"
  useEffect(() => {
    if (isAdminLoginPath) {
      if (isLoggedIn && user?.role === 'admin') {
        router.replace('/admin');
      }
      return;
    }

    if (!isLoggedIn) {
      router.replace('/admin/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAdminLoginPath, isLoggedIn, user, router]);

  if (isAdminLoginPath) {
    return <>{children}</>;
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return null; // render nothing while redirecting
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
