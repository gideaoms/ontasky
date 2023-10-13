import { COOKIE_NAME } from "@/constants";
import { UserModel } from "@/core/models";
import { API_URL } from "@/envs";
import axios from "axios";

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: API_URL,
  validateStatus(status) {
    return status < 500;
  },
});

api.interceptors.request.use(async function (config) {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const token = cookies().get(COOKIE_NAME)?.value;
    if (token) {
      config.headers.setAuthorization(`Bearer ${token}`);
    }
  }
  return config;
});

export function setToken(user: UserModel.Model) {
  api.defaults.headers.common.Authorization = `Bearer ${user.token}`;
}
