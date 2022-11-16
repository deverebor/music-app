<script setup lang="ts">
import { ref } from "vue";
import { firebaseStorage } from "@/includes/Firebase/firebase";

interface ISongUpload {
  firebaseStorageTask: any;
  currentProgress: number;
  songName: string;
}

const isDragOver = ref(false);
const songsUploads = ref([] as ISongUpload[]);

function uploadNewSong($event: any) {
  isDragOver.value = false;

  const files: File[] = [...$event.dataTransfer.files];

  files.forEach((file) => {
    if (file.type !== "audio/mpeg") {
      return;
    }

    const firebaseStorageRef = firebaseStorage.ref();
    const firebaseStorageSongRef = firebaseStorageRef.child(
      `songs/${file.name}`
    );
    const firebaseStorageTask = firebaseStorageSongRef.put(file);

    const uploadedFile =
      songsUploads.value.push({
        firebaseStorageTask,
        currentProgress: 0,
        songName: file.name,
      }) - 1;

    firebaseStorageTask.on("state_change", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      songsUploads.value[uploadedFile].currentProgress = progress;
    });
  });
}
</script>
<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="uploadNewSong($event)"
        :class="{
          'border-solid bg-green-400 border-green-400 text-white hover:text-white':
            isDragOver,
        }"
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div :key="song.songName" v-for="song in songsUploads" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm">{{ song.songName }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            :style="{ width: `${song.currentProgress}%` }"
            :class="'bg-blue-400'"
            class="transition-all progress-bar bg-blue-400"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
