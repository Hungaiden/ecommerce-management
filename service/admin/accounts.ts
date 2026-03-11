import http from "../http";

export type AccountRole = "admin" | "staff" | "customer";
export type AccountStatus = "active" | "inactive" | "suspended";

export interface Account {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role_id: AccountRole;
  status: AccountStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAccountsParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  sortBy?: string;
  sortType?: "asc" | "desc";
}

export interface AccountsResponse {
  hits: Account[];
  pagination: { totalRows: number; totalPages: number };
}

export const adminGetAllAccounts = async (
  params?: GetAccountsParams,
): Promise<AccountsResponse> => {
  const response = await http.get("/accounts", { params });
  return response.data.data;
};

export const adminGetAccountById = async (id: string): Promise<Account> => {
  const response = await http.get(`/accounts/detail/${id}`);
  return response.data.data;
};

export const adminUpdateAccount = async (
  id: string,
  payload: Partial<Pick<Account, "fullName" | "phone" | "role_id" | "status">>,
): Promise<Account> => {
  const response = await http.patch(`/accounts/update/${id}`, payload);
  return response.data.data;
};

export const adminDeleteAccount = async (id: string): Promise<void> => {
  await http.delete(`/accounts/deleteOne/${id}`);
};
