import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);

  const getHiddenClass = computed(() => (isOpen.value ? "" : "hidden"));

  return { isOpen, getHiddenClass };
});
