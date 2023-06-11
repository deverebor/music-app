import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/Home/HomeView.vue";
import AboutView from "@/views/About/AboutView.vue";
import ManageView from "@/views/Manage/ManageView.vue";
import SongView from "@/views/Song/SongView.vue";

import { useUserStore } from "@/stores/user/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "About",
      component: AboutView,
    },
    {
      path: "/manage",
      name: "Manage",
      component: ManageView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/song/:id",
      name: "Song",
      component: SongView,
    },
    {
      // @todo: create a 404 view
      path: "/:catchAll(.*)*",
      redirect: { name: "Home" },
    },
  ],
  linkExactActiveClass: "text-orange-400",
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (!to.meta.requiresAuth || userStore.isUserLoggedIn) {
    next();
  } else {
    next({ name: "Home" });
  }
});

export default router;
