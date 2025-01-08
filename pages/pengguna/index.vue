<template>
  <h1 class="text-xl font-bold mb-8">Pengguna</h1>

  <div
    class="bg-[#F4F6F8] rounded-t-[8px] border-b border-b-[#E3E6EF] flex justify-between p-4"
  >
    <h1 class="text-lg font-bold">Data Pengguna</h1>

    <Button
      size="sm"
      variant="secondary"
      @click="toggleInputModal"
      add-class="flex items-center gap-2"
    >
      <img src="/icons/Plus.svg" alt="" /> Tambah Pengguna
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
      :columns-visible="['nama', 'email', 'role']"
    />
  </div>
  <div
    class="bg-white rounded-b-[8px] border-t border-t-[#E3E6EF] flex justify-between p-4"
  >
    <Pagination
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      :total-datas="store.totalDatas"
      :per-page="store.perPage"
      @page-change="handlePageChange"
    />
  </div>

  <Toast v-if="successToast" @close="toggleSuccessToast" :label="toastLabel" />

  <Modal
    title="Tambah Pengguna"
    v-if="inputModal"
    @action="handleSubmit"
    @close="toggleInputModal"
  >
    <form class="flex flex-col gap-4">
      <div>
        <Input
          v-model="nama"
          label="Nama Pengguna"
          id="nama"
          type="text"
          placeholder="Masukkan Nama Pengguna"
          :error="checkFieldError('nama')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'nama'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <Select
        :model-value="role"
        id="role"
        label="Role"
        :options="roleOptions"
        placeholder="Pilih Role"
        @update:model-value="onChangeRole"
      />

      <div>
        <Input
          v-model="email"
          label="Email"
          id="email"
          type="text"
          placeholder="Masukkan email"
          :error="checkFieldError('email')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'email'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <Input
          v-model="password"
          label="Password"
          id="password"
          type="password"
          placeholder="Masukkan password"
          :error="checkFieldError('password')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'password'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <div>
        <Input
          v-model="confirmPassword"
          label="Konfirmasi Password"
          id="confirmPassword"
          type="password"
          placeholder="Konfirmasi password"
          :error="checkFieldError('confirmPassword')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1
            v-if="item.path == 'confirmPassword'"
            class="text-danger text-sm mt-1"
          >
            {{ item.message }}
          </h1>
        </div>
      </div>
    </form>
  </Modal>

  <Modal
    v-if="editModal"
    title="Edit Pengguna"
    @action="handleEdit"
    @close="toggleEditModal"
  >
    <form class="flex flex-col gap-4">
      <div>
        <Input
          v-model="nama"
          label="Nama Pengguna"
          id="editNama"
          type="text"
          placeholder="Masukkan Nama Pengguna"
          :error="checkFieldError('nama')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'nama'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>

      <Select
        :model-value="role"
        id="editRole"
        label="Role"
        :options="roleOptions"
        placeholder="Pilih Role"
        @update:model-value="handleChangeRole"
      />

      <div>
        <Input
          v-model="email"
          label="Email"
          id="editEmail"
          type="text"
          placeholder="Masukkan email"
          :error="checkFieldError('email')"
        />
        <div v-for="(item, idx) in fieldError" :key="idx">
          <h1 v-if="item.path == 'email'" class="text-danger text-sm mt-1">
            {{ item.message }}
          </h1>
        </div>
      </div>
    </form>
  </Modal>

  <Alert
    v-if="deleteAlert"
    :label="alertLabel"
    @cancel="toggleDeleteAlert"
    @confirm="handleDelete"
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
import Alert from "~/components/widgets/popup/Alert.vue";
import Trash from "@/public/icons/Trash.svg";
import Edit from "@/public/icons/Edit.svg";

import { useMyPenggunaStore } from "~/store/pengguna";
import type { FieldError } from "~/types/FieldErrorTypes";

const store = useMyPenggunaStore();

const roleOptions = ref([
  { label: "Admin", value: "Admin" },
  { label: "Umum", value: "Umum" },
]);

const fieldError = ref<FieldError[]>([]);

const id = ref("");
const nama = ref("");
const role = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const inputModal = ref(false);
const editModal = ref(false);
const successToast = ref(false);
const toastLabel = ref("");
const deleteAlert = ref(false);

const axios = useAxios();

const alertLabel = computed(() => {
  return `Apakah anda yakin menghapus pengguna ${nama.value}`;
});

const handleChangeRole = (value: string) => {
  role.value = value;
};

const onChangeRole = (value: string) => {
  role.value = value;
};

function resetForm() {
  nama.value = "";
  email.value = "";
  role.value = "Umum";
  password.value = "";
  confirmPassword.value = "";
}

function toggleEditModal() {
  editModal.value = !editModal.value;
}

function toggleInputModal() {
  resetForm();
  inputModal.value = !inputModal.value;
}

function toggleSuccessToast(label: string) {
  successToast.value = !successToast.value;
  toastLabel.value = label;
}

function toggleDeleteAlert() {
  deleteAlert.value = !deleteAlert.value;
}

const search = ref("");

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
  nama.value = row.nama;
  role.value = row.role;
  email.value = row.email;

  toggleEditModal();
}

function onHapusClick(row: any) {
  id.value = row.id;
  nama.value = row.nama;

  toggleDeleteAlert();
}

const loadData = () => {
  const payload = {
    search: search.value,
    per_page: store.perPage,
    page: store.currentPage,
  };
  store.getData(payload).then((res) => {});
};

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
  checkEmpty(nama, "nama");
  checkEmpty(role, "role");
  checkEmpty(email, "email");
  checkEmpty(password, "password");
  checkEmpty(confirmPassword, "confirmPassword");

  if (password.value != confirmPassword.value) {
    fieldError.value.push({
      path: "confirmPassword",
      message: "Password tidak sesuai",
    });
  }
}

async function handleDelete() {
  const deleteRequest = await axios.delete(`/pengguna/${id.value}`);

  if (deleteRequest.status == 200) {
    toggleDeleteAlert();
    toggleSuccessToast("Berhasil hapus pengguna");

    loadData();
  }
}

function handleEdit() {
  const payload = {
    id: id.value,
    nama: nama.value,
    role: role.value,
    email: email.value,
  };

  checkEmpty(nama, "nama");
  checkEmpty(role, "role");
  checkEmpty(email, "email");

  if (!fieldError.value.length) {
    store.updateData(payload).then((response: any) => {
      if (response.success) {
        toggleEditModal();
        toggleSuccessToast("Berhasil update pengguna");

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

function handleSubmit() {
  const payload = {
    nama: nama.value,
    role: role.value,
    email: email.value,
    password: password.value,
  };

  fieldError.value = [];

  validateForm();

  if (!fieldError.value.length) {
    store.sendData(payload).then((response: any) => {
      if (response.success) {
        toggleInputModal();
        toggleSuccessToast("Berhasil menambahkan pengguna");

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

const handlePageChange = (page: any) => {
  store.currentPage = page;
  loadData();
};

watch(search, () => {
  loadData();
});

onMounted(async () => {
  loadData();
});
</script>
