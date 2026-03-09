"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "Địa chỉ",
    lines: ["123 Đường Cầu Giấy, Phường Dịch Vọng", "Quận Cầu Giấy, Hà Nội"],
  },
  {
    icon: Phone,
    title: "Điện thoại",
    lines: ["(+84) 024 3826 xxxx", "Hotline: 1800 xxxx (miễn phí)"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@trendvibe.vn", "business@trendvibe.vn"],
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    lines: ["Thứ 2 – Thứ 6: 8:00 – 18:00", "Thứ 7 – CN: 9:00 – 17:00"],
  },
];

const faqs = [
  {
    question: "Tôi có thể đổi / trả hàng trong bao lâu?",
    answer:
      "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm cần còn nguyên tem, nhãn và chưa qua sử dụng.",
  },
  {
    question: "Thời gian giao hàng là bao lâu?",
    answer:
      "Nội thành Hà Nội: 1–2 ngày làm việc. Các tỉnh thành khác: 2–5 ngày làm việc tùy khu vực.",
  },
  {
    question: "Có hỗ trợ giao hàng toàn quốc không?",
    answer:
      "Có, chúng tôi giao hàng trên toàn quốc thông qua các đối tác vận chuyển uy tín như GHN, GHTK, J&T Express.",
  },
  {
    question: "Làm thế nào để theo dõi đơn hàng?",
    answer:
      "Sau khi đơn hàng được xác nhận, bạn sẽ nhận được email/SMS chứa mã vận đơn để theo dõi trạng thái giao hàng.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    setLoading(true);
    // TODO: integrate real API
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b py-3">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900">Liên hệ</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
        <motion.div
          className="relative container mx-auto px-4 md:px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            Chúng tôi luôn lắng nghe
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
            Liên hệ <span className="italic">với chúng tôi</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Dù bạn có thắc mắc, góp ý hay chỉ muốn nói xin chào — chúng tôi rất
            vui được lắng nghe bạn.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.title}
                className="border p-7 group hover:shadow-md transition-shadow duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                  <item.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-sm uppercase tracking-widest mb-3">
                  {item.title}
                </h3>
                {item.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-gray-500 leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3">
                Gửi tin nhắn
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-8">
                Để lại lời nhắn <span className="italic">cho chúng tôi</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 h-11"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      Số điện thoại
                    </label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                      className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      Chủ đề
                    </label>
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Hỏi về sản phẩm..."
                      className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows={5}
                    className="rounded-none border-gray-200 focus-visible:ring-0 focus-visible:border-gray-900 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white rounded-none px-10 h-11 text-xs tracking-widest font-normal"
                >
                  {loading ? (
                    "ĐANG GỬI..."
                  ) : (
                    <>
                      GỬI TIN NHẮN
                      <Send className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map + Social */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              {/* Google Map embed */}
              <div className="relative w-full h-[340px] overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.095680735677!2d105.7824!3d21.0285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAyJzAyLjYiTiAxMDXCsDQ2JzU2LjYiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TrendVibe location"
                />
              </div>

              {/* Social media */}
              <div className="border p-7">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
                  Kết nối với chúng tôi
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <div className="w-9 h-9 border flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors">
                      <Facebook className="h-4 w-4 group-hover:text-white transition-colors" />
                    </div>
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <div className="w-9 h-9 border flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors">
                      <Instagram className="h-4 w-4 group-hover:text-white transition-colors" />
                    </div>
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <div className="w-9 h-9 border flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors">
                      <Youtube className="h-4 w-4 group-hover:text-white transition-colors" />
                    </div>
                    Youtube
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3">
              Câu hỏi thường gặp
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              Bạn đang thắc mắc <span className="italic">điều gì?</span>
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                className="bg-white border p-7"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-medium text-base mb-3">{faq.question}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
