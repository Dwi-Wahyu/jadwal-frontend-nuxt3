<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import moment from "moment";

import { useMyGlobalStore } from "~/store/global";
import Modal from "../popup/Modal.vue";
import type { EventInput } from "@fullcalendar/core/index.js";
import Select from "../data-input/Select.vue";
import Button from "../button/Button.vue";

const props = defineProps({
  filtered: {
    type: Boolean,
    default: false,
  },
});

const store = useMyGlobalStore();
const axios = useAxios();

const { data, openModal } = storeToRefs(store);

const emit = defineEmits(["toggle-modal-form"]);

type ExtendedProps = {
  nama_ruangan: string;
  tanggal: string;
  aktivitas: string;
  mulai: string;
  selesai: string;
};

type CustomEvent = EventInput & {
  extendedProps: ExtendedProps;
};

const events = ref<CustomEvent[]>([]);

const rows = [
  {
    label: "Nama Ruangan",
    key: "nama_ruangan",
  },
  {
    label: "Tanggal",
    key: "tanggal",
  },
  {
    label: "Aktivitas",
    key: "aktivitas",
  },
  {
    label: "Mulai",
    key: "mulai",
  },
  {
    label: "Selesai",
    key: "selesai",
  },
];

const route = useRoute();
const { id } = route.params;

const ruangan = ref("");
const filterRuangan = ref(id as string);
const ruanganOptions = ref<{ label: string; value: string | number }[]>([]);

const showFilter = ref(false);

const calendarOptions = {
  events: events.value,
  plugins: [dayGridPlugin, timeGridPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    start: "prev,next today",
    center: "title",
    end: "dayGridMonth,timeGridDay",
  },

  eventClick(info: any) {
    console.log(info.event.extendedProps);

    store.data = info.event.extendedProps;
    store.openModal = !store.openModal;
  },
};

const loadRuangan = async () => {
  const request = await axios.get("/ruangan");

  if (request.status == 200) {
    const data = [];

    for (const item of request.data.data) {
      data.push({ label: item.nama, value: item.id });
    }

    ruangan.value = data[0].value;

    ruanganOptions.value = data;
  }
};

const loadData = async () => {
  let url = "/jadwal";

  if (props.filtered) {
    url = "/jadwal/" + id;
  }

  const fetchRequest = await axios.get(url);

  if (fetchRequest.status == 200) {
    for (const element of fetchRequest.data.data) {
      const mulai = `${element.tanggal} ${element.mulai}`;
      const selesai = `${element.tanggal} ${element.selesai}`;
      const start = moment(mulai, "YYYY-MM-DD HH:mm")
        .tz("Asia/Makassar")
        .toDate();
      const end = moment(selesai, "YYYY-MM-DD HH:mm")
        .tz("Asia/Makassar")
        .toDate();

      events.value.push({
        title: element.nama_ruangan,
        start,
        end,
        extendedProps: {
          nama_ruangan: element.nama_ruangan,
          mulai: element.mulai,
          selesai: element.selesai,
          aktivitas: element.aktivitas,
          tanggal: element.tanggal,
        },
      });
    }
  }
};

function toggleFilter() {
  showFilter.value = !showFilter.value;
}

function hapusFilter() {
  if (filterRuangan.value != id) {
    navigateTo("/");
  } else {
    toggleFilter();
  }
}

const handleFilter = () => {
  if (filterRuangan.value != id) {
    navigateTo(`/jadwal-ruangan/${filterRuangan.value}`);

    loadData();
  } else {
    toggleFilter();
  }
};

const onChangeFilterRuangan = (value: string) => {
  filterRuangan.value = value;
};

onMounted(async () => {
  loadData();
  loadRuangan();
});
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />

    <div class="w-full flex justify-between mt-3">
      <Button rounded="rounded-[8px]" @click="toggleFilter" variant="secondary"
        >Filter Ruangan</Button
      >
      <Button
        rounded="rounded-[8px]"
        @click="$emit('toggle-modal-form')"
        variant="secondary"
      >
        Pinjam Ruangan
      </Button>
    </div>
  </div>

  <Modal
    action-button-text="Cari Jadwal"
    kembali-button-text="Hapus Filter"
    kembali-button-variant="primary"
    v-if="showFilter"
    title="Filter Ruangan"
    @action="handleFilter"
    @close="hapusFilter"
  >
    <Select
      :model-value="filterRuangan"
      id="filterRuangan"
      label="Ruangan"
      :options="ruanganOptions"
      placeholder="Pilih Ruangan"
      @update:model-value="onChangeFilterRuangan"
    />
  </Modal>

  <Modal
    v-if="openModal"
    action-button-text="Cari Jadwal"
    title="Informasi Kegiatan"
    :show-button="false"
    @close="store.toggleModal"
  >
    <div
      v-for="(item, index) in rows"
      class="w-full grid grid-cols-2 border-b last:border-0"
      :key="index"
    >
      <div class="p-2">
        {{ item.label }}
      </div>
      <div class="p-2">
        : {{ data ? data[item.key as keyof ExtendedProps] : "-" }}
      </div>
    </div>
  </Modal>
</template>
