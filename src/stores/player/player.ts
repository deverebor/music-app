import { defineStore } from "pinia";
import type { ISongDocumentWithOutId } from "@/helpers/types";
import { ref, computed } from "vue";
import { Howl } from "howler";

export const usePlayerStore = defineStore("player", () => {
  const currentPlayedSong = ref<ISongDocumentWithOutId>({});
  const currentSound = ref<Howl>(
    new Howl({
      src: [""],
      html5: true,
    })
  );

  const currentPlayingSong = computed((): boolean => {
    if (currentSound.value.playing()) {
      return Boolean(currentPlayedSong.value);
    }

    return false;
  });

  async function handlePlayPause(song: ISongDocumentWithOutId) {
    currentPlayedSong.value = song;

    currentSound.value = new Howl({
      src: [song.songUrl as string],
      html5: true,
    });

    currentSound.value.play();
  }
  async function togglePlayPause() {
    if (!currentSound.value.playing()) return;

    if (currentSound.value.playing()) {
      currentSound.value.pause();
    } else {
      currentSound.value.play();
    }
  }

  return {
    currentPlayedSong,
    currentSound,
    currentPlayingSong,
    togglePlayPause,
    handlePlayPause,
  };
});
