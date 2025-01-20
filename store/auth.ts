import { defineStore } from "pinia";
import { useAxios } from "@/composables/useAxios";
import { jwtDecode } from "jwt-decode";

interface ErrorData {
  msg: string;
  data: any;
  status: string;
}
type User = {
  email: string;
  nama: string;
  role: string;
};

export const useMyAuthStore = defineStore("myAuthStore", {
  state: () => ({
    orgName: "Fakultas Kedokteran Gigi Universitas Hasanuddin",
    appName: "eJadwal",
    appDesc: "Aplikasi Jadwal Fakultas Kedokteran Gigi Universitas Hasanuddin",
    token: "",
    user: null as User | null,
    alwaysLogin: false,
    error: false,
    error_data: null as ErrorData | null,
  }),
  persist: true,
  getters: {
    isTokenExpired(state): boolean {
      if (!state.token) return true;

      try {
        const decoded: { exp: number } = jwtDecode(state.token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      } catch (e) {
        return true;
      }
    },
  },
  actions: {
    async login(credentials: {
      email: string;
      password: string;
      alwaysLogin: any;
    }) {
      this.error = false;
      this.error_data = null;
      const axios = useAxios();

      return new Promise((resolve, reject) => {
        axios
          .post("/auth/login", credentials)
          .then((response) => {
            // this.me()
            this.alwaysLogin = credentials.alwaysLogin;
            this.token = response.data.token;
            this.user = response.data.user;
            resolve(response);
          })
          .catch((error: any) => {
            console.log(error.response.data);
            this.error = true;
            this.error_data = error.response.data;
            reject(error);
          });
      });
    },

    async clearToken() {
      this.token = "";
    },
  },
});
