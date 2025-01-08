import { defineStore } from "pinia";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

export const useMyJadwalStore = defineStore({
  id: "myJadwalStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: ["Ruangan", "Tanggal", "Mulai", "Selesai", "Aksi"],
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
          .post("/jadwal", payload)
          .then((response) => {
            this.responseData = response.data;
            console.log(response);

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
          .get("/data-jadwal", { params: payload })
          .then((response) => {
            this.responseData = response.data;

            this.responseData?.data.data.forEach(
              (element: {
                id: any;
                nama_ruangan: any;
                aktivitas: any;
                tanggal: any;
                mulai: any;
                selesai: any;
                ruangan: any;
              }) => {
                let tempData = {
                  id: element.id,
                  nama_ruangan: element.nama_ruangan,
                  aktivitas: element.aktivitas,
                  tanggal: element.tanggal,
                  mulai: element.mulai,
                  selesai: element.selesai,
                  id_ruangan: element.ruangan.id,
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
            // reject(error.response.data)
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
          .put("/jadwal", payload)
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
