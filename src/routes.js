/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "./Store/store";

import Home from "./components/Home/index.vue";
import Signin from "./components/Signin/index.vue";
import Dashboard from "./components/Dashboard/index.vue";

Vue.use(VueRouter);

const authGuard = {
  beforeEnter: (to, from, next) => {
    const redirect = () => {
      if (store.state.admin.token) {
        if (to.path === "/signin") {
          //signin await
          next("/dashboard");
        } else {
          next();
        }
      } else {
        if (to.path === "/signin") {
          next();
        } else {
          next("/");
        }
      }
    };

    if (store.state.admin.refreshLoading) {
      //watch and wait for the token to be loaded and then direct!
      store.watch(
        (state, getters) => getters["admin/refreshLoading"],
        () => {
          redirect();
        }
      );
    } else {
      redirect();
    }
  }
};

const routes = [
  { path: "/", component: Home },
  {
    path: "/signin",
    component: Signin,
    ...authGuard
  },
  {
    path: "/dashboard",
    component: Dashboard,
    children: [],
    ...authGuard
  }
];

export default new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(from, to, savedPosition) {
    return { x: 0, y: 0 };
  }
});
