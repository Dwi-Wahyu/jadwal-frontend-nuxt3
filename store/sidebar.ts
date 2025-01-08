import { defineStore } from "pinia";
import { menuItems } from "~/data/sidebar/menu";

export const useMySidebarStore = defineStore("mySidebarStore", {
  state: () => ({
    appName: "E-Jadwal",
    menu: menuItems,
    parentActive: "/dashboard",
    sidebarActive: false,
  }),
  actions: {
    async changeParent(payload: any) {
      this.parentActive = payload;
    },

    actionSidebar() {
      this.sidebarActive = !this.sidebarActive;
    },
  },
});
