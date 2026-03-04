import http, { ResList } from "../http";
import type { Product, GetProductsParams } from "../products";

export type { Product, GetProductsParams };

export interface CreateProductPayload {
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  price: number;
  discount?: number;
  images?: string[];
  thumbnail?: string;
  brand?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  stock: number;
  isFeatured?: boolean;
  status?: "active" | "inactive" | "out_of_stock";
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ─── Lấy danh sách sản phẩm (admin - có thể lấy cả inactive) ───────────────
export const adminGetProducts = async (
  params?: GetProductsParams,
): Promise<ResList> => {
  const response = await http.get("/admin/products", { params });
  return response.data.data;
};

// ─── Lấy chi tiết 1 sản phẩm ────────────────────────────────────────────────
export const adminGetProduct = async (id: string): Promise<Product> => {
  const response = await http.get(`/admin/products/detail/${id}`);
  return response.data.data;
};

// ─── Tạo sản phẩm mới ───────────────────────────────────────────────────────
export const adminCreateProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const response = await http.post("/admin/products/create", payload);
  return response.data.data;
};

// ─── Cập nhật sản phẩm ──────────────────────────────────────────────────────
export const adminUpdateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const response = await http.patch(`/admin/products/update/${id}`, payload);
  return response.data.data;
};

// ─── Xóa sản phẩm ───────────────────────────────────────────────────────────
export const adminDeleteProduct = async (id: string): Promise<Product> => {
  const response = await http.delete(`/admin/products/deleteOne/${id}`);
  return response.data.data;
};
