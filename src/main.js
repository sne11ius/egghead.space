import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";
import "vuetify/dist/vuetify.min.css";
import VuetifyConfirm from "vuetify-confirm";

import "@/assets/main.scss";

Vue.use(Vuetify);
Vue.use(VueFire);
Vue.use(VuetifyConfirm, {
  buttonTrueText: "Yes",
  buttonFalseText: "No",
  color: "warning",
  icon: "warning",
  title: "Warning"
});

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
