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

// ─── Lấy danh sách sản phẩm ─────────────────────────────────────────────────
export const adminGetProducts = async (
  params?: GetProductsParams,
): Promise<ResList> => {
  const response = await http.get("/products", { params });
  return response.data.data;
};

// ─── Lấy chi tiết 1 sản phẩm ────────────────────────────────────────────────
export const adminGetProduct = async (id: string): Promise<Product> => {
  const response = await http.get(`/products/detail/${id}`);
  return response.data.data;
};

// ─── Tạo sản phẩm mới ───────────────────────────────────────────────────────
export const adminCreateProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const response = await http.post("/products/create", payload);
  return response.data.data;
};

// ─── Cập nhật sản phẩm ──────────────────────────────────────────────────────
export const adminUpdateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const response = await http.patch(`/products/update/${id}`, payload);
  return response.data.data;
};

// ─── Xóa sản phẩm ───────────────────────────────────────────────────────────
export const adminDeleteProduct = async (id: string): Promise<Product> => {
  const response = await http.delete(`/products/deleteOne/${id}`);
  return response.data.data;
};

// ─── Import sản phẩm từ Excel ────────────────────────────────────────────────
export interface ImportProductResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export const adminImportProducts = async (
  file: File,
): Promise<ImportProductResult> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await http.post("/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
