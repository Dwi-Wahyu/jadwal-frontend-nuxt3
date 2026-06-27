<template>
  <div class="ejadwal-bg w-full min-h-svh overflow-auto">
    <!-- Decorative grid + gradient background -->
    <div class="ejadwal-gradient" aria-hidden="true"></div>
    <div class="ejadwal-grid" aria-hidden="true"></div>

    <div class="relative w-full flex flex-col items-center px-5 pb-16">
      <!-- Brand header -->
      <header class="w-full flex justify-center pt-10 pb-6 sm:pt-14">
        <div class="w-fit flex items-center gap-4">
          <img
            src="/logo/logo-unhas.png"
            class="w-12 h-14 drop-shadow-sm"
            alt="Logo Universitas Hasanuddin"
          />
          <div class="text-white">
            <h1
              class="font-extrabold text-3xl sm:text-4xl tracking-tight leading-none"
            >
              E-JADWAL
            </h1>
            <div class="font-semibold text-sm sm:text-base text-white/90">
              <span>Fakultas Kedokteran Gigi</span>
              <span
                @click="
                  navigateTo('https://github.com/Dwi-Wahyu', {
                    external: true,
                  })
                "
                class="font-semibold cursor-pointer hover:underline hover:underline-offset-4"
              >
                Unhas
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Jadwal terbaru / ledger table -->
      <Card class="ejadwal-card p-5 w-full rounded-2xl sm:w-[60%] mt-6">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="ledger-dot"></span>
            <h2 class="font-bold text-lg text-[#10231F]">Jadwal Terbaru</h2>
          </div>
          <span class="text-xs font-medium text-slate-500">
            {{ jadwalList.length }} aktivitas tercatat
          </span>
        </div>

        <Table
          :headers="['Tanggal', 'Waktu', 'Ruangan', 'Aktivitas']"
          :data="paginatedJadwal"
          :loading="loadingJadwal"
          :show-row-numbers="true"
          :row-number-offset="(jadwalPage - 1) * jadwalPerPage"
          :columns-visible="[
            'tanggal_display',
            'waktu_display',
            'nama_ruangan',
            'aktivitas',
          ]"
        />

        <div
          v-if="jadwalList.length > jadwalPerPage"
          class="flex items-center justify-between mt-4"
        >
          <span class="text-xs font-medium text-slate-500">
            Halaman {{ jadwalPage }} dari {{ jadwalTotalPages }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="ledger-nav-btn"
              :disabled="jadwalPage === 1"
              @click="jadwalPage--"
            >
              Previous
            </button>
            <button
              type="button"
              class="ledger-nav-btn"
              :disabled="jadwalPage === jadwalTotalPages"
              @click="jadwalPage++"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      <!-- Calendar card -->
      <Card class="ejadwal-card p-5 w-full mt-6 rounded-2xl sm:w-[60%]">
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
      <div class="flex gap-4 flex-col" id="modal-container">
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
            type="number"
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
import Table from "~/components/widgets/datatable/Table.vue";
import type { FieldError } from "~/types/FieldErrorTypes";

const runtimeConfig = useRuntimeConfig();

const showModalForm = ref(false);
const showToast = ref(false);

const modalRef = ref<HTMLDivElement | null>(null);

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
    (element) => element.path == field,
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
      loadJadwal();
    } else {
      alert(response.message);

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

// ----- Jadwal terbaru (ledger table) -----
type JadwalRow = {
  id: string;
  nama_ruangan: string;
  aktivitas: string;
  tanggal: string;
  mulai: string;
  selesai: string;
  tanggal_display: string;
  waktu_display: string;
};

const jadwalList = ref<JadwalRow[]>([]);
const loadingJadwal = ref(false);

// Client-side pagination: backend's paginated /jadwal/data endpoint
// requires a Bearer token, which the public landing page doesn't have.
// We fetch the full list once (GET /jadwal) and page through it locally.
const jadwalPerPage = 10;
const jadwalPage = ref(1);

const jadwalTotalPages = computed(() =>
  Math.max(1, Math.ceil(jadwalList.value.length / jadwalPerPage)),
);

const paginatedJadwal = computed(() => {
  const start = (jadwalPage.value - 1) * jadwalPerPage;
  return jadwalList.value.slice(start, start + jadwalPerPage);
});

watch(jadwalTotalPages, (totalPages) => {
  if (jadwalPage.value > totalPages) {
    jadwalPage.value = totalPages;
  }
});

const bulanIndonesia = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function formatTanggal(tanggal: string) {
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return tanggal;
  return `${date.getDate()} ${bulanIndonesia[date.getMonth()]} ${date.getFullYear()}`;
}

const loadJadwal = async () => {
  loadingJadwal.value = true;
  try {
    const request = await axios.get("/jadwal");

    if (request.status == 200) {
      const rows: JadwalRow[] = request.data.data.map((item: any) => ({
        id: item.id,
        nama_ruangan: item.nama_ruangan,
        aktivitas: item.aktivitas,
        tanggal: item.tanggal,
        mulai: item.mulai,
        selesai: item.selesai,
        tanggal_display: formatTanggal(item.tanggal),
        waktu_display: `${item.mulai} - ${item.selesai}`,
      }));

      rows.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

      jadwalList.value = rows;
      jadwalPage.value = 1;
    }
  } finally {
    loadingJadwal.value = false;
  }
};

onMounted(async () => {
  loadRuangan();
  loadJadwal();
});
</script>

<style scoped>
/* ---------------------------------------------------------------
   E-JADWAL background: soft gradient mesh + faint dot grid.
   Brand anchor color is the existing teal secondary (#01796F),
   extended into a deep-teal -> pale-mint transition so the change
   in tone is smooth, not a hard color stop.
----------------------------------------------------------------*/
.ejadwal-bg {
  position: relative;
  background-color: #043b34;
}

.ejadwal-gradient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      120% 80% at 12% -10%,
      #0e8f7c 0%,
      rgba(14, 143, 124, 0) 60%
    ),
    radial-gradient(90% 70% at 100% 0%, #c9a227 0%, rgba(201, 162, 39, 0) 45%),
    linear-gradient(180deg, #01453d 0%, #02635a 38%, #0e8f7c 72%, #cfe9e2 100%);
}

.ejadwal-grid {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.16) 1px,
    transparent 1px
  );
  background-size: 26px 26px;
  mask-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.55) 55%,
    rgba(0, 0, 0, 0.15) 100%
  );
}

.brand-rule {
  width: 64px;
  height: 2px;
  margin: 6px 0 6px;
  background: linear-gradient(90deg, #c9a227, rgba(201, 162, 39, 0));
  border-radius: 2px;
}

.ejadwal-card {
  position: relative;
  z-index: 2;
  box-shadow:
    0 1px 2px rgba(4, 27, 23, 0.06),
    0 18px 40px -16px rgba(4, 27, 23, 0.35);
  border: 1px solid rgba(4, 59, 52, 0.06);
}

.ledger-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #01796f;
  box-shadow: 0 0 0 3px rgba(1, 121, 111, 0.15);
}

.ledger-nav-btn {
  padding: 6px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  background: #f4f6f8;
  color: #01453d;
  border: 1px solid rgba(4, 59, 52, 0.1);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.ledger-nav-btn:hover:not(:disabled) {
  background: #01796f;
  color: #ffffff;
}

.ledger-nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
