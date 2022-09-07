import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Index/index.vue";

const routes = [
  {
    path: "/",
    redirect: "/convert",
  },
  {
    path: "/convert",
    name: "home",
    component: HomeView,
  },
  {
    path: "/compress",
    name: "compress",
    component: () => import("../views/Compress/index.vue"),
  },
  {
    path: "/record",
    name: "record",
    component: () => import("../views/Record/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
