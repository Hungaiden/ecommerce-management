import http from "../http";

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  thumbnail?: string;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  _id: string;
  product_id: CartProduct | null;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartUser {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface AdminCart {
  _id: string;
  user_id: CartUser | null;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCartsResponse {
  hits: AdminCart[];
  pagination: {
    totalRows: number;
    totalPages: number;
  };
}

// Lấy danh sách tất cả giỏ hàng
export const adminGetAllCarts = async (params?: {
  offset?: number;
  limit?: number;
  keyword?: string;
}): Promise<AdminCartsResponse> => {
  const response = await http.get("/admin-carts", { params });
  return response.data.data;
};

// Lấy giỏ hàng của 1 user
export const adminGetCartByUser = async (
  userId: string,
): Promise<AdminCart> => {
  const response = await http.get(`/admin-carts/${userId}`);
  return response.data.data;
};

// Xoá toàn bộ giỏ hàng của user
export const adminClearUserCart = async (userId: string): Promise<void> => {
  await http.delete(`/admin-carts/${userId}/clear`);
};

// Xoá 1 item khỏi giỏ hàng của user
export const adminRemoveCartItem = async (
  userId: string,
  itemId: string,
): Promise<AdminCart> => {
  const response = await http.delete(`/admin-carts/${userId}/item/${itemId}`);
  return response.data.data;
};
