<template>
  <div
    class="bg-primary w-full h-fit py-2 fixed md:hidden flex items-center px-5 top-0 left-0 z-40 justify-between"
  >
    <div class="flex items-center gap-1">
      <button @click="store.actionSidebar">
        <img src="/icons/Hamburger.svg" alt="" />
      </button>
      <img src="/icons/E-Jadwal-Active.svg" alt="" />
    </div>

    <button @click="togglePopup">
      <img
        src="/icons/Placeholder-avatar.svg"
        class="bg-white rounded-full"
        alt=""
      />
    </button>
    <Card
      v-if="popupOpened"
      class="rounded-[8px] w-[180px] fixed right-9 top-16 flex flex-col"
    >
      <div
        v-for="(item, idx) in profilePopup"
        :class="`flex gap-2 cursor-pointer p-3 hover:bg-slate-100 ${item.rounded}`"
        @click="handleClick(item.title)"
      >
        <img :src="`/icons/${item.title}.svg`" alt="" />
        <h1>{{ item.title }}</h1>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";
import { useMySidebarStore } from "~/store/sidebar";
import Card from "../widgets/card/Card.vue";

import EJadwal from "~/assets/logo/E-Jadwal-active.svg";

const store = useMySidebarStore();
const route = useRoute();
const authStore = useMyAuthStore();
const router = useRouter();

type ProfilePopup = {
  title: string;
  rounded: string;
};

const handleLogout = () => {
  authStore.token = "";
  authStore.user = null;
  router.push("/masuk");
};

const handleClick = (id: string) => {
  if (id == "Keluar") {
    handleLogout();
  }
};

const popupOpened = ref(false);
const profilePopup = ref<ProfilePopup[]>([
  {
    title: "Keluar",
    rounded: "rounded-b-[8px]",
  },
]);
const togglePopup = () => {
  popupOpened.value = !popupOpened.value;
};

onMounted(async () => {
  store.changeParent(route.path);
});
</script>
