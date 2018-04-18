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

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
