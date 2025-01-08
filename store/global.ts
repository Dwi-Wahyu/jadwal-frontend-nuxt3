import moment from "moment";
import { defineStore } from "pinia";

type Data = {
  nama_ruangan: string;
  aktivitas: string;
  tanggal: string;
  mulai: string;
  selesai: string;
};

export const useMyGlobalStore = defineStore({
  id: "myJadwalStore",
  state: () => ({
    openModal: false,
    data: null as Data | null,
  }),
  actions: {
    toggleModal() {
      this.openModal = !this.openModal;
    },
  },
});
