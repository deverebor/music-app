<script setup lang="ts">
import { usePlayerStore } from "@/stores/player/player";
import { storeToRefs } from "pinia";

const playerStore = usePlayerStore();
const { soundDuration, soundSeek } = storeToRefs(playerStore);
</script>
<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center">
      <span class="song-title font-bold">Song Title</span> by
      <span class="song-artist">Artist</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button @click.prevent="playerStore.togglePlayPause()" type="button">
        <i
          :class="{
            'fa-pause': playerStore.currentPlayingSong,
            'fa-play': !playerStore.currentPlayingSong,
          }"
          class="fa text-gray-500 text-xl"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ soundSeek }}</div>
      <!-- Scrub Container  -->
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          style="left: 50%"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          style="width: 50%"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ soundDuration }}</div>
    </div>
  </div>
</template>
