import { useMyAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useMyAuthStore();

  if (authStore.isTokenExpired && to.path !== "/masuk") {
    authStore.clearToken();
    return navigateTo("/masuk");
  }
});
