import http, { ResList } from '../http';

export interface ReviewData {
  _id?: string;
  product_id: string;
  user_id?: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  images?: string[];
  size?: string;
  color?: string;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id_data?: {
    fullName: string;
    avatar?: string;
  };
}

export interface CreateReviewParams {
  product_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  size?: string;
  color?: string;
}

export interface GetReviewsParams {
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
}

// Lấy danh sách đánh giá của sản phẩm
export const getProductReviews = async (productId: string, params?: GetReviewsParams) => {
  try {
    const response = await http.get<{
      code: number;
      message: string;
      data: ResList;
    }>(`/product-reviews/${productId}`, {
      params,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Tạo đánh giá mới
export const createReview = async (reviewData: CreateReviewParams) => {
  try {
    const response = await http.post<{
      code: number;
      message: string;
      data: ReviewData;
    }>('/product-reviews', reviewData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (reviewId: string, reviewData: Partial<CreateReviewParams>) => {
  try {
    const response = await http.patch<{
      code: number;
      message: string;
      data: ReviewData;
    }>(`/product-reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Xóa đánh giá
export const deleteReview = async (reviewId: string) => {
  try {
    const response = await http.delete<{
      code: number;
      message: string;
      data: ReviewData;
    }>(`/product-reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
