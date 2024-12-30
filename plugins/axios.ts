import axios, { type AxiosInstance } from "axios";
import { useRuntimeConfig } from "#app";
import { useRouter } from "vue-router";
import { useMyAuthStore } from "@/store/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const store = useMyAuthStore();
  const router = useRouter(); // Tambahkan router

  console.log(store.token);

  let axiosInstance: AxiosInstance;

  axiosInstance = axios.create({
    baseURL: runtimeConfig.public.axios.baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.token}`,
    },
  });

  const updateAuthHeader = () => {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${store.token}`;
  };

  updateAuthHeader();
  store.$subscribe(() => {
    updateAuthHeader();
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: 401 Error");

        router.push("/masuk");
        return Promise.reject(error);
      }

      return await Promise.reject(error);
    }
  );

  nuxtApp.provide("axios", axiosInstance);
});
