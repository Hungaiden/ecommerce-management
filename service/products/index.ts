import http, { ResList } from "../http";

export interface ProductCategory {
  _id: string;
  title: string;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  price: number;
  discount?: number;
  images?: string[];
  thumbnail?: string;
  brand?: string;
  category?: ProductCategory | string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  stock: number;
  sold?: number;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  status?: "active" | "inactive" | "out_of_stock";
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProductsParams {
  offset?: number;
  limit?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortType?: "asc" | "desc";
  keyword?: string;
  field?: string;
}

export const getProducts = async (
  params?: GetProductsParams,
): Promise<ResList> => {
  const response = await http.get("/products", { params });
  return response.data.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await http.get(`/products/detail/${id}`);
  return response.data.data;
};

export const getProductsByCategory = async (
  category: string,
  params?: Omit<GetProductsParams, "category">,
): Promise<ResList> => {
  const response = await http.get(
    `/products/category/${encodeURIComponent(category)}`,
    { params },
  );
  return response.data.data;
};
