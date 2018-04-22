import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Create from "./views/Create.vue";
import User from "./views/User.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/create",
      name: "create",
      component: Create
    },
    {
      path: "/user/:uid",
      name: "user",
      component: User,
      props: true
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
