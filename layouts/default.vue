<template>
  <Header />

  <div
    class="flex flex-row min-h-screen h-full overflow-auto bg-[#E7EDF2] relative"
  >
    <Sidebar />
    <div
      class="flex flex-col p-5 w-full h-screen mt-[4.5rem] md:mt-0 transition-all ease-in-out duration-300"
      :class="
        sidebarStore.sidebarActive ? 'sm:ml-[19rem] ml-0' : 'sm:ml-[6rem]'
      "
    >
      <slot />

      <div
        class="flex bottom-0 left-0 items-center justify-center w-full gap-1 my-3"
      >
        <h1>Copyright</h1>
        <Copyright class="text-transparent text-[1.5rem]" />
        <h1>SkytelIndo</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "@/components/admin/Sidebar.vue";
import Header from "~/components/admin/Header.vue";
import { useMyAuthStore } from "~/store/auth";
import { useMySidebarStore } from "~/store/sidebar";
import Copyright from "@/public/icons/Copyright.svg";

const sidebarStore = useMySidebarStore();
const authStore = useMyAuthStore();
const router = useRouter();
onBeforeMount(async () => {});
</script>
