import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "tree",
    component: resolve => require(["./views/tree.vue"], resolve)
  }
];
const HISTORYBASS:object = process.env.NODE_ENV === "production" ? {
  mode: "history",
  base: process.env.BASE_URL + "/mobile",
} : {
  mode: "hash"
}
const router = new VueRouter({
  ...HISTORYBASS,
  routes
});

export default router;