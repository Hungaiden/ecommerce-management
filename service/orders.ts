import http from "./http";

export interface OrderItem {
  product_id: string;
  name: string;
  thumbnail: string;
  price: number;
  discount: number;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  contact_info: ContactInfo;
  note?: string;
  total_price: number;
  payment_method: "cash" | "bank_transfer" | "vnpay";
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "vnpay" | "momo" | "cash" | "bank_transfer";

export interface Order {
  _id: string;
  order_code?: string;
  user_id: string;
  items: OrderItem[];
  contact_info: ContactInfo;
  note?: string;
  total_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface GetMyOrdersParams {
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortType?: "asc" | "desc";
}

export interface MyOrdersResponse {
  hits: Order[];
  pagination: {
    totalRows: number;
    totalPages: number;
  };
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const response = await http.post<{ data: Order }>(
    "/products/bookings/create",
    payload,
  );
  return response.data.data;
};

export const getMyOrders = async (
  userId: string,
  params?: GetMyOrdersParams,
): Promise<MyOrdersResponse> => {
  const response = await http.get(`/products/bookings/user/${userId}`, {
    params,
  });
  return response.data.data;
};
