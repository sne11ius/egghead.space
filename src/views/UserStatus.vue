<template>
  <div class="user-status">
    <md-dialog :md-active.sync="showSignInDialog" v-on:md-opened="dialogOpened">
      <div id="firebaseui-auth-container"></div>
    </md-dialog>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <md-button v-if="$globals.currentUser == null" @click="showSignInDialog = true">
      <md-icon class="fa fa-sign-in"></md-icon>
      <span class="button-text">Sign in</span>
    </md-button>
    <md-button v-else @click="logoutClicked">
      <md-icon class="fa fa-sign-out"></md-icon>
      <span class="button-text">Sign out</span>
    </md-button>
  </div>
</template>

<script>
import EventBus from "@/service/EventBus.js";
import firebase from "firebase";
import firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "UserStatus",
  components: {},
  data() {
    return {
      showSignInDialog: false
    };
  },
  methods: {
    logoutClicked() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$globals.currentUser = null;
          EventBus.info("Successfully logged out");
        })
        .catch(error => {
          console.error(error);
          EventBus.error("Could not logout");
        });
    },
    dialogOpened() {
      this.uiRendered = true;
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        signInFlow: "popup",
        callbacks: {
          signInSuccessWithAuthResult: () => {
            // no redirect
            this.showSignInDialog = false;
            return false;
          }
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#firebaseui-auth-container {
  margin-top: 14px;
  margin-bottom: 14px;
}
.user-status .button-text {
  padding-left: 6px;
  position: relative;
  top: 1px;
}
</style>
