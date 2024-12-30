import { AxiosInstance } from 'axios';

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance; // Deklarasikan tipe untuk $axios
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance; // Agar $axios dikenali di komponen Vue
  }
}
