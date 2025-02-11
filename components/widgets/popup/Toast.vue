<template>
  <div
    class="w-full fixed z-50 top-0 left-0 h-screen flex items-center justify-center bg-black/50"
  >
    <div
      class="bg-white p-7 relative min-w-72 flex items-center justify-center flex-col gap-6 rounded-2xl"
    >
      <button @click="toggleModal" class="absolute right-4 top-4">
        <IconsX width="17" height="17" />
      </button>
      <div class="w-40 h-40 mt-2 relative rounded-full bg-[#01796F]">
        <!-- Garis pertama -->
        <div class="line left-4 top-[4.5rem] line-1"></div>
        <!-- Garis kedua -->
        <div class="line left-[3.2rem] top-[7.4rem] line-2"></div>
      </div>
      <h1 class="font-semibold text-lg">{{ label }}</h1>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "Format Surat Disimpan!",
  },
});

const emit = defineEmits(["close"]);

function toggleModal() {
  emit("close");
}
</script>

<style scoped>
.line {
  position: absolute;
  height: 1rem;
  background-color: #d9d9d9;
  transform-origin: left;
}

.line-1 {
  width: 0;
  transform: rotate(45deg);
  animation: extendLine1 0.3s forwards 0.1s;
}

.line-2 {
  width: 0;
  transform: rotate(-45deg);
  animation: extendLine2 0.3s forwards 0.4s; /* Delay 0.3s */
}

@keyframes extendLine1 {
  from {
    width: 0;
  }
  to {
    width: 40%; /* Sesuaikan panjang garis sesuai kebutuhan */
  }
}

@keyframes extendLine2 {
  from {
    width: 0;
  }
  to {
    width: 70%; /* Sesuaikan panjang garis sesuai kebutuhan */
  }
}
</style>
