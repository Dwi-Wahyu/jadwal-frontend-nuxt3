<template>
  <div
    class="bg-secondary w-full min-h-svh flex justify-center items-center h-full overflow-auto p-5"
  >
    <div class="absolute w-full left-0 top-9 justify-center flex">
      <div class="w-fit flex items-center gap-3">
        <img src="/logo/logo-unhas.png" class="w-10 h-12" alt="" />
        <div class="text-white">
          <h1 class="font-extrabold text-3xl">E-JADWAL</h1>
          <div class="font-bold">
            <span>Fakultas Kedokteran Gigi</span>

            <span
              @click="
                navigateTo('https://github.com/Dwi-Wahyu', {
                  external: true,
                })
              "
              class="font-bold"
            >
              Unhas
            </span>
          </div>
        </div>
      </div>
    </div>

    <Card class="p-5 w-full rounded-xl sm:w-[55%] mt-24">
      <Calendar @toggle-modal-form="toggleModal" />
    </Card>

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

        <Input
          id="filterTanggal"
          label="Tanggal"
          type="date"
          v-model="tanggal"
        />
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
              <h1
                v-if="item.path == 'selesai'"
                class="text-danger text-sm mt-1"
              >
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
            <h1
              v-if="item.path == 'aktivitas'"
              class="text-danger text-sm mt-1"
            >
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
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "login",
});

import Calendar from "~/components/widgets/Calendar/Calendar.vue";
import Card from "~/components/widgets/card/Card.vue";
import Toast from "~/components/widgets/popup/Toast.vue";
import Input from "~/components/widgets/data-input/Input.vue";
import Select from "~/components/widgets/data-input/Select.vue";
import FileInput from "~/components/widgets/data-input/FileInput.vue";
import Modal from "~/components/widgets/popup/Modal.vue";
import type { FieldError } from "~/types/FieldErrorTypes";

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

const axios = useAxios();

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
  loadRuangan();
});
</script>
