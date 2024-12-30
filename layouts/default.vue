<template>
  <div class="flex flex-row">
    <div
      class="flex bg-primary sidebar"
      :class="
        sidebarStore.sidebarActive ? 'sidebar-active' : 'sidebar-inactive'
      "
    >
      <Sidebar />
    </div>
    <div class="flex p-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "@/components/dashboard/layouts/Sidebar.vue";
import { useMySidebarStore } from "~/store/sidebar";
import { useMyAuthStore } from "~/store/auth";
const sidebarStore = useMySidebarStore();
const authStore = useMyAuthStore();
const router = useRouter();
onBeforeMount(async () => {});
</script>

<style scoped>
.sidebar {
  transition: width 0.3s ease; /* Atur durasi dan jenis transisi */
}
.sidebar-active {
  width: 18%;
}

.sidebar-inactive {
  width: 4%;
}
</style>
