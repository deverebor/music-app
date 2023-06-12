import { defineStore } from "pinia";
import type { ISongDocumentWithOutId } from "@/helpers/types";
import { ref, computed } from "vue";
import { Howl } from "howler";
import { formatTime } from "@/helpers/functions";

export const usePlayerStore = defineStore("player", () => {
  const currentPlayedSong = ref<ISongDocumentWithOutId>({});
  const currentSound = ref<Howl>(
    new Howl({
      src: [""],
      html5: true,
    })
  );
  const soundSeek = ref<string>("00:00");
  const soundDuration = ref<string>("00:00");

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
    currentSound.value.on("play", () => {
      requestAnimationFrame(progressBar);
    });
  }
  async function togglePlayPause() {
    if (!currentSound.value.playing()) return;

    if (currentSound.value.playing()) {
      currentSound.value.pause();
    } else {
      currentSound.value.play();
    }
  }
  async function progressBar() {
    soundSeek.value = formatTime(currentSound.value.seek());
    soundDuration.value = formatTime(currentSound.value.duration());

    if (currentSound.value.playing()) {
      requestAnimationFrame(progressBar);
    }
  }

  return {
    currentPlayedSong,
    currentSound,
    soundSeek,
    soundDuration,
    currentPlayingSong,
    togglePlayPause,
    handlePlayPause,
  };
});
