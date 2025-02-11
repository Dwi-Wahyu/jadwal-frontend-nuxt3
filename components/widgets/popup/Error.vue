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
          class="bg-white rounded-[12px] shadow p-5 overflow-auto max-h-[60vh]"
        >
          <h1></h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

function handleClose() {
  emit("close");
}

defineProps({
  label: {
    required: true,
    type: String,
  },
});

const startAnimation = ref(false);

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 1);
});
</script>
