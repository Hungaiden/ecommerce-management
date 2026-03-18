import http from "../http";

export interface DashboardSummary {
  totalRevenue: number;
  totalBooking: {
    total: number;
    pending: number;
    confirmed: number;
    shipping: number;
    delivered: number;
    cancelled: number;
  };
  totalProduct: {
    total: number;
    active: number;
    inactive: number;
    out_of_stock: number;
  };
  totalAccounts: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await http.get("/dashboard/summary");
  return response.data.data;
};
