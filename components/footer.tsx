import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Newsletter */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <h3 className="text-xl font-bold mb-2">TrendVibe</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                THEME
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Khám phá xu hướng thời trang mới nhất. Đăng ký nhận bản tin để
              nhận ưu đãi độc quyền và cập nhật mới.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="max-w-xs"
              />
              <Button className="bg-gray-900 hover:bg-gray-800">Đăng ký</Button>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Twitter className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Youtube className="h-4 w-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Cửa hàng
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Hàng mới về
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Bộ sưu tập Nam
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Bộ sưu tập Nữ
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Giảm giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Dịch vụ khách hàng
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Thông tin vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Đổi trả hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
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
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} TrendVibe. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Điều khoản dịch vụ
              </Link>
              <Link href="/cookies" className="hover:text-gray-900">
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
