import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/userSlice";
import { toast } from "sonner";
import SummaryApi from "@/common/SummaryApi";

export const baseURL = import.meta.env.VITE_SERVER_URL;

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// ===== Token Refresh Control =====
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// ===== Request Interceptor =====
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response Interceptor =====
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const newAccessToken = await refreshAccessToken(refreshToken);

          if (!newAccessToken) {
            throw new Error("No access token received");
          }

          localStorage.setItem("accessToken", newAccessToken);
          onRefreshed(newAccessToken);
        } catch (err) {
          store.dispatch(logout()); // ✅ Redux logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          toast.error("Session expired. Please login again.");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(Axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// ===== Refresh Token Function =====
const refreshAccessToken = async (refreshToken: string | null) => {
  if (!refreshToken) return null;
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data?.data?.accessToken;
  } catch (error) {
    console.log("Refresh token failed", error);
    return null;
  }
};

export default Axios;
