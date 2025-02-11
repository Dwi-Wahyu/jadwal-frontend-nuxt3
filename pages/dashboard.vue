<template>
  <h1 class="text-xl font-bold">Dashboard</h1>

  <h1 class="text-lg font-bold mt-4">Status Overview</h1>

  <div
    v-if="status"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 gap-3"
  >
    <Card class="p-4 rounded flex gap-3" v-for="(item, idx) in status">
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
      <Calendar @toggle-modal-form="toggleModal" />
    </Card>
  </div>

  <Toast
    v-if="showToast"
    label="Berhasil membuat pengajuan"
    @close="toggleToast"
  />

  <Modal
    title="Formulir Peminjaman Ruangan"
    @close="toggleModal"
    @action="handleSubmit"
    kembali-button-text="Batalkan"
    action-button-text="Kirim Permintaan"
    v-if="showModalForm"
  >
    <div class="flex gap-4 flex-col">
      <div>
        <Select
          :model-value="ruangan"
          id="ruangan"
          label="Pilih Ruangan"
          :options="ruanganOptions"
          placeholder="Pilih Kategori Ruangan"
          :error="checkFieldError('nama_ruangan')"
          @update:model-value="changeRuangan"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1
            v-if="item.path == 'nama_ruangan'"
            class="text-danger text-sm mt-1"
          >
            {{ item.message }}
          </h1>
        </div>
      </div>
      <div>
        <Select
          :model-value="instansi"
          id="instansi"
          label="Instansi"
          :options="instansiOptions"
          placeholder="Pilih Instansi"
          :error="checkFieldError('instansi')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'instansi'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <Input id="filterTanggal" label="Tanggal" type="date" v-model="tanggal" />
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="jamMulai"
            label="Jam Mulai"
            type="time"
            v-model="mulai"
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
            id="filterTanggal"
            label="Jam Selesai"
            type="time"
            v-model="selesai"
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
          id="filterTanggal"
          label="Nama Penanggung Jawab"
          type="text"
          v-model="penanggungJawab"
          placeholder="Masukkan Nama Penanggung Jawab"
          :error="checkFieldError('penanggungJawab')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1
            v-if="item.path == 'penanggungJawab'"
            class="text-danger text-sm mt-1"
          >
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <Input
          id="nomorWA"
          label="Nomor Whatsapp"
          type="text"
          v-model="nomor"
          :withIcon="true"
          placeholder="Masukkan Nomor Whatsapp"
          :error="checkFieldError('nomor_wa')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'nomor_wa'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <Input
          id="aktivitas"
          label="Aktivitas"
          type="text"
          v-model="aktivitas"
          placeholder="Aktivitas"
          :error="checkFieldError('aktivitas')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'aktivitas'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <FileInput
          label="Surat Permohonan"
          id="suratPermohonan"
          placeholder="Sertakan surat permohonan dalam format pdf"
          v-model="surat"
          :error="checkFieldError('surat_permohonan')"
          :allowed-type="['application/pdf']"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1
            v-if="item.path == 'surat_permohonan'"
            class="text-danger text-sm mt-1"
          >
            {{ item.message }}
          </h1>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});

import Calendar from "~/components/widgets/Calendar/Calendar.vue";
import Card from "~/components/widgets/card/Card.vue";
import FileInput from "~/components/widgets/data-input/FileInput.vue";
import Input from "~/components/widgets/data-input/Input.vue";
import Select from "~/components/widgets/data-input/Select.vue";
import Modal from "~/components/widgets/popup/Modal.vue";
import Toast from "~/components/widgets/popup/Toast.vue";
import { useMyJadwalStore } from "~/store/jadwal";
import { useMyPeminjamanStore } from "~/store/peminjaman";
import type { FieldError } from "~/types/FieldErrorTypes";

const axios = useAxios();

const myJadwalStore = useMyJadwalStore();
const myPeminjamanStore = useMyPeminjamanStore();

const runtimeConfig = useRuntimeConfig();

const showModalForm = ref(false);
const showToast = ref(false);

const toggleModal = () => {
  showModalForm.value = !showModalForm.value;
};

const toggleToast = () => {
  showToast.value = !showToast.value;
};

const ruanganOptions = ref<{ label: string; value: string | number }[]>([]);

const ruangan = ref("");
const instansi = ref("Mahasiswa");
const tanggal = ref("");
const mulai = ref("");
const selesai = ref("");
const penanggungJawab = ref("");
const nomor = ref();
const aktivitas = ref("");
const surat = ref<File | null>(null);

const fieldError = ref<FieldError[]>([]);

const instansiOptions = ref([
  { label: "Mahasiswa", value: "Mahasiswa" },
  { label: "Dosen", value: "Dosen" },
  { label: "Umum", value: "Umum" },
]);

function changeRuangan(value: string) {
  ruangan.value = value;
}

function checkEmpty(field: Ref<string>, fieldName: string) {
  if (!field.value) {
    fieldError.value.push({
      path: fieldName,
      message: "Field ini tidak boleh kosong",
    });
  }
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

function validateForm() {
  fieldError.value = []; // Reset error
  checkEmpty(ruangan, "ruangan");
  checkEmpty(instansi, "instansi");
  checkEmpty(tanggal, "tanggal");
  checkEmpty(mulai, "mulai");
  checkEmpty(selesai, "selesai");
  checkEmpty(penanggungJawab, "penanggungJawab");
  checkEmpty(nomor, "nomor");
  checkEmpty(aktivitas, "aktivitas");
  validateSurat();
}

function validateSurat() {
  if (!surat.value) {
    fieldError.value.push({
      path: "surat_permohonan",
      message: "Mohon Sertakan Surat Permohonan",
    });

    return;
  }
}

const handleSubmit = async () => {
  validateForm();

  if (!fieldError.value.length) {
    const payload = new FormData();

    payload.append("id_ruangan", ruangan.value);
    payload.append("instansi", instansi.value);
    payload.append("tanggal", tanggal.value);
    payload.append("mulai", mulai.value);
    payload.append("selesai", selesai.value);
    payload.append("penanggung_jawab", penanggungJawab.value);
    payload.append("nomor_wa", nomor.value);
    payload.append("aktivitas", aktivitas.value);
    if (surat.value) {
      payload.append("surat_permohonan", surat.value);
    }

    const url = runtimeConfig.public.axios.baseURL + "/peminjaman";

    const postRequest = await fetch(url, {
      method: "POST",
      body: payload,
    });
    const response = await postRequest.json();

    if (response.success) {
      toggleModal();
      toggleToast();
    } else {
      console.log(response);
    }
  }
};

type Status = {
  title: string;
  value: number;
  icon: string;
};

const status = ref<Status[]>([]);

async function loadDashboardData() {
  const fetchData = await axios.get("/ruangan/dashboard-data");

  if (fetchData.data.success) {
    status.value.push({
      title: "Jumlah Ruangan",
      value: fetchData.data.jumlahRuangan,
      icon: "Jumlah-ruangan",
    });

    status.value.push({
      title: "Jumlah Penggunaan Ruangan",
      value: fetchData.data.jumlahRuanganTerpakai,
      icon: "Jumlah-penggunaan-ruangan",
    });

    status.value.push({
      title: "Jumlah Peminjaman",
      value: fetchData.data.jumlahPeminjaman,
      icon: "Jumlah-peminjaman",
    });

    status.value.push({
      title: "Jumlah Ruangan Tersedia ",
      value: fetchData.data.jumlahRuanganTersedia,
      icon: "Jumlah-ruangan-tersedia",
    });
  }
}

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

onMounted(async () => {
  loadDashboardData();
  loadRuangan();
});
</script>
