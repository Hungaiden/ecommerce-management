import http from '../http';

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  discount?: number;
  size?: string;
  color?: string;
  quantity: number;
  subtotal: number;
  thumbnail?: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'vnpay' | 'momo' | 'cash' | 'bank_transfer';

export interface Order {
  _id: string;
  user_id?: { _id: string; fullName: string; email: string; avatar?: string };
  items: OrderItem[];
  contact_info: ContactInfo;
  note?: string;
  total_price: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  transaction_code?: string;
  payment_time?: string;
  deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetOrdersParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  payment_status?: string;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
}

export interface OrdersResponse {
  hits: Order[];
  pagination: { totalRows: number; totalPages: number };
}

export const adminGetAllOrders = async (params?: GetOrdersParams): Promise<OrdersResponse> => {
  const response = await http.get('/products/bookings/getAll', { params });
  return response.data.data;
};

export const adminGetOrderById = async (id: string): Promise<Order> => {
  const response = await http.get(`/products/bookings/detail/${id}`);
  return response.data.data;
};

export const adminUpdateOrder = async (
  id: string,
  payload: { status?: OrderStatus; payment_status?: PaymentStatus },
): Promise<Order> => {
  const response = await http.patch(`/products/bookings/update/${id}`, payload);
  return response.data.data;
};

export const adminDeleteOrder = async (id: string): Promise<void> => {
  await http.delete(`/products/bookings/delete/${id}`);
};
