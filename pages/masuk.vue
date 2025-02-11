<template>
  <div
    class="h-screen w-screen bg-cover bg-center bg-[url('/backgrounds/bg-login.jpg')] z-10"
  >
    <div class="bg-black w-full h-screen fixed opacity-50"></div>
    <img src="/backgrounds/bg.svg" class="bottom-0 fixed" alt="" />
  </div>

  <div
    class="fixed z-20 top-0 left-0 w-full h-screen flex items-center justify-center"
  >
    <div class="absolute top-5 flex flex-col items-center text-white">
      <img class="w-[2.2rem]" src="/logo/logo-unhas.png" alt="" />
      <h1 class="text-lg font-bold">Universitas Hasanuddin</h1>
      <h1 class="text-sm">Fakultas Kedokteran Gigi</h1>
    </div>

    <Card class="w-[450px] rounded-[30px] px-10 py-8">
      <div class="flex flex-col items-center">
        <h1 class="font-bold text-xl">e-Jadwal</h1>
        <h1 class="font-bold text-gray-600">Aplikasi Penggunaan Ruangan</h1>
      </div>
      <form class="mt-4 flex flex-col gap-4">
        <Input
          v-model="email"
          :disabled="clicked"
          label="Username"
          id="username"
          type="text"
          :error="store.error"
          placeholder="Masukkan Username"
        />
        <Input
          v-model="password"
          :disabled="clicked"
          label="Password"
          id="password"
          type="password"
          :error="store.error"
          placeholder="Masukkan Password"
        />
        <BaseCheckbox
          class="pl-1"
          v-model="tetapLogin"
          id="agree"
          label="Tetap Login"
        />
        <div>
          <Button
            @click="handleClick"
            variant="success"
            add-class="rounded-3xl w-full"
            :disabled="clicked"
          >
            Masuk Sekarang
          </Button>
          <h1 v-if="store.error" class="text-red-600 text-sm mt-2 text-center">
            {{ store.error_data?.data }}
          </h1>
        </div>
      </form>
    </Card>

    <div class="absolute bottom-8 text-white flex gap-1">
      <h1>Copyright</h1>
      <img src="/icons/Copyright.svg" alt="" />
      <h1>SkytelIndo</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "login",
});

import { useMyAuthStore } from "~/store/auth";
import Input from "~/components/widgets/data-input/Input.vue";
import BaseCheckbox from "~/components/widgets/data-input/Checkbox.vue";
import Button from "~/components/widgets/button/Button.vue";
import Card from "~/components/widgets/card/Card.vue";

const store = useMyAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const tetapLogin = ref(false);
const clicked = ref(false);

const handleClick = () => {
  clicked.value = true;
  const payload = {
    email: email.value,
    password: password.value,
    alwaysLogin: tetapLogin.value,
  };
  store
    .login(payload)
    .then((res) => {
      router.push("/dashboard");
    })
    .catch((err) => {
      clicked.value = false;
      console.log(err);
    });
};

onBeforeMount(async () => {
  store.error = false;
  store.error_data = null;
  if (store.token != "") {
    router.push("/dashboard");
  }
});
</script>
