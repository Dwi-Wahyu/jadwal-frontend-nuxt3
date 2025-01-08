<template>
  <div
    class="flex lg:flex-row justify-between flex-col w-full items-center sm:gap-2"
  >
    <h1 class="text-xs font-medium">
      Menampilkan {{ perPage }} dari {{ totalDatas }} Data
    </h1>
    <div class="flex items-center justi fy-center space-x-2 select-none">
      <!-- Tombol Sebelumnya -->
      <button
        class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <ChevronLeft :color="currentPage === 1 ? '' : 'primary'" />
      </button>

      <!-- Nomor Halaman -->
      <button
        v-for="page in pages"
        :key="page"
        :class="[
          'px-4 py-2 text-xs font-medium  rounded-lg',
          page === currentPage
            ? 'bg-primary text-white '
            : 'bg-gray-100 text-gray-700  hover:bg-gray-100',
        ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <!-- Tombol Berikutnya -->
      <button
        class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-s disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <ChevronRight :color="currentPage === totalPages ? '' : 'primary'" />
      </button>
    </div>

    <div>
      <select
        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
        id="perpage_select"
        v-model="selectedValue"
        @change="handleChange"
      >
        <option
          v-for="(option, idx) in defaultOption"
          :key="idx"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

import ChevronLeft from "@/public/icons/Chevron-left.svg";
import ChevronRight from "@/public/icons/Chevron-right.svg";
import Select from "../data-input/Select.vue";

const defaultOption = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
];

const props = defineProps({
  modelValue: Number,
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalDatas: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
});

const selectedValue = ref("");

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  },
  { immediate: true }
);

const handleChange = () => {
  emit("perpage-change", selectedValue.value);
};

const emit = defineEmits(["page-change", "perpage-change"]);
// Generate array of pages

// Generate visible pages with ellipsis
const pages = computed(() => {
  const range = [];

  // Tampilkan halaman pertama
  range.push(1);

  if (props.currentPage > 4) {
    // Tambahkan ellipsis jika halaman aktif > 4
    range.push("...");
  }

  // Tentukan range halaman di sekitar currentPage
  const start = Math.max(2, props.currentPage - 2);
  const end = Math.min(props.totalPages - 1, props.currentPage + 2);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (props.currentPage < props.totalPages - 3) {
    // Tambahkan ellipsis jika halaman aktif < totalPages - 3
    range.push("...");
  }

  // Tampilkan halaman terakhir jika totalPages > 1
  if (props.totalPages > 1) {
    range.push(props.totalPages);
  }

  return range;
});

// Emit page change event
const changePage = (page) => {
  if (page === "..." || page < 1 || page > props.totalPages) return;
  emit("page-change", page);
};
</script>
