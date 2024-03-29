<script setup lang="ts">
import type {
  ISongDocumentWithOutId,
  ICommentDocument,
  ICommentDocumentRequired,
} from "@/helpers/types";
import {
  commentsCollection,
  songsCollection,
  firebaseAuth,
} from "@/includes/Firebase/firebase";
import { usePlayerStore } from "@/stores/player/player";
import { useUserStore } from "@/stores/user/user";
import { storeToRefs } from "pinia";
import { onMounted, ref, computed, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const { isUserLoggedIn } = storeToRefs(userStore);

const playerStore = usePlayerStore();

const route = useRoute();
const router = useRouter();

const song = ref<ISongDocumentWithOutId>({} as ISongDocumentWithOutId);
const validationSchema = ref({
  commentary: "required|min:3",
});
const commentFormSettings = ref({
  alertMessage: "Please wait. Your comment is being sent.",
  alertVariant: "bg-blue-500",
  inSubmit: false,
  showAlert: false,
});
const comments = ref<ICommentDocument[]>([]);
const sortSelection = ref("1");

const songIdInParams = route.params.id as string;

onMounted(async () => {
  const documentSnapshot = await songsCollection.doc(songIdInParams).get();

  if (!documentSnapshot.exists) {
    router.push({ name: "Home" });
    return;
  }

  const { sort } = route.query;

  sortSelection.value = sort === "1" || sort === "2" ? sort : "1";

  song.value = documentSnapshot.data() as ISongDocumentWithOutId;
  getComments();
});

watch(sortSelection, (newValue) => {
  if (newValue === route.query.sort) return;

  router.push({
    query: {
      sort: newValue,
    },
  });
});

const sortedComments = computed(() => {
  const requiredComment = comments.value as ICommentDocumentRequired[];
  return requiredComment
    .slice()
    .sort((a: ICommentDocumentRequired, b: ICommentDocumentRequired) => {
      if (sortSelection.value === "1") {
        return (
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
      }

      return (
        new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
      );
    });
});

async function handleSendComment(values: any, { resetForm }: any) {
  if (typeof song.value.commentCount === "undefined") return;

  commentFormSettings.value.inSubmit = true;
  commentFormSettings.value.showAlert = true;
  commentFormSettings.value.alertVariant = "bg-blue-500";
  commentFormSettings.value.alertMessage =
    "Please wait. Your comment is being sent.";

  const comment = {
    content: values.commentary,
    datePosted: new Date().toString(),
    songId: songIdInParams,
    userName: firebaseAuth.currentUser?.displayName,
    uid: firebaseAuth.currentUser?.uid,
  };

  await commentsCollection.add(comment);

  song.value.commentCount += 1;
  await songsCollection.doc(songIdInParams).update({
    commentCount: song.value.commentCount,
  });

  getComments();

  commentFormSettings.value.inSubmit = false;
  commentFormSettings.value.alertVariant = "bg-green-500";
  commentFormSettings.value.alertMessage = "Comment sent successfully.";

  resetForm();

  setTimeout(() => {
    commentFormSettings.value.showAlert = false;
  }, 4000);
}

async function getComments() {
  const snapshot = await commentsCollection
    .where("songId", "==", songIdInParams)
    .get();

  comments.value = [];

  snapshot.forEach((doc) => {
    comments.value.push({
      documentId: doc.id,
      ...doc.data(),
    });
  });

  song.value.commentCount = snapshot.size;
}
</script>

<template>
  <!-- Music Header -->
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playerStore.handlePlayPause(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            :class="{
              'fa-pause': playerStore.currentPlayingSong,
              'fa-play': !playerStore.currentPlayingSong,
            }"
            class="fas"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.songGenre || "Unknown" }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.commentCount }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="commentFormSettings.showAlert"
            :class="commentFormSettings.alertVariant"
            class="text-white text-center font-bold p-4 mb-4"
          >
            {{ commentFormSettings.alertMessage }}
          </div>
          <VeeForm
            @submit="handleSendComment"
            :validation-schema="validationSchema"
            v-if="isUserLoggedIn"
          >
            <VeeField
              as="textarea"
              name="commentary"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></VeeField>
            <VeeErrorMessage class="text-red-600" name="commentary" />
            <button
              :disabled="commentFormSettings.inSubmit"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            v-model="sortSelection"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        :key="comment.documentId"
        v-for="comment in sortedComments"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.userName }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>
