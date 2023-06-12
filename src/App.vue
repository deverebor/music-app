<script setup lang="ts">
import { HeaderApp, AuthModal, MusicPlayer } from "@/components";
import { useUserStore } from "@/stores/user/user";
import { storeToRefs } from "pinia";
import { firebaseAuth } from "./includes/Firebase/firebase";

const userStore = useUserStore();
const { isUserLoggedIn } = storeToRefs(userStore);

if (firebaseAuth.currentUser) {
  isUserLoggedIn.value = true;
}
</script>

<template>
  <HeaderApp />

  <router-view></router-view>

  <MusicPlayer />

  <AuthModal />
</template>
