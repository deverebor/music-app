<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { ISongsDocument, InputUpdateSongValues } from "../../types";
import { songsCollection } from "@/includes/Firebase/firebase";

const toggleEditForm = ref(false);
const inSubmission = ref(false);
const alertConfiguration = ref({
  toggleAlertMessage: false,
  variant: "bg-blue-500",
  message: "Please wait! Update song information is in progress.",
});
const validationSchema = ref({
  modifiedName: "required",
  songGenre: "min:3",
});

const props = defineProps({
  song: {
    type: Object as PropType<ISongsDocument>,
    required: true,
  },
  songIndex: {
    type: Number,
    required: true,
  },
  updateSongs: {
    type: Function as PropType<
      (objectId: number, values: InputUpdateSongValues) => void
    >,
    required: true,
  },
});

async function editSongInformation(inputValues: InputUpdateSongValues) {
  inSubmission.value = true;
  alertConfiguration.value.toggleAlertMessage = true;
  alertConfiguration.value.variant = "bg-blue-500";
  alertConfiguration.value.message =
    "Please wait! Update song information is in progress.";

  try {
    await songsCollection.doc(props.song.documentId).update({
      modifiedName: inputValues.modifiedName,
      songGenre: inputValues.songGenre,
    });
  } catch (error) {
    inSubmission.value = false;
    alertConfiguration.value.variant = "bg-red-500";
    alertConfiguration.value.message = "Error updating song information.";
    return;
  }

  props.updateSongs(props.songIndex, inputValues);

  inSubmission.value = false;
  alertConfiguration.value.variant = "bg-green-500";
  alertConfiguration.value.message = "Song information updated successfully.";
}

function goBack() {
  toggleEditForm.value = false;
  alertConfiguration.value.toggleAlertMessage = false;
}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!toggleEditForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ props.song.modifiedName }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="toggleEditForm = !toggleEditForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="toggleEditForm">
      <div
        v-if="alertConfiguration.toggleAlertMessage"
        :class="alertConfiguration.variant"
        class="text-white text-center font-bold p-4 mb-4"
      >
        {{ alertConfiguration.message }}
      </div>
      <VeeForm
        :validation-schema="validationSchema"
        :initial-values="song"
        @submit="editSongInformation"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modifiedName"
          />
          <VeeErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="songGenre"
          />
          <VeeErrorMessage class="text-red-600" name="songGenre" />
        </div>
        <button
          :disabled="inSubmission"
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          @click.prevent="goBack"
          :disabled="inSubmission"
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>