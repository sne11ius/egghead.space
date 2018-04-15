import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueFire from "vuefire";
import Firebase from "firebase";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
Vue.use(VueMaterial);
Vue.use(VueFire);

Vue.config.productionTip = false;

// Initialize Firebase
const config = {
  apiKey: "AIzaSyA83Jt5piFOMegSqUn7eM4Ed0zMpTgQ120",
  authDomain: "hotshots-9001.firebaseapp.com",
  databaseURL: "https://hotshots-9001.firebaseio.com",
  projectId: "hotshots-9001",
  storageBucket: "hotshots-9001.appspot.com",
  messagingSenderId: "502037355037"
};
Firebase.initializeApp(config);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
