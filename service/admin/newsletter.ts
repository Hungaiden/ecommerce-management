import http from "../http";

export interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  title: string;
  subject: string;
  content: string;
  status: "draft" | "sent";
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListResponse<T> {
  hits: T[];
  pagination: {
    totalRows: number;
    totalPages: number;
  };
}

export interface GetSubscribersParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  isActive?: boolean;
}

export interface GetCampaignsParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  status?: "draft" | "sent";
}

export const adminGetSubscribers = async (
  params?: GetSubscribersParams,
): Promise<ListResponse<Subscriber>> => {
  const response = await http.get("/newsletter/subscribers", { params });
  return response.data.data;
};

export const adminUpdateSubscriberStatus = async (
  id: string,
  isActive: boolean,
): Promise<Subscriber> => {
  const response = await http.patch(`/newsletter/subscribers/${id}/status`, {
    isActive,
  });
  return response.data.data;
};

export const adminGetCampaigns = async (
  params?: GetCampaignsParams,
): Promise<ListResponse<Campaign>> => {
  const response = await http.get("/newsletter/campaigns", { params });
  return response.data.data;
};

export const adminCreateCampaign = async (payload: {
  title: string;
  subject: string;
  content: string;
}): Promise<Campaign> => {
  const response = await http.post("/newsletter/campaigns", payload);
  return response.data.data;
};

export const adminSendCampaign = async (
  id: string,
): Promise<{ campaign: Campaign; sentCount: number }> => {
  const response = await http.post(`/newsletter/campaigns/${id}/send`);
  return response.data.data;
};
