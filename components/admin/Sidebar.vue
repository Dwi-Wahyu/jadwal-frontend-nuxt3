<template>
  <div
    class="hidden md:flex bg-primary transition-all duration-300 ease-in-out fixed left-0 top-0 z-30"
    :class="store.sidebarActive ? 'sidebar-active' : 'sidebar-inactive'"
  >
    <div class="w-full flex-col h-screen p-4">
      <div
        class="flex items-center"
        :class="store.sidebarActive ? 'justify-between' : 'mb-2 justify-center'"
      >
        <img
          :src="
            store.sidebarActive
              ? '/icons/E-Jadwal-active.svg'
              : '/icons/E-Jadwal-inactive.svg'
          "
          alt=""
        />
      </div>
      <hr />
      <div
        class="flex flex-col mt-3"
        v-for="(item, idx) in store.menu"
        @click="store.changeParent(item.route)"
      >
        <nuxt-link
          v-if="item.roles.includes(user?.role)"
          :to="item.route"
          class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer"
          :class="store.parentActive.includes(item.route) ? 'bg-[#058C71]' : ''"
        >
          <img
            :src="
              store.parentActive.includes(item.route)
                ? `/icons/${item.icon}.svg`
                : `/icons/${item.icon2}.svg`
            "
            class="w-6 h-6"
            alt=""
          />
          <h1
            class="text-white"
            :class="
              store.parentActive == item.route ? 'font-bold' : 'font-base'
            "
            v-if="store.sidebarActive"
          >
            {{ item.title }}
          </h1>
        </nuxt-link>
      </div>
      <div
        @click="store.actionSidebar"
        class="p-2 rounded-full bg-[#058C71] cursor-pointer mt-4 justify-self-center"
      >
        <img
          :src="
            store.sidebarActive
              ? '/icons/Chevron-left.svg'
              : '/icons/Chevron-right.svg'
          "
          alt=""
          class="w-8"
        />
      </div>
    </div>
    <button
      @click="togglePopup"
      class="flex h-fit fixed right-10 top-5 items-center gap-3"
    >
      <img src="/icons/Placeholder-avatar.svg" alt="" />
      <h1 class="font-semibold">{{ user?.nama }}</h1>
      <img src="/icons/Chevron-down.svg" alt="" />
    </button>
    <Card
      v-if="popupOpened"
      class="rounded-[8px] w-[180px] fixed right-10 top-16 flex flex-col"
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

  <div
    v-if="store.sidebarActive"
    class="w-screen h-screen fixed z-50 md:hidden"
  >
    <div class="w-full h-full bg-black opacity-30 fixed"></div>
    <div
      class="h-full fixed bg-primary w-[80vw] p-5 transition-all duration-500 ease-in-out"
      :class="store.sidebarActive ? 'left-0' : '-left-96'"
    >
      <div class="flex justify-between items-center">
        <img
          :src="
            store.sidebarActive
              ? '/icons/E-Jadwal-active.svg'
              : '/icons/E-Jadwal-inactive.svg'
          "
          alt=""
          :class="store.sidebarActive ? '' : 'mb-2'"
        />
      </div>
      <hr />
      <div
        class="flex flex-col mt-3"
        v-for="(item, idx) in store.menu"
        @click="store.changeParent(item.route)"
      >
        <nuxt-link
          :to="item.route"
          v-if="item.roles.includes(user?.role)"
          class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer"
          :class="store.parentActive.includes(item.route) ? 'bg-[#058C71]' : ''"
        >
          <img
            :src="
              store.parentActive.includes(item.route)
                ? `/icons/${item.icon}.svg`
                : `/icons/${item.icon2}.svg`
            "
            class="w-6 h-6"
            alt=""
          />
          <h1
            class="text-white"
            :class="
              store.parentActive == item.route ? 'font-bold' : 'font-base'
            "
            v-if="store.sidebarActive"
          >
            {{ item.title }}
          </h1>
        </nuxt-link>
      </div>
      <div
        @click="store.actionSidebar"
        class="p-2 rounded-full bg-[#058C71] cursor-pointer mt-4 justify-self-center"
      >
        <img
          :src="
            store.sidebarActive
              ? '/icons/Chevron-left.svg'
              : '/icons/Chevron-right.svg'
          "
          alt=""
          class="w-8"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMySidebarStore } from "~/store/sidebar";
import Card from "@/components/widgets/card/Card.vue";
import { useMyAuthStore } from "~/store/auth";

const store = useMySidebarStore();
const route = useRoute();
const router = useRouter();
const authStore = useMyAuthStore();

const { user } = storeToRefs(authStore);

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
    title: "Pengaturan",
    rounded: "rounded-t-[8px]",
  },
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

<style scoped>
.sidebar-active {
  width: 19rem;
}
.sidebar-inactive {
  width: 6rem;
}
</style>
