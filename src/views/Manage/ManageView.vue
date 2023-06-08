<script setup lang="ts">
import { onMounted, ref } from "vue";
import { UploadSong, SongItem } from "./components";
import { songsCollection, firebaseAuth } from "@/includes/Firebase/firebase";
import type { ISongsDocument, InputUpdateSongValues } from "./types";

const songs = ref<ISongsDocument[]>([]);

onMounted(async () => {
  const snapshots = await songsCollection
    .where("uid", "==", firebaseAuth.currentUser?.uid)
    .get();

  snapshots.forEach(handleNewSongAdded);
});

async function updateSongs(objectId: number, values: InputUpdateSongValues) {
  songs.value[objectId].modifiedName = values.modifiedName;
  songs.value[objectId].songGenre = values.songGenre;
}

function removeSong(objectId: number) {
  songs.value.splice(objectId, 1);
}

function handleNewSongAdded(songReference: any) {
  const song = {
    documentId: songReference.id,
    ...songReference.data(),
  };

  songs.value.push(song);
}
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadSong :handleNewSongAdded="handleNewSongAdded" ref="upload" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <SongItem
              v-for="(song, index) in songs"
              :key="song.documentId"
              :song="song"
              :songIndex="index"
              :updateSongs="updateSongs"
              :removeSong="removeSong"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
