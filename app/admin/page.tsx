"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "@/service/admin/dashboard";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

const BOOKING_COLORS = {
  completed: "#22c55e",
  pending: "#f59e0b",
  cancelled: "#ef4444",
};

const PRODUCT_COLORS = {
  active: "#6366f1",
  inactive: "#94a3b8",
};

function StatCard({
  title,
  value,
  sub,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
      <div className={`rounded-full p-3 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4 animate-pulse">
      <div className="rounded-full bg-gray-200 h-12 w-12 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setError("Không thể tải dữ liệu dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const bookingChartData = data
    ? [
        {
          name: "Hoàn thành",
          value: data.totalBooking.completed,
          fill: BOOKING_COLORS.completed,
        },
        {
          name: "Chờ xử lý",
          value: data.totalBooking.pending,
          fill: BOOKING_COLORS.pending,
        },
        {
          name: "Đã huỷ",
          value: data.totalBooking.cancelled,
          fill: BOOKING_COLORS.cancelled,
        },
      ]
    : [];

  const productChartData = data
    ? [
        {
          name: "Đang bán",
          value: data.totalProduct.active,
          fill: PRODUCT_COLORS.active,
        },
        {
          name: "Ẩn",
          value: data.totalProduct.inactive,
          fill: PRODUCT_COLORS.inactive,
        },
      ]
    : [];

  const barData = data
    ? [
        {
          name: "Đơn hàng",
          "Hoàn thành": data.totalBooking.completed,
          "Chờ xử lý": data.totalBooking.pending,
          "Đã huỷ": data.totalBooking.cancelled,
        },
        {
          name: "Sản phẩm",
          "Đang bán": data.totalProduct.active,
          Ẩn: data.totalProduct.inactive,
        },
      ]
    : [];

  return (
    <div className="flex flex-col">
      <AdminHeader title="Dashboard" description="Tổng quan hệ thống" />

      <div className="flex-1 space-y-6 p-6">
        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : data ? (
            <>
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(data.totalRevenue)}
                sub="Từ tất cả đơn hàng"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-indigo-500"
              />
              <StatCard
                title="Tổng đơn hàng"
                value={data.totalBooking.total}
                sub={`${data.totalBooking.completed} hoàn thành · ${data.totalBooking.pending} chờ`}
                icon={<ShoppingBag className="h-6 w-6 text-white" />}
                color="bg-amber-500"
              />
              <StatCard
                title="Sản phẩm"
                value={data.totalProduct.total}
                sub={`${data.totalProduct.active} đang bán · ${data.totalProduct.inactive} ẩn`}
                icon={<Package className="h-6 w-6 text-white" />}
                color="bg-violet-500"
              />
              <StatCard
                title="Tài khoản"
                value={data.totalAccounts}
                sub="Khách hàng đã đăng ký"
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-emerald-500"
              />
            </>
          ) : null}
        </div>

        {/* Charts row */}
        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar chart */}
            <div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                Thống kê đơn hàng &amp; sản phẩm
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Hoàn thành"
                    fill={BOOKING_COLORS.completed}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Chờ xử lý"
                    fill={BOOKING_COLORS.pending}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Đã huỷ"
                    fill={BOOKING_COLORS.cancelled}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Đang bán"
                    fill={PRODUCT_COLORS.active}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Ẩn"
                    fill={PRODUCT_COLORS.inactive}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                Trạng thái đơn hàng
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={bookingChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} đơn`} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-2 space-y-2">
                {[
                  {
                    label: "Hoàn thành",
                    value: data.totalBooking.completed,
                    color: BOOKING_COLORS.completed,
                    icon: CheckCircle,
                  },
                  {
                    label: "Chờ xử lý",
                    value: data.totalBooking.pending,
                    color: BOOKING_COLORS.pending,
                    icon: Clock,
                  },
                  {
                    label: "Đã huỷ",
                    value: data.totalBooking.cancelled,
                    color: BOOKING_COLORS.cancelled,
                    icon: XCircle,
                  },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color }} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product status row */}
        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie - products */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                Trạng thái sản phẩm
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={productChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {productChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} sản phẩm`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {[
                  {
                    label: "Đang bán",
                    value: data.totalProduct.active,
                    color: PRODUCT_COLORS.active,
                  },
                  {
                    label: "Ẩn",
                    value: data.totalProduct.inactive,
                    color: PRODUCT_COLORS.inactive,
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="text-gray-600">{label}</span>
                    </div>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick summary cards */}
            <div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                Tóm tắt nhanh
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Doanh thu",
                    value: formatCurrency(data.totalRevenue),
                    bg: "bg-indigo-50",
                    text: "text-indigo-700",
                  },
                  {
                    label: "Tổng đơn",
                    value: `${data.totalBooking.total} đơn`,
                    bg: "bg-amber-50",
                    text: "text-amber-700",
                  },
                  {
                    label: "Sản phẩm đang bán",
                    value: `${data.totalProduct.active} SP`,
                    bg: "bg-violet-50",
                    text: "text-violet-700",
                  },
                  {
                    label: "Khách hàng",
                    value: `${data.totalAccounts} TK`,
                    bg: "bg-emerald-50",
                    text: "text-emerald-700",
                  },
                ].map(({ label, value, bg, text }) => (
                  <div key={label} className={`rounded-lg ${bg} p-4`}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`text-lg font-bold ${text} mt-1`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
