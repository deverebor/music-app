<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modal/modal";
import { useUserStore } from "@/stores/user/user";

const userStore = useUserStore();
const { isUserLoggedIn } = storeToRefs(userStore);

const modalStore = useModalStore();
const { isOpen } = storeToRefs(modalStore);

function toggleAuthenticationModal() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-cente">
        <ul class="flex flex-row mt-1">
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
              <a class="px-2 text-white" href="#">Manage</a>
            </li>
            <li>
              <button
                @click.prevent="userStore.logoutCurrentUser"
                class="px-2 text-white"
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
