'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Facebook, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { register } from '@/service/register';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  validateFullName,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirmPassword,
  trimInput,
} from '@/lib/validations/form';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: '',
    role_id: 'customer', // enum backend: 'admin' | 'staff' | 'customer'
    status: 'active', // Mặc định là active
  });

  // Validation errors state
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate all fields
    const fullNameValidation = validateFullName(formData.fullName);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhoneNumber(formData.phone);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    // Collect errors
    const newErrors: typeof errors = {};
    if (!fullNameValidation.valid) newErrors.fullName = fullNameValidation.error;
    if (!emailValidation.valid) newErrors.email = emailValidation.error;
    if (!phoneValidation.valid) newErrors.phone = phoneValidation.error;
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error;
    if (!confirmPasswordValidation.valid)
      newErrors.confirmPassword = confirmPasswordValidation.error;

    // If there are any errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại các trường');
      return;
    }

    try {
      setLoading(true);
      await register(
        trimInput(formData.fullName),
        trimInput(formData.email),
        formData.password,
        formData.confirmPassword,
        trimInput(formData.phone),
        formData.avatar,
        formData.role_id,
        formData.status,
      );

      toast.success('Đăng ký thành công!');
      // Chuyển hướng về trang đăng nhập
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="flex flex-col gap-2 text-center">
              <Link href="/" className="mx-auto flex items-center gap-2">
                <span className="font-bold text-lg">TrendVibe</span>
              </Link>
              <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
              <p className="text-sm text-muted-foreground">
                Nhập thông tin của bạn để tạo tài khoản
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      fullName: value,
                    });
                    // Validate on change
                    if (value) {
                      const validation = validateFullName(value);
                      if (validation.valid) {
                        setErrors({ ...errors, fullName: undefined });
                      } else {
                        setErrors({ ...errors, fullName: validation.error });
                      }
                    }
                  }}
                  className={errors.fullName ? 'border-red-500' : ''}
                  required
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      email: value,
                    });
                    // Validate on change
                    if (value) {
                      const validation = validateEmail(value);
                      if (validation.valid) {
                        setErrors({ ...errors, email: undefined });
                      } else {
                        setErrors({ ...errors, email: validation.error });
                      }
                    }
                  }}
                  className={errors.email ? 'border-red-500' : ''}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      phone: value,
                    });
                    // Validate on change
                    if (value) {
                      const validation = validatePhoneNumber(value);
                      if (validation.valid) {
                        setErrors({ ...errors, phone: undefined });
                      } else {
                        setErrors({ ...errors, phone: validation.error });
                      }
                    }
                  }}
                  className={errors.phone ? 'border-red-500' : ''}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
              {/* <div className="grid gap-2">
                                <Label htmlFor="avatar">Avatar URL</Label>
                                <Input
                                    id="avatar"
                                    type="text"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={formData.avatar}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            avatar: e.target.value,
                                        })
                                    }
                                />
                            </div> */}
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      password: value,
                    });
                    // Validate on change
                    if (value) {
                      const validation = validatePassword(value);
                      if (validation.valid) {
                        setErrors({ ...errors, password: undefined });
                      } else {
                        setErrors({ ...errors, password: validation.error });
                      }
                    }
                  }}
                  className={errors.password ? 'border-red-500' : ''}
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      confirmPassword: value,
                    });
                    // Validate on change
                    if (value) {
                      const validation = validateConfirmPassword(formData.password, value);
                      if (validation.valid) {
                        setErrors({ ...errors, confirmPassword: undefined });
                      } else {
                        setErrors({ ...errors, confirmPassword: validation.error });
                      }
                    }
                  }}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white focus-visible:ring-black"
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-black underline-offset-4 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link href="/privacy" className="text-black underline-offset-4 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            </form>
            <div className="relative flex items-center justify-center">
              <Separator className="w-full" />
              <div className="absolute bg-background px-2 text-xs text-muted-foreground">
                HOẶC TIẾP TỤC VỚI
              </div>
            </div>

            <div className="text-center text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-black underline-offset-4 hover:underline">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
