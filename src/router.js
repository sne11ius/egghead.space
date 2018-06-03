import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Create from "./views/Create.vue";
import User from "./views/User.vue";
import SketchDetails from "./views/SketchDetails.vue";

Vue.use(Router);

export default new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
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
      path: "/sketch/:id/:title?/edit",
      name: "edit",
      component: Create,
      props: true
    },
    {
      path: "/user/:uid/:username?",
      name: "user",
      component: User,
      props: true
    },
    {
      path: "/sketch/:id/:title?/:commentId?",
      name: "sketch",
      component: SketchDetails,
      props: true
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
