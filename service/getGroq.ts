import type { Product } from "./products";
import http from "./http";

interface RecommendProductRequest {
  message: string;
  context?: string;
}

interface RecommendProductResponse {
  products: Product[];
}

export const getGroq = {
  recommendProduct: async (
    params: RecommendProductRequest,
  ): Promise<RecommendProductResponse> => {
    const response = await http.post<RecommendProductResponse>(
      "/groq/recommend-product",
      params,
    );
    return response.data;
  },
};
