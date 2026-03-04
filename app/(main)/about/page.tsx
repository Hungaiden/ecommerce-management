"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Award,
  Leaf,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "2018", label: "Năm thành lập" },
  { value: "50K+", label: "Khách hàng tin tưởng" },
  { value: "200+", label: "Sản phẩm độc quyền" },
  { value: "98%", label: "Độ hài lòng" },
];

const values = [
  {
    icon: Award,
    title: "Chất lượng cao cấp",
    description:
      "Mỗi sản phẩm được kiểm tra nghiêm ngặt qua nhiều công đoạn trước khi đến tay khách hàng. Chúng tôi không thỏa hiệp với chất lượng.",
  },
  {
    icon: Leaf,
    title: "Bền vững & Thân thiện",
    description:
      "TrendVibe cam kết sử dụng nguyên liệu thân thiện với môi trường và quy trình sản xuất có trách nhiệm với hành tinh xanh.",
  },
  {
    icon: Heart,
    title: "Tâm huyết thiết kế",
    description:
      "Đội ngũ nhà thiết kế tài năng của chúng tôi không ngừng sáng tạo, mang đến những bộ trang phục vừa đẹp vừa thoải mái khi mặc.",
  },
  {
    icon: Users,
    title: "Cộng đồng trung tâm",
    description:
      "Chúng tôi xây dựng một cộng đồng yêu thời trang — nơi mọi người được thể hiện cá tính và phong cách riêng của mình.",
  },
];

const team = [
  {
    name: "Nguyễn Minh Phúc",
    role: "Creative Director",
    image:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/622686344_1350139470489708_187033463857944835_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeGrpS4I432Q1MOG1_kAnJtPhD6dFlag3jeEPp0WVqDeNzA7JClfABjxP3zwZp0Ibo8EuzFWJU14ei1n4MPvdQ5Y&_nc_ohc=isfOBFZM03wQ7kNvwGISbDe&_nc_oc=Adn3Cf3eC2HXHDPmLDub9PyMqxYlDSYHmv6XkhMi_ZhVjR7OxsaTv0WcucxQhp3p8hU&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=jCaPnC1XkeW6cWg7npAnng&oh=00_AftYzQVrWk49YLZL-Kb3qiv6B5_H2EjhCxaGEy20-XUNIg&oe=69A39E14",
  },
  {
    name: "Nguyễn Hữu Hưng",
    role: "Head of Design",
    image:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/622060736_1350139400489715_8460117774393119115_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFns2zrRc6Qv9NFESGap7l-7xohHhpxedrvGiEeGnF52vTxHzh_2BitqtxeBBZXQo-aQJyA_6-aCuHBweYwo8nh&_nc_ohc=e7GrHeGSwQEQ7kNvwFbYTnW&_nc_oc=AdleGg48Y9LOudd-ViveyLM8R6QEAZVnLO8K4hG3W_W-0i0Tl-Xz41SsM4bOD8w5QPk&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=x6m0DCB8dx9e-BsTBT_LYw&oh=00_AfusOtVs6_ZuF0vi0bJHtr4pQMfk4oewch9Gn15J975ZbQ&oe=69A39822",
  },
  {
    name: "Lê Thu Hà",
    role: "Brand Strategist",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b py-3">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900">Về chúng tôi</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[520px] overflow-hidden">
        <Image
          src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/622060736_1350139400489715_8460117774393119115_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFns2zrRc6Qv9NFESGap7l-7xohHhpxedrvGiEeGnF52vTxHzh_2BitqtxeBBZXQo-aQJyA_6-aCuHBweYwo8nh&_nc_ohc=e7GrHeGSwQEQ7kNvwFbYTnW&_nc_oc=AdleGg48Y9LOudd-ViveyLM8R6QEAZVnLO8K4hG3W_W-0i0Tl-Xz41SsM4bOD8w5QPk&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=x6m0DCB8dx9e-BsTBT_LYw&oh=00_AfusOtVs6_ZuF0vi0bJHtr4pQMfk4oewch9Gn15J975ZbQ&oe=69A39822"
          alt="TrendVibe Studio"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] mb-4 text-gray-300">
            Câu chuyện của chúng tôi
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
            Thời trang là cách <br />
            <span className="italic">bạn kể câu chuyện</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl font-light leading-relaxed">
            TrendVibe ra đời từ niềm đam mê tạo ra những bộ trang phục làm cho
            con người cảm thấy tự tin và độc đáo mỗi ngày.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-14 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-light tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
                Nguồn gốc thương hiệu
              </p>
              <h2 className="text-3xl md:text-4xl font-light leading-snug mb-6">
                Khởi đầu từ một xưởng nhỏ,{" "}
                <span className="italic">lớn lên cùng đam mê</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Năm 2018, TrendVibe được thành lập tại Hà Nội bởi một nhóm nhỏ
                  những người yêu thời trang với ước mơ đơn giản: tạo ra trang
                  phục mà người Việt thực sự muốn mặc — hiện đại, thoải mái và
                  phản ánh cá tính riêng.
                </p>
                <p>
                  Từ xưởng may nhỏ với 5 thợ lành nghề, chúng tôi đã dần xây
                  dựng nên một thương hiệu được hàng chục nghìn người tin tưởng.
                  Mỗi đường kim mũi chỉ đều mang theo sự tỉ mỉ và tâm huyết của
                  những người thợ.
                </p>
                <p>
                  Hôm nay, TrendVibe tự hào là thương hiệu thời trang nội địa
                  với hơn 200 mẫu thiết kế độc quyền, luôn bắt kịp xu hướng toàn
                  cầu mà vẫn giữ được linh hồn Việt trong từng sản phẩm.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[260px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=500&q=80"
                  alt="Xưởng may"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative h-[260px] mt-8 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80"
                  alt="Thiết kế"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative h-[260px] -mt-8 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
                  alt="Sản phẩm"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative h-[260px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&q=80"
                  alt="Cửa hàng"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
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
              Giá trị cốt lõi
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              Những điều chúng tôi tin tưởng
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white p-8 text-center group hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-gray-900 transition-colors duration-300">
                  <item.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-base mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3">
              Đội ngũ sáng tạo
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              Con người đứng sau TrendVibe
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="relative h-[320px] overflow-hidden mb-5 bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-medium text-base mb-1">{member.name}</h3>
                <p className="text-sm text-gray-400 uppercase tracking-widest">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
              Bắt đầu hành trình
            </p>
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Tìm kiếm phong cách <span className="italic">của bạn</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Hàng trăm thiết kế mới nhất đang chờ bạn khám phá. Hãy để
              TrendVibe giúp bạn tỏa sáng theo cách riêng của mình.
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-none px-10 h-12 text-sm tracking-widest font-normal"
              >
                KHÁM PHÁ CỬA HÀNG
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
