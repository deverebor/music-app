<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  firebaseStorage,
  firebaseAuth,
  songsCollection,
} from "@/includes/Firebase/firebase";

interface ISongUpload {
  firebaseStorageTask: any;
  currentProgress: number;
  songName: string;
  variantSong: string;
  iconSong: string;
  textClass: string;
}

const isDragOver = ref(false);
const songsUploads = ref([] as ISongUpload[]);

function uploadNewSong($event: any) {
  isDragOver.value = false;

  const files: File[] = $event.dataTransfer
    ? [...$event.dataTransfer.files]
    : [...$event.target.files];

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
        variantSong: "bg-blue-400",
        iconSong: "fa fa-spinner fa-spin",
        textClass: "",
      }) - 1;

    firebaseStorageTask.on(
      "state_change",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        songsUploads.value[uploadedFile].currentProgress = progress;
      },
      (error) => {
        songsUploads.value[uploadedFile].variantSong = "bg-red-400";
        songsUploads.value[uploadedFile].iconSong = "fas fa-times";
        songsUploads.value[uploadedFile].textClass = "text-red-400";
      },
      async () => {
        const uploadedSongFromUser = {
          uid: firebaseAuth.currentUser?.uid,
          displayUserName: firebaseAuth.currentUser?.displayName,
          originalName: firebaseStorageTask.snapshot.ref.name,
          modifiedName: firebaseStorageTask.snapshot.ref.name,
          songGenre: "",
          songUrl: "",
          commentCount: 0,
        };

        uploadedSongFromUser.songUrl =
          await firebaseStorageTask.snapshot.ref.getDownloadURL();

        await songsCollection.add(uploadedSongFromUser);

        songsUploads.value[uploadedFile].variantSong = "bg-green-400";
        songsUploads.value[uploadedFile].iconSong = "fas fa-check";
        songsUploads.value[uploadedFile].textClass = "text-green-400";
      }
    );
  });
}

onBeforeUnmount(() => {
  songsUploads.value.forEach((songUpload) => {
    songUpload.firebaseStorageTask.cancel();
  });
});
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
      <input
        @change="uploadNewSong($event)"
        multiple
        type="file"
        class="w-full"
      />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div :key="song.songName" v-for="song in songsUploads" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="song.textClass">
          <i :class="song.iconSong"></i>{{ song.songName }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            :style="{ width: `${song.currentProgress}%` }"
            :class="song.variantSong"
            class="transition-all progress-bar bg-blue-400"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
