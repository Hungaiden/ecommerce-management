import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ecommerce-management-be.vercel.app";

// Tạo instance Axios với cấu hình mặc định
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn accessToken vào header mỗi request
http.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default http;

export interface ResList {
  hits?: any[];
  pagination?: {
    totalRows?: number;
    totalPages?: number;
  };
}
