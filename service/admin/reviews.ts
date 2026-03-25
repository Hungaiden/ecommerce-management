import http from '../http';

export interface ProductReviewRef {
  _id: string;
  name?: string;
  sku?: string;
}

export interface UserReviewRef {
  _id: string;
  fullName?: string;
  fullname?: string;
  full_name?: string;
  name?: string;
  username?: string;
  email?: string;
}

export interface ProductReview {
  _id: string;
  product_id: string | ProductReviewRef;
  user_id: string | UserReviewRef;
  rating: number;
  comment?: string;
  images?: string[];
  size?: string;
  color?: string;
  is_approved: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetReviewsParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  field?: string;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
}

export interface ReviewsResponse {
  hits: ProductReview[];
  pagination: { totalRows: number; totalPages: number };
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
  is_approved?: boolean;
}

export const adminGetProductReviews = async (
  params?: GetReviewsParams,
): Promise<ReviewsResponse> => {
  const response = await http.get('/products/reviews', { params });
  return response.data.data;
};

export const adminApproveProductReview = async (id: string): Promise<ProductReview> => {
  const response = await http.patch(`/products/reviews/approve/${id}`);
  return response.data.data;
};

export const adminUpdateProductReview = async (
  id: string,
  payload: UpdateReviewPayload,
): Promise<ProductReview> => {
  const response = await http.patch(`/products/reviews/update/${id}`, payload);
  return response.data.data;
};

export const adminDeleteProductReview = async (id: string): Promise<void> => {
  await http.delete(`/products/reviews/delete/${id}`);
};
