import http from "./http";

export interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const subscribeNewsletter = async (
  email: string,
): Promise<Subscriber> => {
  const response = await http.post("/subscribe", { email });
  return response.data.data;
};
