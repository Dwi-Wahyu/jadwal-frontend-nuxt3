<template>
  <h1 class="text-xl font-bold">Dashboard</h1>

  <h1 class="text-lg font-bold mt-4">Status Overview</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 gap-3">
    <Card class="p-4 rounded flex gap-2" v-for="(item, idx) in status">
      <img
        :src="`/icons/dashboard/${item.icon}.svg`"
        class="w-[38px] h-[38px]"
        alt=""
      />
      <div>
        <h1 class="text-sm">{{ item.title }}</h1>
        <h1 class="font-bold">{{ item.value }}</h1>
      </div>
    </Card>
  </div>
  <div class="w-full flex items-center justify-center">
    <Card class="w-[100%] p-4 mt-4 mb-5 rounded">
      <Calendar />
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Calendar from "~/components/widgets/Calendar/Calendar.vue";
import Card from "~/components/widgets/card/Card.vue";
import { useMyJadwalStore } from "~/store/jadwal";
import { useMyPeminjamanStore } from "~/store/peminjaman";

const myJadwalStore = useMyJadwalStore();
const myPeminjamanStore = useMyPeminjamanStore();

definePageMeta({
  layout: "default",
  middleware: "auth",
});

type Status = {
  title: string;
  value: number;
  icon: string;
};

const status = ref<Status[]>([
  { title: "Jumlah Ruangan", value: 7, icon: "Jumlah-ruangan" },
  {
    title: "Jumlah Penggunaan Ruangan",
    value: 4,
    icon: "Jumlah-penggunaan-ruangan",
  },
  { title: "Jumlah Peminjaman", value: 3, icon: "Jumlah-peminjaman" },
  {
    title: "Jumlah Ruangan yang tersedia",
    value: 3,
    icon: "Jumlah-ruangan-tersedia",
  },
]);
</script>

<style></style>
