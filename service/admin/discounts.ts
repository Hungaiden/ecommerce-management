import http from '../http';

export interface Discount {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  isActive: boolean;
  status: 'active' | 'inactive' | 'expired' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DiscountResponse {
  hits: Discount[];
  pagination: {
    totalRows: number;
    limit: number;
    offset: number;
  };
}

export interface ValidateDiscountResponse {
  discountId: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  remainingUses?: number;
}

export interface ActiveDiscountProgramResponse {
  hit: Discount | null;
}

// Get all discounts (admin)
export const adminGetDiscounts = async (params?: {
  limit?: number;
  offset?: number;
  status?: string;
  isActive?: boolean;
  keyword?: string;
}): Promise<DiscountResponse> => {
  const response = await http.get('/discounts', { params });
  return response.data;
};

// Get single discount (admin)
export const adminGetDiscount = async (id: string): Promise<Discount> => {
  const response = await http.get(`/discounts/${id}`);
  return response.data;
};

// Create discount (admin)
export const adminCreateDiscount = async (data: Partial<Discount>): Promise<Discount> => {
  const response = await http.post('/discounts', data);
  return response.data;
};

// Update discount (admin)
export const adminUpdateDiscount = async (
  id: string,
  data: Partial<Discount>,
): Promise<Discount> => {
  const response = await http.put(`/discounts/${id}`, data);
  return response.data;
};

// Delete discount (admin)
export const adminDeleteDiscount = async (id: string): Promise<{ message: string }> => {
  const response = await http.delete(`/discounts/${id}`);
  return response.data;
};

// Validate discount code (client)
export const validateDiscountCode = async (
  code: string,
  totalAmount: number,
): Promise<ValidateDiscountResponse> => {
  const response = await http.post('/discounts/validate', { code, totalAmount });
  return response.data;
};

// Increment discount usage (after order)
export const incrementDiscountUsage = async (discountId: string): Promise<Discount> => {
  const response = await http.post(`/discounts/${discountId}/increment-usage`);
  return response.data;
};

export const getActiveDiscountProgram = async (): Promise<Discount | null> => {
  const response = await http.get<ActiveDiscountProgramResponse>('/discounts/active-program');
  return response.data.hit;
};
