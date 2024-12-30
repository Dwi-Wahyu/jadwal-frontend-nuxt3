<template>
  <div
    class="flex w-full flex-col gap-4 h-screen"
    :class="store.sidebarActive ? 'p-4' : 'p-1'"
  >
    <div class="flex flex-col items-center gap-2" v-if="!store.sidebarActive">
      <img
        src="@/public/logo/logo.png"
        class="bg-white p-0 rounded-lg h-10"
        alt=""
      />
      <IconsBurger class="cursor-pointer mb-4" @click="store.actionSidebar" />

      <div class="flex" v-for="(item, index) in store.menu">
        <img
          :src="
            store.parentActive == item.route
              ? `/icons/${item.icon}.svg`
              : `/icons/${item.icon2}.svg`
          "
          class="w-6 cursor-pointer"
          alt=""
          @click="store.actionSidebar"
        />
      </div>
    </div>
    <div class="flex flex-row gap-2 items-center" v-if="store.sidebarActive">
      <img
        src="@/public/logo/logo.png"
        class="bg-white p-0 rounded-lg h-12"
        alt=""
      />
      <h1 class="font-bold text-xl m-0 p-0 grow text-white">
        {{ store.appName }}
      </h1>
      <IconsBurger class="cursor-pointer" @click="store.actionSidebar" />
    </div>
    <hr class="bg-white" v-if="store.sidebarActive" />

    <div class="flex flex-col mt-2 gap-0" v-if="store.sidebarActive">
      <div
        class="flex flex-col"
        v-for="(item, index) in store.menu"
        @click="store.changeParent(item.route)"
      >
        <h1
          v-if="item.type == 'menuName'"
          class="text-sm font-semibold text-white pt-3 pb-1"
        >
          {{ item.title }}
        </h1>
        <nuxt-link
          :to="item.route"
          class="flex flex-row gap-4 p-2 rounded-t-lg cursor-pointer hover:bg-second"
          v-if="item.child.length == 0 && item.type == 'parent'"
          :class="store.parentActive == item.route ? 'bg-second' : ''"
        >
          <!-- {{ item.child.length ? 'asd' : 'aa' }} -->
          <img
            :src="
              store.parentActive == item.route
                ? `/icons/${item.icon}.svg`
                : `/icons/${item.icon2}.svg`
            "
            class="w-6"
            alt=""
          />
          <h1
            class="text-white text-lg"
            :class="
              store.parentActive == item.route ? 'font-bold' : 'font-base'
            "
          >
            {{ item.title }}
          </h1>
        </nuxt-link>
        <div
          class="flex flex-row gap-4 p-2 rounded-t-lg cursor-pointer hover:bg-second"
          v-if="item.child.length > 0"
          :class="store.parentActive.includes(item.route) ? 'bg-second' : ''"
        >
          <!-- {{ item.child.length ? 'asd' : 'aa' }} -->
          <img
            :src="
              store.parentActive.includes(item.route)
                ? `/icons/${item.icon}.svg`
                : `/icons/${item.icon2}.svg`
            "
            class="w-6"
            alt=""
          />
          <h1
            class="text-white text-lg"
            :class="
              store.parentActive.includes(item.route)
                ? 'font-bold'
                : 'font-base'
            "
          >
            {{ item.title }}
          </h1>
        </div>
        <transition name="fade">
          <div
            class="flex flex-col gap-2 pl-12 p-2 bg-second rounded-b-lg"
            v-if="
              item.child.length > 0 && store.parentActive.includes(item.route)
            "
          >
            <div
              class="flex flex-row"
              v-for="(itemChild, indexChild) in item.child"
            >
              <nuxt-link :to="itemChild.route" class="text-white">
                <h1
                  :class="
                    route.path == itemChild.route ? 'font-bold' : 'font-base'
                  "
                >
                  {{ itemChild.title }}
                </h1>
              </nuxt-link>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMySidebarStore } from "~/store/sidebar";

const store = useMySidebarStore();
const route = useRoute();

onMounted(async () => {
  store.changeParent(route.path);
});
</script>

<style scoped>
/* Tambahkan efek fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
