<template>
  <h1 class="text-xl font-bold mb-8">Ruangan</h1>

  <div
    class="bg-[#F4F6F8] rounded-t-[8px] border-b border-b-[#E3E6EF] flex justify-between p-4"
  >
    <h1 class="text-lg font-bold">Data Ruangan</h1>

    <Button
      size="sm"
      variant="secondary"
      @click="toggleModal"
      add-class="flex items-center gap-2"
    >
      <img src="/icons/Plus.svg" alt="" /> Tambah Ruangan
    </Button>
  </div>
  <div class="p-4 bg-white">
    <Table
      :headers="store.tableHeaders"
      :data="store.data"
      :loading="!store.loading"
      :show-row-numbers="true"
      :show-button-action="true"
      :actions="actions"
      :columns-visible="['nama', 'kategori', 'kapasitas']"
    />
  </div>
  <div
    class="bg-white rounded-b-[8px] border-t border-t-[#E3E6EF] flex justify-between p-4"
  >
    <Pagination
      :model-value="perPage"
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      :total-datas="store.totalDatas"
      :per-page="store.perPage"
      @page-change="handlePageChange"
      @perpage-change="handlePerPageChange"
    />
  </div>

  <Toast v-if="showToast" @close="toggleToast" :label="toastLabel" />

  <Modal
    v-if="showModal"
    title="Tambah Ruangan"
    @action="handleSubmit"
    @close="toggleModal"
  >
    <form class="flex flex-col gap-4">
      <Input
        v-model="nama"
        label="Nama Ruangan"
        id="namaRuangan"
        type="text"
        placeholder="Masukkan nama ruangan"
        :error="fieldError == 'nama'"
      />
      <h1 v-if="fieldError == 'nama'" class="">Nama ruangan sudah ada</h1>
      <Input
        v-model="kapasitas"
        label="Kapasitas Ruangan"
        id="kapasitas"
        type="number"
        placeholder="Masukkan kapasitas ruangan"
      />
      <Select
        :model-value="kategori"
        id="kategoriRuangan"
        label="Kategori Ruangan"
        :options="kategoriRuanganOptions"
        placeholder="Pilih Kategori Ruangan"
        @update:model-value="onKategoriChange"
      />
    </form>
  </Modal>

  <Modal
    v-if="showEditModal"
    title="Edit Ruangan"
    @action="handleEdit"
    @close="toggleEditModal"
  >
    <form class="flex flex-col gap-4">
      <Input
        v-model="nama"
        label="Nama Ruangan"
        id="namaRuangan"
        type="text"
        placeholder="Masukkan nama ruangan"
        :error="fieldError == 'nama'"
      />
      <h1 v-if="fieldError == 'nama'" class="">Nama ruangan sudah ada</h1>
      <Input
        v-model="kapasitas"
        label="Kapasitas Ruangan"
        id="kapasitas"
        type="number"
        placeholder="Masukkan kapasitas ruangan"
      />
      <Select
        :model-value="kategori"
        id="kategoriRuangan"
        label="Kategori Ruangan"
        :options="kategoriRuanganOptions"
        placeholder="Pilih Kategori Ruangan"
        @update:model-value="onKategoriChange"
      />
    </form>
  </Modal>

  <Alert
    v-if="showAlert"
    :label="alertLabel"
    @cancel="toggleAlert"
    @confirm="handleHapus"
  />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});

import Button from "~/components/widgets/button/Button.vue";
import Input from "~/components/widgets/data-input/Input.vue";
import Select from "~/components/widgets/data-input/Select.vue";
import Pagination from "~/components/widgets/datatable/Pagination.vue";
import Table from "~/components/widgets/datatable/Table.vue";
import Modal from "~/components/widgets/popup/Modal.vue";
import Toast from "~/components/widgets/popup/Toast.vue";
import { useMyRuanganStore } from "~/store/ruangan";
import Trash from "@/public/icons/Trash.svg";
import Edit from "@/public/icons/Edit.svg";
import Alert from "~/components/widgets/popup/Alert.vue";

const axios = useAxios();

const store = useMyRuanganStore();

const kategoriRuanganOptions = ref([
  { label: "Ruang Kuliah", value: "Ruang Kuliah" },
  { label: "Aula", value: "Aula" },
  { label: "Ruang Seminar", value: "Ruang Seminar" },
  { label: "Lab", value: "Lab" },
  { label: "Ruang Tutorial/CSL", value: "Ruang Tutorial/CSL" },
  { label: "Ruang Rapat", value: "Ruang Rapat" },
]);

const fieldError = ref("");

const id = ref("");
const nama = ref("");
const kapasitas = ref("");
const kategori = ref("Ruang Kuliah");
const perPage = ref(store.perPage);

const alertLabel = ref("");

const onKategoriChange = (value: string) => {
  kategori.value = value;
};

const showAlert = ref(false);
const showModal = ref(false);
const showToast = ref(false);
const showEditModal = ref(false);
const toastLabel = ref("");

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

function toggleEditModal() {
  showEditModal.value = !showEditModal.value;
}

const actions = [
  { label: "Edit", onClick: onEditClick, btnVariant: "primary", icon: Edit },
  { label: "Hapus", onClick: onHapusClick, btnVariant: "danger", icon: Trash },
];

function onEditClick(row: any) {
  id.value = row.id;
  nama.value = row.nama;
  kapasitas.value = row.kapasitas;
  kategori.value = row.kategori;
  toggleEditModal();
}

function onHapusClick(row: any) {
  id.value = row.id;
  alertLabel.value = `Anda yakin menghapus ${row.nama} ?`;
  toggleAlert();
}

const search = ref("");

const loadData = () => {
  const payload = {
    search: search.value,
    per_page: store.perPage,
    page: store.currentPage,
  };
  store.getData(payload).then((res) => {});
};

async function handleEdit() {
  const payload = {
    nama: nama.value,
    kapasitas: kapasitas.value,
    kategori: kategori.value,
  };

  const postRequest = await axios.put(`/ruangan/${id.value}`, payload);

  if (postRequest.status == 200) {
    toastLabel.value = "Berhasil edit ruangan";
    toggleEditModal();
    toggleToast();
    loadData();
  }
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/ruangan/${id.value}`);

  if (deleteRequest.status == 200) {
    toastLabel.value = "Berhasil hapus ruangan";
    toggleAlert();
    toggleToast();
    loadData();
  }
}

function handleSubmit() {
  const payload = {
    nama: nama.value,
    kapasitas: kapasitas.value,
    kategori: kategori.value,
  };

  store.sendData(payload).then((response: any) => {
    fieldError.value = "";

    if (response.success) {
      toastLabel.value = "Berhasil tambah ruangan";
      toggleModal();
      toggleToast();
      loadData();
    } else {
      if (response.error.code == "P2002") {
        const { target } = response.error.meta;
        fieldError.value = target.split("_")[1];
      }
    }
  });
}

const handlePageChange = (page: any) => {
  store.currentPage = page;
  loadData();
};

const handlePerPageChange = (value: any) => {
  store.perPage = value;

  loadData();
};

watch(search, () => {
  loadData();
});

onMounted(async () => {
  loadData();
});
</script>
