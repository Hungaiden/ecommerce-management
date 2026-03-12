import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

// Tạo instance Axios với cấu hình mặc định
const http: AxiosInstance = axios.create({
  // baseURL: "https://book-tour-khaki.vercel.app",
  baseURL: "http://localhost:3000",
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
