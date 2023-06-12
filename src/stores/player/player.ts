import { defineStore } from "pinia";
import type { ISongDocumentWithOutId } from "@/helpers/types";
import { ref, computed } from "vue";
import { Howl } from "howler";
import { formatPlayerProgress, formatTime } from "@/helpers/functions";

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
  const playerProgress = ref<string>("0%");

  const currentPlayingSong = computed((): boolean => {
    if (currentSound.value.playing()) {
      return Boolean(currentPlayedSong.value);
    }

    return false;
  });

  async function handlePlayPause(song: ISongDocumentWithOutId) {
    if (currentSound.value instanceof Howl) currentSound.value.unload();

    currentPlayedSong.value = song;

    currentSound.value = new Howl({
      src: [song.songUrl as string],
      html5: true,
    });

    currentSound.value.play();
    currentSound.value.on("play", () => {
      requestAnimationFrame(handleMusicDuration);
    });
    currentSound.value.on("seek", () => {
      requestAnimationFrame(handleMusicDuration);
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
  async function handleMusicDuration() {
    soundSeek.value = formatTime(currentSound.value.seek());
    soundDuration.value = formatTime(currentSound.value.duration());

    playerProgress.value = formatPlayerProgress(
      currentSound.value.seek(),
      currentSound.value.duration()
    );

    if (currentSound.value.playing()) {
      requestAnimationFrame(handleMusicDuration);
    }
  }
  function updateSeekScrubPosition(event: any) {
    if (!currentSound.value.playing()) return;

    const { x, width } = event.currentTarget.getBoundingClientRect();
    const clientClickX = event.clientX - x;
    const percentage = clientClickX / width;
    const seconds = currentSound.value.duration() * percentage;

    currentSound.value.seek(seconds);
  }

  return {
    currentPlayedSong,
    currentPlayingSong,
    currentSound,
    handleMusicDuration,
    updateSeekScrubPosition,
    handlePlayPause,
    playerProgress,
    soundDuration,
    soundSeek,
    togglePlayPause,
  };
});
