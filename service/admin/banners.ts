import http from '../http';

export interface Banner {
  _id?: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerListResponse {
  code: number;
  message: string;
  data: {
    hits: Banner[];
    pagination: {
      total: number;
      offset: number;
      limit: number;
    };
  };
}

export interface BannerDetailResponse {
  code: number;
  message: string;
  data: Banner;
}

// Get all banners (admin)
export const getAllBanners = async (
  isActive?: boolean,
  offset: number = 0,
  limit: number = 20,
): Promise<BannerListResponse> => {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('isActive', String(isActive));
  params.append('offset', String(offset));
  params.append('limit', String(limit));

  const response = await http.get(`/banners?${params.toString()}`);
  return response.data;
};

// Get active banners (public)
export const getActiveBanners = async (): Promise<BannerListResponse> => {
  const response = await http.get('/banners/public/active');
  return response.data;
};

// Get single banner by ID
export const getBannerById = async (id: string): Promise<BannerDetailResponse> => {
  const response = await http.get(`/banners/${id}`);
  return response.data;
};

// Create new banner
export const createBanner = async (data: FormData | Banner): Promise<BannerDetailResponse> => {
  const response = await http.post('/banners', data);
  return response.data;
};

// Update banner
export const updateBanner = async (
  id: string,
  data: FormData | Partial<Banner>,
): Promise<BannerDetailResponse> => {
  const response = await http.patch(`/banners/${id}`, data);
  return response.data;
};

// Delete banner
export const deleteBanner = async (id: string): Promise<BannerDetailResponse> => {
  const response = await http.delete(`/banners/${id}`);
  return response.data;
};
