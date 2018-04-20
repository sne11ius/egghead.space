<template>
  <div class="page-container">
    <div id="wait" v-if="unknownUserState">
      <h3>Please wait&hellip;</h3>
      <img src="@/assets/flask.svg">
    </div>
    <div id="app" v-else>
      <GlobalSnackbar></GlobalSnackbar>
      <md-app>
        <md-app-toolbar class="md-primary">
          <h3 class="md-title" style="flex: 1">egghead.space</h3>
          <UserStatus/>
        </md-app-toolbar>
        <md-app-drawer md-permanent="full">
          <md-toolbar class="md-transparent" md-elevation="0">
            Navigation
          </md-toolbar>

          <md-list>
            <md-list-item to="/">
              <md-icon>move_to_inbox</md-icon>
              <span class="md-list-item-text">Home</span>
            </md-list-item>
            <md-list-item to="about">
              <md-icon>send</md-icon>
              <span class="md-list-item-text">About</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>
        <md-app-content>
          <router-view/>
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import GlobalSnackbar from "@/components/GlobalSnackbar.vue";
import EventBus from "@/service/EventBus.js";
import UserStatus from "@/views/UserStatus.vue";
import FirebaseUtil from "@/service/FirebaseUtil.js";

import { db } from "@/firebase";

export default {
  name: "App",
  components: {
    UserStatus,
    GlobalSnackbar
  },
  data() {
    return {
      unknownUserState: true
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$globals.currentUser = user;
        db
          .collection("users")
          .doc(user.uid)
          .collection("private")
          .doc("loginData")
          .set(FirebaseUtil.toSimpleObject(user));
        db
          .collection("users")
          .doc(user.uid)
          .collection("public")
          .doc("userInfo")
          .set({
            hehe: "hehe"
          });
        // .set(stripSensitiveData(FirebaseUtil.toSimpleObject(user)));
        EventBus.info(`Successfully logged in as ${user.displayName}`);
      } else {
        this.$globals.currentUser = null;
      }
      this.unknownUserState = false;
    });
  }
};
</script>


<style scoped lang="scss">
#wait {
  text-align: center;
  padding-top: 30%;
  h3 {
    margin: 0 auto;
    margin-bottom: 1cm;
    font-size: 1cm;
    font-family: "Roboto";
  }
  img {
    max-height: 150px;
  }
}
</style>
