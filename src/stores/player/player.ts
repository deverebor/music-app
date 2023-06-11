import { defineStore } from "pinia";
import type { ISongDocumentWithOutId } from "@/helpers/types";
import { ref } from "vue";
import { Howl } from "howler";

export const usePlayerStore = defineStore("player", () => {
  const currentPlayedSong = ref<ISongDocumentWithOutId>({});
  const currentSound = ref<Howl>(
    new Howl({
      src: [""],
      html5: true,
    })
  );

  async function handlePlayPause(song: ISongDocumentWithOutId) {
    currentPlayedSong.value = song;

    currentSound.value = new Howl({
      src: [song.songUrl as string],
      html5: true,
    });

    currentSound.value.play();
  }

  return {
    currentPlayedSong,
    currentSound,
    handlePlayPause,
  };
});
