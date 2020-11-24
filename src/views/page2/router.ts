import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "form",
    component: resolve => require(["./views/form.vue"], resolve)
  }
];
const HISTORYBASS:object = process.env.NODE_ENV === "production" ? {
  mode: "history",
  base: process.env.BASE_URL + "/pc",
} : {
  mode: "hash"
}
const router = new VueRouter({
  ...HISTORYBASS,
  routes
});

export default router;