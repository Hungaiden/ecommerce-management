'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeNewsletter } from '@/service/newsletter';
import { toast } from 'sonner';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = email.trim();
    if (!normalized) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(normalized);
      setEmail('');
      toast.success('Đăng ký nhận bản tin thành công');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể đăng ký nhận bản tin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#363636] border-gray-700">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Newsletter */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <h3 className="text-xl font-bold mb-2 text-white">TrendVibe</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">THEME</p>
            </div>
            <p className="text-sm text-gray-300">
              Khám phá xu hướng thời trang mới nhất. Đăng ký nhận bản tin để nhận ưu đãi độc quyền
              và cập nhật mới.
            </p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="max-w-xs bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-400"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
              />
              <Button
                className="bg-white text-black hover:bg-gray-200"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
              </Button>
            </form>
            <div className="flex gap-4 pt-4">
              <Link
                href="https://www.facebook.com/h.10010.10"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-white hover:text-black" />
              </Link>
              <Link
                href="https://www.facebook.com/h.10010.10"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white hover:text-black" />
              </Link>
              <Link
                href="https://www.facebook.com/h.10010.10"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-white hover:text-black" />
              </Link>
              <Link
                href="https://www.facebook.com/h.10010.10"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-white hover:text-black" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Cửa hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Hàng mới về
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Bộ sưu tập Nam
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Bộ sưu tập Nữ
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Giảm giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Dịch vụ khách hàng
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Thông tin vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Đổi trả hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>123 Đường Thời Trang, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+84 (024) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@trendvibe.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-gray-700 border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} TrendVibe. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/privacy" className="hover:text-white">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-white">
                Điều khoản dịch vụ
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
