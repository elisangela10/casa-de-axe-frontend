import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { clearToken, getToken } from "../auth/token";

declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiRoot = configuredApiUrl.replace(/\/+$/, "").replace(/\/api$/i, "");

export const API_BASE_URL = `${apiRoot}/api`;

function safeRoute(config?: AxiosRequestConfig) {
  const route = config?.url || "/";
  return route.split("?")[0];
}

function logHttp(method?: string, route?: string, status?: number) {
  if (!import.meta.env.DEV) return;
  console.info("[API]", (method || "GET").toUpperCase(), route || "/", status ?? "network-error");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    logHttp(response.config.method, safeRoute(response.config), response.status);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config;
    logHttp(config?.method, safeRoute(config), status);

    if (status === 401 && config?.requiresAuth !== false) {
      clearToken();
      if (window.location.pathname !== "/login") window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export function isApiErrorStatus(error: unknown, status: number) {
  return axios.isAxiosError(error) && error.response?.status === status;
}

export function getApiErrorMessage(error: unknown, fallback = "Não foi possível concluir a operação.") {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Não foi possível conectar à API. Verifique se o backend está em execução.";

  const status = error.response.status;
  const message = error.response.data && typeof error.response.data === "object"
    ? (error.response.data as { message?: string }).message
    : undefined;

  if (status === 401) return "Sua sessão expirou ou é necessário entrar para realizar esta ação.";
  if (status === 403) return "Você não tem permissão para realizar esta ação.";
  if (status === 404) return "O recurso solicitado não foi encontrado.";
  if (status === 429) return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  if (status === 502) return "O serviço está temporariamente indisponível. Tente novamente mais tarde.";
  if (status === 503) return "O serviço está temporariamente indisponível. Tente novamente mais tarde.";
  return message || fallback;
}

export default api;
