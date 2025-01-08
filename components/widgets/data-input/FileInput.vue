<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-semibold mb-2">
      {{ label }}
    </label>
    <div class="flex items-center justify-center w-full">
      <label
        :for="id"
        class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        :class="error || errorOnChange ? 'border-danger' : 'border-gray-300'"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <div v-if="!errorOnChange">
            <h1 class="text-sm">{{ namaFile }}</h1>
          </div>

          <div
            v-if="errorOnChange"
            class="flex justify-center flex-col items-center"
          >
            <Warning class="text-[5rem] text-danger" />
            <h1
              v-for="(item, errorMsgIndex) in errorMessage"
              :key="errorMsgIndex"
              class="text-danger font-semibold"
            >
              {{ item }}
            </h1>
          </div>

          <div
            v-if="!namaFile && !errorOnChange"
            class="flex justify-center flex-col items-center"
          >
            <svg
              class="w-8 h-8 mb-2 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Klik untuk mengunggah</span> atau
              seret dan jatuhkan
            </p>
            <p class="text-xs text-gray-500">
              {{ placeholder }}
            </p>
          </div>
        </div>
        <input
          :id="id"
          type="file"
          class="hidden"
          @change="handleFileChange"
          ref="fileInput"
        />
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import Warning from "@/public/icons/Warning.svg";

// Props dari parent
const props = defineProps({
  label: { type: String, default: "" },
  id: { type: String, required: true },
  placeholder: { type: String, default: "Ukuran maksimum 2MB" },
  error: {
    type: Boolean,
    default: false,
  },
  allowedType: {
    type: Array,
    default: [],
    required: true,
  },
  maxSize: {
    type: Number,
    default: 5242880, // 5mb
  },
});

const namaFile = ref("");
const errorOnChange = ref(false);
const errorMessage = ref([]);

// Mendefinisikan event emits
const emit = defineEmits(["update:modelValue"]);

function validate(file) {
  const fileTypeCheck = props.allowedType.find((value) => value == file.type);

  if (!fileTypeCheck) {
    errorOnChange.value = true;
    errorMessage.value.push("Tipe file tidak didukung");
  }
  if (file.size > props.maxSize) {
    errorOnChange.value = true;
    errorMessage.value.push("Ukuran file terlalu besar");
  }
}

const handleFileChange = (event) => {
  errorOnChange.value = false;
  errorMessage.value = [];

  const file = event.target.files[0] || null;
  namaFile.value = file.name;

  validate(file);

  if (!errorOnChange.value) {
    emit("update:modelValue", file);
  }
};
</script>
