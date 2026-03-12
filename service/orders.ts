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
  payment_method: "cash" | "bank_transfer";
}

export interface Order {
  _id: string;
  order_code: string;
  user_id: string;
  items: OrderItem[];
  contact_info: ContactInfo;
  note?: string;
  total_price: number;
  payment_method: string;
  payment_status: string;
  status: string;
  createdAt: string;
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
