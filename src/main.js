import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";

import "roboto-fontface/css/roboto/roboto-fontface.css";

import "@/assets/main.scss";

Vue.use(VueMaterial);
Vue.use(VueFire);

const globals = new Vue({
  data: {
    currentUser: null
  },
  computed: {
    isAuthenticated() {
      return this.currentUser != null;
    }
  }
});

globals.install = function(vue) {
  Object.defineProperty(vue.prototype, "$globals", {
    get() {
      return globals;
    }
  });
};

Vue.use(globals);

import markdown from "@/service/MarkdownRenderer.js";
Vue.mixin({
  methods: {
    marked: function(input) {
      return markdown.render(input);
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
