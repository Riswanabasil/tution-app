import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "/admin/refresh-token",
          {},
          { baseURL: "http://localhost:5000/api", withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("adminAccessToken", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return adminAxios(originalRequest);
      } catch (err) {
        localStorage.removeItem("adminAccessToken");
        window.location.href = "/admin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
