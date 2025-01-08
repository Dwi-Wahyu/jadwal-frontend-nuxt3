<template>
  <h1 class="text-xl font-bold mb-8">Data Peminjaman Ruangan</h1>

  <Card class="p-4 rounded-[8px]">
    <div class="grid grid-cols-1 md:grid-cols-4 items-center gap-3 mb-4">
      <Select
        id="filterStatus"
        label="Filter Status"
        :options="options"
        variant="underline"
        @update:model-value="onFilterStatusChange"
      />
      <Select
        id="filterRuangan"
        label="Filter Ruangan"
        :options="ruanganOptions"
        variant="underline"
        @update:model-value="onFilterRuanganChange"
      />
      <Input
        id="filterTanggal"
        label="Tanggal"
        type="date"
        variant="underline"
        v-model="filterTanggal"
      />
      <Input variant="underline" id="pencarian" label="Pencarian" />
    </div>

    <Table
      :headers="peminjamanStore.tableHeaders"
      :data="peminjamanStore.data"
      :loading="peminjamanStore.loading"
      :show-button-action="true"
      :actions="actions"
      :columns-visible="[
        'nama_ruangan',
        'tanggal',
        'penanggung_jawab',
        'mulai',
        'selesai',
        'status',
      ]"
    />
    <Pagination
      class="mt-3"
      :model-value="perPage"
      :current-page="peminjamanStore.currentPage"
      :total-pages="peminjamanStore.totalPages"
      :total-datas="peminjamanStore.totalDatas"
      :per-page="peminjamanStore.perPage"
      @page-change="handlePageChange"
      @perpage-change="handlePerPageChange"
    />
  </Card>

  <div
    v-if="modalInfo"
    class="w-screen flex fixed z-[60] top-0 left-0 h-screen"
  >
    <div class="bg-black w-full h-full opacity-50"></div>
    <div class="w-full h-full flex fixed justify-center items-center">
      <div class="flex flex-col w-[440px]">
        <div
          class="bg-[#F4F6F8] rounded-t-[12px] flex justify-between items-center p-4 border-b border-[#E3E6EF]"
        >
          <h1 class="font-bold text-lg">Informasi Kegiatan</h1>
          <button @click="toggleModalInfo">
            <Close class="flex justify-center items-center" />
          </button>
        </div>
        <div class="bg-white shadow p-5 overflow-auto max-h-[60vh]">
          <div
            v-for="(item, index) in rows"
            class="w-full grid grid-cols-2"
            :class="index % 2 === 0 ? 'bg-[#E7EDF2]' : ''"
            :key="index"
          >
            <div class="p-2 rounded-l">
              {{ item.label }}
            </div>
            <div class="p-2 rounded-r">: {{ item.value }}</div>
          </div>
        </div>
        <div
          class="rounded-b-[12px] p-4 border-t bg-white border-[#E3E6EF] flex justify-end gap-2 items-center"
        >
          <Button variant="primary" @click="handleLihatSurat">
            Lihat Surat
          </Button>
          <Button variant="danger" @click="handleTolak"> Tolak </Button>
          <Button @click="handleApprove" variant="success"> Approve </Button>
        </div>
      </div>
    </div>
  </div>

  <Alert
    v-if="showAlert"
    label="Anda akan menghapus Aktivitas Molar, Apakah Anda Yakin? Menghapus aktivitas berarti menghapusnya secara permanen"
    @cancel="toggleAlert(false)"
    @submit="handleTolak"
  />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});

import Button from "~/components/widgets/button/Button.vue";
import Card from "~/components/widgets/card/Card.vue";
import Input from "~/components/widgets/data-input/Input.vue";
import Select from "~/components/widgets/data-input/Select.vue";
import Pagination from "~/components/widgets/datatable/Pagination.vue";
import Table from "~/components/widgets/datatable/Table.vue";
import Modal from "~/components/widgets/popup/Modal.vue";
import Toast from "~/components/widgets/popup/Toast.vue";

import Close from "@/public/icons/Close.svg";

import Alert from "~/components/widgets/popup/Alert.vue";
import { useMyPeminjamanStore } from "~/store/peminjaman";

const peminjamanStore = useMyPeminjamanStore();

const actions = [{ label: "Detail", onClick: onDetailClick }];

type RuanganOptions = {
  label: string;
  value: string;
};

const ruanganOptions = ref<RuanganOptions[]>([]);

const options = ref([
  { label: "Approve", value: "Approve" },
  { label: "Belum Approve", value: "Belum Approve" },
]);
const error = ref();

const modalForm = ref(false);
const modalInfo = ref(false);
const showAlert = ref(false);

const axios = useAxios();

const search = ref("");

const id = ref("");
const nama_ruangan = ref("");
const aktivitas = ref("");
const tanggal = ref("");
const mulai = ref("");
const selesai = ref("");
const instansi = ref("");
const status = ref("");
const surat_permohonan = ref("");
const rows = ref([
  { label: "Nama Ruangan", value: nama_ruangan },
  { label: "Aktivitas", value: aktivitas },
  { label: "Tanggal", value: tanggal },
  { label: "Mulai", value: mulai },
  { label: "Selesai", value: selesai },
  { label: "Instansi", value: instansi },
  { label: "Status", value: status },
]);

const filterRuangan = ref("");
const filterStatus = ref("");
const filterTanggal = ref("");

const onFilterStatusChange = (value: string) => {
  filterStatus.value = value;
};
const onFilterRuanganChange = (value: string) => {
  filterRuangan.value = value;
};

const perPage = ref(5);

const loadPeminjaman = () => {
  const payload = {
    search: search.value,
    ruangan: filterRuangan.value,
    status: filterStatus.value,
    tanggal: filterTanggal.value,
    per_page: peminjamanStore.perPage,
    page: peminjamanStore.currentPage,
  };
  peminjamanStore.getData(payload).then((res) => {});
};

function onDetailClick(row: any) {
  id.value = row.id;
  nama_ruangan.value = row.nama_ruangan;
  aktivitas.value = row.aktivitas;
  instansi.value = row.instansi;
  tanggal.value = row.tanggal;
  mulai.value = row.mulai;
  selesai.value = row.selesai;
  status.value = row.status;
  surat_permohonan.value = row.surat_permohonan;

  toggleModalInfo();
}

async function handleLihatSurat() {
  navigateTo(
    `http://localhost:3001/surat_permohonan/${surat_permohonan.value}`,
    { external: true }
  );
}

async function handleTolak() {
  const tolakRequest = await axios.delete(`/peminjaman/tolak/${id.value}`);
  if (tolakRequest.status == 200) {
    toggleModalInfo();
    loadPeminjaman();
  }
}

async function handleApprove() {
  const approveRequest = await axios.post(`/peminjaman/approve/${id.value}`);
  if (approveRequest.status == 200) {
    toggleModalInfo();
    loadPeminjaman();
  }
}

function toggleModalInfo() {
  modalInfo.value = !modalInfo.value;
}

function toggleAlert(show: boolean) {
  showAlert.value = show;
}

const handlePageChange = (page: any) => {
  peminjamanStore.currentPage = page;
  loadPeminjaman();
};

const handlePerPageChange = (value: any) => {
  peminjamanStore.perPage = value;
  loadPeminjaman();
};

watch([search, filterRuangan, filterStatus, filterTanggal], () => {
  loadPeminjaman();
});

const loadRuangan = async () => {
  const fetchRuangan = await axios.get("/ruangan");

  if (fetchRuangan.status === 200) {
    for (const element of fetchRuangan.data.data) {
      ruanganOptions.value.push({
        label: element.nama,
        value: element.id,
      });
    }
  }
};

onMounted(async () => {
  loadPeminjaman();

  loadRuangan();
});
</script>
