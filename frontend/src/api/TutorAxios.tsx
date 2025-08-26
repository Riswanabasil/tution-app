// import axios from "axios";
// import { BASE_API_URL } from "../constants/api";

// const tutorAxios = axios.create({
//   baseURL: BASE_API_URL,
//   withCredentials: true,
// });

// tutorAxios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("tutorAccessToken");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// tutorAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {

//     const message = error?.response?.data?.message;
//     if (message === "VERIFICATION_PENDING") {
//       return Promise.reject(error);
//     }
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.get(
//           "/tutor/refresh-token",
//           {
//             baseURL: BASE_API_URL,
//             withCredentials: true,
//           }
//         );

//         const newToken = res.data.accessToken;
//         localStorage.setItem("tutorAccessToken", newToken);
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

//         return tutorAxios(originalRequest);
//       } catch (err) {
//         localStorage.removeItem("tutorAccessToken");
//         window.location.href = "/tutor/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default tutorAxios;
