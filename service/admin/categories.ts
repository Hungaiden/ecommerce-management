import http from "../http";

export interface Category {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "inactive";
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCategoriesParams {
  offset?: number;
  limit?: number;
}

export interface CategoriesResponse {
  hits: Category[];
  pagination: {
    totalRows: number;
    totalPages: number;
  };
}

export interface CreateCategoryPayload {
  title: string;
  description?: string;
  status: "active" | "inactive";
  position: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ─── Lấy danh sách danh mục ─────────────────────────────────────────────────
export const getCategories = async (
  params?: GetCategoriesParams,
): Promise<CategoriesResponse> => {
  const response = await http.get("/product-categories", { params });
  return response.data.data;
};

// ─── Lấy chi tiết danh mục ──────────────────────────────────────────────────
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await http.get(`/product-categories/detail/${id}`);
  return response.data.data;
};

// ─── Tạo danh mục mới ────────────────────────────────────────────────────────
export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const response = await http.post("/product-categories/create", payload);
  return response.data.data;
};

// ─── Cập nhật danh mục ───────────────────────────────────────────────────────
export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> => {
  const response = await http.patch(
    `/product-categories/update/${id}`,
    payload,
  );
  return response.data.data;
};

// ─── Xóa danh mục ────────────────────────────────────────────────────────────
export const deleteCategory = async (id: string): Promise<void> => {
  await http.delete(`/product-categories/delete/${id}`);
};
