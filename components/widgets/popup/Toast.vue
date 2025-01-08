<template>
  <div class="w-screen flex fixed z-[60] top-0 left-0 h-screen">
    <div class="bg-black w-full h-full opacity-50"></div>
    <div class="w-full h-full flex fixed justify-center items-center">
      <div
        class="bg-white relative p-5 rounded-[20px] flex items-center flex-col"
      >
        <div
          class="w-full cursor-pointer absolute top-0 left-0 flex justify-end p-4"
        >
          <div @click="handleClose">
            <Close />
          </div>
        </div>
        <CheckCircle class="text-[10rem] text-green" />
        <h1 class="text-lg font-semibold">{{ label }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckCircle from "@/public/icons/Check-circle.svg";
import Close from "@/public/icons/Close.svg";

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>
