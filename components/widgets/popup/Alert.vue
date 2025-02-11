<template>
  <div class="w-screen flex fixed z-[60] top-0 left-0 h-screen">
    <div class="bg-black w-full h-full opacity-50"></div>
    <div class="w-full h-full flex fixed justify-center items-center">
      <div
        class="bg-white w-[422px] relative p-6 rounded-[20px] flex items-center flex-col"
      >
        <div
          class="w-full cursor-pointer absolute top-0 left-0 flex justify-end p-4"
        >
          <div @click="handleClose">
            <Close />
          </div>
        </div>
        <CloseCircle class="text-[10rem] text-[#F24822]" />
        <h1 class="font-semibold text-center text-[#938888]">{{ label }}</h1>
        <div class="w-full flex justify-evenly mt-4">
          <Button @click="handleAction('cancel')" variant="secondary"
            >Batalkan</Button
          >
          <Button @click="handleAction('confirm')" variant="danger"
            >Hapus</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CloseCircle from "@/public/icons/Close-circle.svg";
import Close from "@/public/icons/Close.svg";
import Button from "../button/Button.vue";

const emit = defineEmits(["cancel", "confirm"]);

const handleAction = (emitType) => {
  emit(emitType);
};

function handleClose() {
  emit("cancel");
}

defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>
