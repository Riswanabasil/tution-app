import axios from "axios";
import { BASE_API_URL } from "../constants/api";

const instance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/student/login") &&
      !originalRequest.url.includes("/student/google-login")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await instance.post(
          "/student/refresh-token",
          {},
          {
            baseURL: BASE_API_URL,
            withCredentials: true,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/student/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
export default instance;
