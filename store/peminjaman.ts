import moment from "moment";
import { defineStore } from "pinia";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

export const useMyPeminjamanStore = defineStore({
  id: "myPeminjamanStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: [
      "Ruangan",
      "Tanggal",
      "Penanggung Jawab",
      "Mulai",
      "Selesai",
      "Status",
      "Aksi",
    ],
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
          .post("/peminjaman", payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
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
          .get("/peminjaman/data", { params: payload })
          .then((response) => {
            this.responseData = response.data;

            this.responseData?.data.data.forEach(
              (element: {
                id: any;
                nama_ruangan: any;
                instansi: any;
                surat_permohonan: any;
                aktivitas: any;
                tanggal: any;
                penanggung_jawab: any;
                mulai: any;
                selesai: any;
                status: any;
              }) => {
                let tempData = {
                  id: element.id,
                  nama_ruangan: element.nama_ruangan,
                  instansi: element.instansi,
                  surat_permohonan: element.surat_permohonan,
                  aktivitas: element.aktivitas,
                  tanggal: element.tanggal,
                  penanggung_jawab: element.penanggung_jawab,
                  mulai: element.mulai,
                  selesai: element.selesai,
                  status: element.status,
                };

                this.data.push(tempData);
              }
            );

            console.log(this.data);

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
  },
});
