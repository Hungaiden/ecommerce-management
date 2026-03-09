import http from "@/service/http";

export interface CartItemProduct {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  status: string;
}

export interface CartItem {
  _id: string;
  product_id: CartItemProduct;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  _id?: string;
  user_id: string;
  items: CartItem[];
}

// Lấy giỏ hàng
export const getCart = async (): Promise<Cart> => {
  const res = await http.get("/cart");
  return res.data.data;
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (payload: {
  product_id: string;
  quantity?: number;
  size?: string;
  color?: string;
}): Promise<Cart> => {
  const res = await http.post("/cart/add", payload);
  return res.data.data;
};

// Cập nhật item trong giỏ
export const updateCartItem = async (
  itemId: string,
  payload: { quantity?: number; size?: string; color?: string },
): Promise<Cart> => {
  const res = await http.patch(`/cart/update/${itemId}`, payload);
  return res.data.data;
};

// Xoá một sản phẩm khỏi giỏ
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const res = await http.delete(`/cart/remove/${itemId}`);
  return res.data.data;
};

// Xoá toàn bộ giỏ hàng
export const clearCart = async (): Promise<void> => {
  await http.delete("/cart/clear");
};
