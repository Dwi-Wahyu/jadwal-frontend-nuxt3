import { defineStore } from 'pinia'
import { useAxios } from '@/composables/useAxios';
interface ErrorData {
  msg: string;
  data: any;
  status: string;
}
export const useMyAuthStore = defineStore('myAuthStore', {
  state: () => ({
    orgName: "Desa Garing Kabupaten Gowa",
    appName: "eData Garing",
    appDesc: "Aplikasi Analisis Data Eksploratori Pada Desa Garing Kecamatan Tompobulu",
    welcomeText: "Selamat Datang",
    welcomeDesc: "Silahkan masukkan email dan password untuk masuk ke aplikasi.",
    loginText: "Login Ke Aplikasi eData Ddesa Garing",
    token: '',
    user: null,
    alwaysLogin: false,
    error: false,
    error_data: null as ErrorData | null
  }),
  persist: true,
  actions: {
    async login(credentials : {email : string, password: string,alwaysLogin: any}) {
      this.error = false
      this.error_data = null
      const axios = useAxios()
      
      return new Promise((resolve,reject) => {
        axios.post('/auth/login',credentials).then((response) => {
          // this.me()
          this.alwaysLogin = credentials.alwaysLogin
          console.log(response.data)
          this.token = response.data.access_token
          resolve(resolve)
        }).catch((error : any) => {
          console.log(error.response.data)
          this.error = true
          this.error_data = error.response.data
          reject(error)
        })
      })
    },
    async me() {
      const axios = useAxios()
      
      return new Promise((resolve,reject) => {
        axios.post('/auth/me').then((response) => {
          this.user = response.data
          resolve(resolve)
        }).catch((error : any) => {
          reject(error)
        })
      })
    },
    async refresh() {
      const axios = useAxios()
      
      return new Promise((resolve,reject) => {
        axios.post('/auth/refresh').then((response) => {
          // this.user = response.data
          this.token = response.data.access_token
          resolve(resolve)
        }).catch((error : any) => {
          reject(error)
        })
      })
    }
  }
});
