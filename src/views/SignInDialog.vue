<template>
  <md-dialog :md-active.sync="show" v-on:md-opened="dialogOpened" :md-close-on-esc="false" :md-click-outside-to-close="false">
    <div id="firebaseui-auth-container"></div>
    <md-button @click="cancel">Cancel</md-button>
  </md-dialog>
</template>

<script>
import firebase from "firebase";
import firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  props: ["show"],
  data() {
    return {};
  },
  methods: {
    dialogOpened() {
      console.log("Dialog opened");
      this.uiRendered = true;
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        signInFlow: "popup",
        callbacks: {
          signInSuccessWithAuthResult: function() {
            // no redirect
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
    },
    cancel() {
      this.$emit("cancelClicked");
    }
  }
};
</script>

<style lang="scss" scoped>
#firebaseui-auth-container {
  margin-top: 14px;
}
</style>
