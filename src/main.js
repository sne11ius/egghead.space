import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";
import "vuetify/dist/vuetify.min.css";
import VuetifyConfirm from "vuetify-confirm";
import VueScrollTo from "vue-scrollto";
import { db } from "@/firebase";

import "@/assets/main.scss";

Vue.use(Vuetify, {
  theme: {
    primary: "#0a6aa6",
    secondary: "#023859",
    accent: "#70a649"
  }
});

Vue.use(VueFire);
Vue.use(VuetifyConfirm, {
  buttonTrueText: "Yes",
  buttonFalseText: "No",
  color: "warning",
  icon: "warning",
  title: "Warning"
});
Vue.use(VueScrollTo);

const globals = new Vue({
  data: {
    currentUser: null,
    mouseActive: false
  },
  computed: {
    isAuthenticated() {
      return this.currentUser != null;
    }
  },
  created() {
    const _this = this;
    // s. https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685
    window.addEventListener(
      "mouseover",
      function onFirstHover() {
        _this.mouseActive = true;
        window.removeEventListener("mouseover", onFirstHover, false);
      },
      false
    );
  },
  methods: {
    loadUser(uid) {
      this.$bind(
        "currentUser",
        db
          .collection("users")
          .doc(uid)
          .collection("public")
          .doc("userInfo")
      );
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
