import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BASE_API_URL } from '../constants/api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

type Role = 'admin' | 'student' | 'tutor';

type RoleCfg = {
  tokenKey: string;
  refreshUrl: string;
  redirectTo: string;
  loginIgnore?: string[];
  passThroughMessage?: string;
};

const roleCfg: Record<Role, RoleCfg> = {
  admin: {
    tokenKey: 'adminAccessToken',
    refreshUrl: '/admin/refresh-token',
    redirectTo: '/admin',
  },
  student: {
    tokenKey: 'accessToken',
    refreshUrl: '/student/refresh-token',
    redirectTo: '/student/login',
    loginIgnore: ['/student/login', '/student/google-login'],
  },
  tutor: {
    tokenKey: 'tutorAccessToken',
    refreshUrl: '/tutor/refresh-token',
    redirectTo: '/tutor/login',
    passThroughMessage: 'VERIFICATION_PENDING',
    loginIgnore: ['/tutor/login', '/tutor/google-login'],
  },
};

const singletons: Partial<Record<Role, AxiosInstance>> = {};

export function getAxios(role: Role): AxiosInstance {
  if (singletons[role]) return singletons[role]!;

  const cfg = roleCfg[role];

  const api = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem(cfg.tokenKey);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config || {};

      if (cfg.passThroughMessage && error?.response?.data?.message === cfg.passThroughMessage) {
        return Promise.reject(error);
      }

      const url = originalRequest.url || '';
      if (cfg.loginIgnore?.some((p) => url.includes(p))) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.get(cfg.refreshUrl, {
            baseURL: BASE_API_URL,
            withCredentials: true,
          });

          const newToken: string = data.accessToken;
          localStorage.setItem(cfg.tokenKey, newToken);

          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem(cfg.tokenKey);
          window.location.href = cfg.redirectTo;
          return Promise.reject(refreshErr);
        }
      }
      if (error.response?.status === 403) {
        const msg = error.response?.data?.message;

        if (msg === 'ACCOUNT_BLOCKED') {
          localStorage.removeItem(cfg.tokenKey);

          const url = new URL(cfg.redirectTo, window.location.origin);
          url.searchParams.set('reason', 'blocked');
          window.location.href = url.toString();

          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );

  singletons[role] = api;
  return api;
}
