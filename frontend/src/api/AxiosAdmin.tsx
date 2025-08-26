// import axios from "axios";
// import { BASE_API_URL } from "../constants/api"

// const adminAxios = axios.create({
//   baseURL: BASE_API_URL,
//   withCredentials: true,
// });

// adminAxios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminAccessToken");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });


// adminAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.get(
//           "/admin/refresh-token",
//           { baseURL: BASE_API_URL, withCredentials: true }
//         );

//         const newToken = res.data.accessToken;
//         localStorage.setItem("adminAccessToken", newToken);
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         return adminAxios(originalRequest);
//       } catch (err) {
//         localStorage.removeItem("adminAccessToken");
//         window.location.href = "/admin";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default adminAxios;
