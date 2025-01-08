import { defineStore } from "pinia";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

export const useMyPenggunaStore = defineStore({
  id: "myPenggunaStore",
  state: () => ({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    data: [] as any[],
    totalDatas: 5,
    tableHeaders: ["Nama Pengguna", "Email", "Role", "Aksi"],
    step: 1,
    error: false,
    error_data: null as ResData | null,
    responseData: null as ResData | null,
    loading: false,
  }),
  actions: {
    async sendData(payload: any) {
      this.responseData = null;
      this.error = false;
      this.error_data = null;
      const axios = useAxios();

      return new Promise((resolve, reject) => {
        axios
          .post("/pengguna", payload)
          .then((response) => {
            this.responseData = response.data;

            resolve(response.data);
          })
          .catch((error) => {
            this.error = true;
            this.error_data = error.response.data;
            reject(error.response.data);
          });
      });
    },

    async getData(payload: any) {
      this.loading = true;
      this.responseData = null;
      this.error = false;
      this.error_data = null;
      this.data = [];
      const axios = useAxios();

      return new Promise((resolve, reject) => {
        axios
          .get("/pengguna", { params: payload })
          .then((response) => {
            this.responseData = response.data;

            this.responseData?.data.data.forEach(
              (element: { id: any; nama: any; role: any; email: any }) => {
                let tempData = {
                  id: element.id,
                  nama: element.nama,
                  role: element.role,
                  email: element.email,
                };

                this.data.push(tempData);
              }
            );

            this.currentPage = this.responseData?.data.currentPage;
            this.totalPages = this.responseData?.data.totalPages;
            this.totalDatas = this.responseData?.data.totalDatas;
            this.loading = false;

            resolve(this.data);
          })
          .catch((error) => {
            this.error = true;
            this.error_data = error.response.data;
            this.loading = false;
          });
      });
    },

    async updateData(payload: any) {
      this.responseData = null;
      this.error = false;
      this.error_data = null;
      const axios = useAxios();

      return new Promise((resolve, reject) => {
        axios
          .put("/pengguna", payload)
          .then((response) => {
            this.responseData = response.data;

            resolve(response.data);
          })
          .catch((error) => {
            this.error = true;
            this.error_data = error.response.data;
            reject(error.response.data);
          });
      });
    },
  },
});
