<template>
  <div class="user-status">
    <v-dialog v-model="showSignInDialog" transition="dialog-bottom-transition">
      <div id="firebaseui-auth-container"></div>
    </v-dialog>
    <v-btn v-if="$globals.currentUser == null" @click="openLoginDialog">
      <span>Sign in</span>
      <v-icon>fa fa-sign-in-alt</v-icon>
    </v-btn>
    <v-btn v-else @click="logoutClicked">
      <span>Sign out</span>
      <v-icon>fa fa-sign-out-alt</v-icon>
    </v-btn>
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
          // eslint-disable-next-line
          console.error(error);
          EventBus.error("Could not logout");
        });
    },
    openLoginDialog() {
      this.showSignInDialog = true;
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
.user-status {
  position: relative;
  top: 23px;
  right: 10px;
}
.user-status i {
  margin-left: 17px;
}
#firebaseui-auth-container {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
