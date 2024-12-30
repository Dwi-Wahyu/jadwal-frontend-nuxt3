import { useMyAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useMyAuthStore();

  const token = store.token;
  if (!token && to.path !== "/masuk") {
    return navigateTo("/masuk");
  }
});
