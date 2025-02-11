<template>
  <div class="w-screen flex fixed z-[60] top-0 left-0 h-screen">
    <div class="bg-black w-full h-full opacity-50"></div>
    <div class="w-full h-full flex fixed justify-center items-center">
      <div
        class="flex flex-col w-[440px] transition-all duration-300 ease-in-out"
        :class="
          startAnimation ? 'opacity-100' : 'opacity-0 pointer-events-none'
        "
      >
        <div
          class="bg-[#F4F6F8] rounded-t-[12px] flex justify-between items-center p-4 border-b border-[#E3E6EF]"
        >
          <h1 class="font-bold text-lg">
            {{ title }}
          </h1>
          <button @click="handleClick('close')">
            <Close class="flex justify-center items-center" />
          </button>
        </div>
        <div
          class="bg-white shadow p-5 overflow-auto max-h-[60vh]"
          :class="!showButton ? 'rounded-b-[12px]' : ''"
        >
          <slot />
        </div>
        <div
          v-if="showButton"
          class="rounded-b-[12px] p-4 border-t bg-white border-[#E3E6EF] flex justify-end gap-2 items-center"
        >
          <BaseButton
            @click="handleClick('close')"
            :variant="kembaliButtonVariant"
            >{{ kembaliButtonText }}</BaseButton
          >
          <BaseButton
            @click="handleClick('action')"
            :variant="actionButtonVariant"
          >
            {{ actionButtonText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "../button/Button.vue";
import Close from "@/public/icons/Close.svg";

const emit = defineEmits(["action", "close"]);

function handleClick(emitType) {
  emit(emitType);
}

defineProps({
  title: {
    required: true,
    default: "Modal Box",
    type: String,
  },
  actionButtonText: {
    default: "Submit",
    type: String,
  },
  actionButtonVariant: {
    default: "secondary",
    type: String,
  },
  kembaliButtonText: {
    default: "Kembali",
    type: String,
  },
  kembaliButtonVariant: {
    default: "link",
    type: String,
  },
  showButton: {
    type: Boolean,
    default: true,
  },
});

const startAnimation = ref(false);

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 1);
});
</script>
