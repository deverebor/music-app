<script setup lang="ts">
import type { ISongsDocument } from "@/helpers/types";
import type { PropType } from "vue";

defineProps({
  song: {
    type: Object as PropType<ISongsDocument>,
    required: true,
  },
});
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'Song', params: { id: song.documentId } }"
        class="font-bold block text-gray-600"
      >
        {{ song.modifiedName }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.displayUserName }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        :to="{
          name: 'Song',
          params: { id: song.documentId },
          hash: '#comments',
        }"
        v-slot="{ navigate }"
        custom
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.commentCount }}
        </span>
      </router-link>
    </div>
  </li>
</template>
