import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
Vue.use(VueRouter);
const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "table",
    component: resolve => require(["./views/table.vue"], resolve)
  }
];
const HISTORYBASS:object = process.env.NODE_ENV === "production" ? {
  mode: "history",
  base: process.env.BASE_URL + "/page",
} : {
  mode: "hash"
}
const router = new VueRouter({
  ...HISTORYBASS,
  routes
});

export default router;