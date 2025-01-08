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
      :show-button-action="false"
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

  <Toast
    v-if="showToast"
    @close="toggleToast"
    label="Ruangan berhasil ditambahkan"
  />

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

const nama = ref("");
const kapasitas = ref("");
const kategori = ref("Ruang Kuliah");
const perPage = ref(store.perPage);

const onKategoriChange = (value: string) => {
  kategori.value = value;
};

const showModal = ref(false);
const showToast = ref(false);

const toggleToast = () => {
  showToast.value = !showToast.value;
};

function toggleModal() {
  showModal.value = !showModal.value;
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

function handleSubmit() {
  const payload = {
    nama: nama.value,
    kapasitas: kapasitas.value,
    kategori: kategori.value,
  };

  store.sendData(payload).then((response: any) => {
    fieldError.value = "";

    if (response.success) {
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
