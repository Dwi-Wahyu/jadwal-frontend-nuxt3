<template>
  <h1 class="text-xl font-bold mb-8">Data Jadwal Ruangan</h1>

  <Card class="p-4 rounded-[8px]">
    <div class="grid grid-cols-1 md:grid-cols-4 items-center gap-3 mb-4">
      <Select
        id="filterRuangan"
        label="Filter Ruangan"
        :options="RuanganOptions"
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
      <Button variant="secondary" size="md" @click="toggleModalForm">
        Tambah Jadwal
      </Button>
    </div>

    <Table
      :headers="jadwalStore.tableHeaders"
      :data="jadwalStore.data"
      :loading="jadwalStore.loading"
      :show-button-action="true"
      :actions="actions"
      :columns-visible="['nama_ruangan', 'tanggal', 'mulai', 'selesai']"
    />
    <Pagination
      class="mt-3"
      :model-value="perPage"
      :current-page="jadwalStore.currentPage"
      :total-pages="jadwalStore.totalPages"
      :total-datas="jadwalStore.totalDatas"
      :per-page="jadwalStore.perPage"
      @page-change="handlePageChange"
      @perpage-change="handlePerPageChange"
    />
  </Card>

  <!-- Edit Jadwal -->
  <Modal
    v-if="modalEdit"
    title="Edit Jadwal"
    @action="handleEdit"
    @close="toggleModalEdit"
  >
    <form class="flex gap-3 flex-col">
      <Select
        id="namaRuangan"
        :options="RuanganOptions"
        label="Nama Ruangan"
        placeholder="Nama Ruangan"
        @update:model-value="onChangeRuangan"
        :model-value="ruangan"
      />
      <div class="grid grid-cols-2 gap-3">
        <Input
          v-model="mulai"
          label="Jam Mulai"
          id="jamMulai"
          type="time"
          placeholder="Masukkan Jam Mulai"
        />
        <Input
          v-model="selesai"
          label="Jam Selesai"
          id="jamSelesai"
          type="time"
          placeholder="Masukkan Jam Selesai"
        />
      </div>
      <Input
        v-model="tanggal"
        label="Tanggal"
        id="tanggal"
        type="date"
        placeholder="Masukkan Tanggal"
      />
      <Input
        v-model="aktivitas"
        label="Aktivitas"
        id="namaRuangan"
        type="text"
        placeholder="Aktivitas"
      />
    </form>
  </Modal>

  <!-- Tambah Jadwal -->
  <Modal
    v-if="modalForm"
    title="Tambah Jadwal"
    @action="handleSubmit"
    @close="toggleModalForm"
  >
    <form class="flex gap-3 flex-col">
      <Select
        id="namaRuangan"
        :options="RuanganOptions"
        label="Nama Ruangan"
        placeholder="Nama Ruangan"
        :model-value="ruangan"
        @update:model-value="onChangeRuangan"
      />
      <div class="grid grid-cols-2 gap-3">
        <div>
          <Input
            v-model="mulai"
            label="Jam Mulai"
            id="jamMulai"
            type="time"
            placeholder="Masukkan Jam Mulai"
            :error="checkFieldError('mulai')"
          />

          <div v-for="(item, idx) in fieldError" :key="idx">
            <h1 v-if="item.path == 'mulai'" class="text-danger text-sm mt-1">
              {{ item.message }}
            </h1>
          </div>
        </div>

        <div>
          <Input
            v-model="selesai"
            label="Jam Selesai"
            id="jamSelesai"
            type="time"
            placeholder="Masukkan Jam Selesai"
            :error="checkFieldError('selesai')"
          />

          <div v-for="(item, idx) in fieldError" :key="idx">
            <h1 v-if="item.path == 'selesai'" class="text-danger text-sm mt-1">
              {{ item.message }}
            </h1>
          </div>
        </div>
      </div>

      <div>
        <Input
          v-model="tanggal"
          label="Tanggal"
          id="tanggal"
          type="date"
          placeholder="Masukkan Tanggal"
          :error="checkFieldError('tanggal')"
        />

        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'tanggal'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <Input
          v-model="aktivitas"
          label="Aktivitas"
          id="aktivitas"
          type="text"
          placeholder="Aktivitas"
          :error="checkFieldError('aktivitas')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'aktivitas'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>
    </form>
  </Modal>

  <Toast :label="toastLabel" v-if="successToast" @close="toggleToast" />

  <Alert
    v-if="showAlert"
    label="Anda akan menghapus Aktivitas Molar, Apakah Anda Yakin? Menghapus aktivitas berarti menghapusnya secara permanen"
    @cancel="toggleAlert(false)"
    @submit="handleHapus"
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
import Trash from "@/public/icons/Trash.svg";
import Edit from "@/public/icons/Edit.svg";

import Alert from "~/components/widgets/popup/Alert.vue";
import type { FieldError } from "~/types/FieldErrorTypes";
import { useMyJadwalStore } from "~/store/jadwal";

const jadwalStore = useMyJadwalStore();

type Options = {
  label: string;
  value: string;
};

const RuanganOptions = ref<Options[]>([]);

const modalForm = ref(false);
const modalEdit = ref(false);
const showAlert = ref(false);
const successToast = ref(false);

const axios = useAxios();

const search = ref("");

const fieldError = ref<FieldError[]>([]);

const id = ref("");
const ruangan = ref("");
const aktivitas = ref("");
const tanggal = ref("");
const mulai = ref("");
const selesai = ref("");
const status = ref("");

const filterRuangan = ref("");
const filterTanggal = ref("");

const onFilterRuanganChange = (value: string) => {
  filterRuangan.value = value;
};

const perPage = ref(5);

const toastLabel = ref("");

const loadData = () => {
  const payload = {
    search: search.value,
    ruangan: filterRuangan.value,
    tanggal: filterTanggal.value,
    per_page: jadwalStore.perPage,
    page: jadwalStore.currentPage,
  };
  jadwalStore.getData(payload).then((res: any) => {});
};

const onChangeRuangan = async (value: string) => {
  ruangan.value = value;
};

const loadRuangan = async () => {
  const fetchRuangan = await axios.get("/ruangan");

  if (fetchRuangan.status == 200) {
    for (const element of fetchRuangan.data.data) {
      RuanganOptions.value.push({
        label: element.nama,
        value: element.id,
      });
      ruangan.value = RuanganOptions.value[0].value;
    }
  }
};

const actions = [
  {
    label: "Edit",
    onClick: onEditClick,
    btnVariant: "primary",
    icon: Edit,
  },
  {
    label: "Hapus",
    onClick: onHapusClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function onEditClick(row: any) {
  id.value = row.id;
  ruangan.value = row.id_ruangan;
  aktivitas.value = row.aktivitas;
  tanggal.value = row.tanggal;
  mulai.value = row.mulai;
  selesai.value = row.selesai;
  status.value = row.status;

  toggleModalEdit();
}

function onHapusClick(row: any) {
  id.value = row.id;

  toggleAlert(true);
}

async function handleHapus() {
  const tolakRequest = await axios.delete(`/jadwal/${id.value}`);
  if (tolakRequest.status == 200) {
    toggleAlert(false);
    loadData();
  }
}

async function handleEdit() {
  const payload = {
    id: id.value,
    id_ruangan: ruangan.value,
    mulai: mulai.value,
    selesai: selesai.value,
    tanggal: tanggal.value,
    aktivitas: aktivitas.value,
  };

  validateForm();

  if (!fieldError.value.length) {
    jadwalStore.updateData(payload).then((response: any) => {
      console.log(response);

      if (response.success) {
        toastLabel.value = "Berhasil edit jadwal";
        toggleModalEdit();
        toggleToast();

        loadData();
      } else {
        if (response.error.code == "P2002") {
          const { target } = response.error.meta;
          fieldError.value.push(target.split("_")[1]);
        }
      }
    });
  }
}

function checkEmpty(field: Ref<string>, fieldName: string) {
  if (!field.value) {
    fieldError.value.push({
      path: fieldName,
      message: "Field ini tidak boleh kosong",
    });
  }
}

function validateForm() {
  fieldError.value = []; // Reset error
  checkEmpty(ruangan, "ruangan");
  checkEmpty(tanggal, "tanggal");
  checkEmpty(mulai, "mulai");
  checkEmpty(selesai, "selesai");
}

function toggleToast() {
  successToast.value = !successToast.value;
}

function checkFieldError(field: string) {
  const isFieldError = fieldError.value.find(
    (element) => element.path == field
  );
  if (isFieldError) {
    return true;
  }
  return false;
}

function toggleModalForm() {
  modalForm.value = !modalForm.value;
}

function toggleModalEdit() {
  modalEdit.value = !modalEdit.value;
}

function toggleAlert(show: boolean) {
  showAlert.value = show;
}

async function handleSubmit() {
  validateForm();

  if (!fieldError.value.length) {
    const payload = {
      mulai: mulai.value,
      selesai: selesai.value,
      aktivitas: aktivitas.value,
      tanggal: tanggal.value,
      id_ruangan: ruangan.value,
    };

    // const postRequest = await fetch("http://localhost:3001/api/jadwal", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    const postRequest = await axios.post(
      "/jadwal",
      { payload },
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    if (postRequest.status == 200) {
      toastLabel.value = "Berhasil input jadwal";
      toggleToast();
      toggleModalForm();
      loadData();
    }
  }
}

const handlePageChange = (page: any) => {
  jadwalStore.currentPage = page;
  loadData();
};

const handlePerPageChange = (value: any) => {
  jadwalStore.perPage = value;
  loadData();
};

watch([filterTanggal, filterRuangan], () => {
  loadData();
});

onMounted(async () => {
  loadData();
  loadRuangan();
});
</script>
