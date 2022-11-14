<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modal/modal";
import { useUserStore } from "@/stores/user/user";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const { isUserLoggedIn } = storeToRefs(userStore);

const modalStore = useModalStore();
const { isOpen } = storeToRefs(modalStore);

const router = useRouter();
const route = useRoute();

function toggleAuthenticationModal() {
  isOpen.value = !isOpen.value;
}

function logoutUser() {
  userStore.logoutCurrentUser();

  if (route.meta.requiresAuth) {
    router.push({ name: "Home" });
  }
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        :to="{ name: 'Home' }"
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-cente">
        <ul class="flex flex-row mt-1">
          <li>
            <router-link :to="{ name: 'About' }" class="px-2 text-white">
              About
            </router-link>
          </li>
          <li v-if="!isUserLoggedIn">
            <a
              @click.prevent="toggleAuthenticationModal"
              class="px-2 text-white"
              href="#"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link :to="{ name: 'Manage' }" class="px-2 text-white">
                Manage
              </router-link>
            </li>
            <li>
              <button
                @click.prevent="logoutUser"
                class="px-2 text-white hover:text-orange-400"
              >
                Logout
              </button>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
