<template>
  <div class="user-status">
    <v-dialog v-model="showSignInDialog" transition="dialog-bottom-transition" max-width="500px">
      <div id="firebaseui-auth-container"></div>
    </v-dialog>
    <v-btn v-if="$globals.currentUser == null" @click="openLoginDialog" fab title="Sign in" small>
      <v-icon>fa fa-sign-in-alt</v-icon>
    </v-btn>
    <v-speed-dial v-else direction="bottom" transition="slide-y-transition" :open-on-hover="$globals.mouseActive">
      <v-btn fab slot="activator" small>
        <v-avatar v-if="$globals.currentUser.photoURL" >
          <img class="avatar" :src="$globals.currentUser.photoURL" alt="avatar">
        </v-avatar>
        <v-icon v-else>fas fa-user-circle</v-icon>
      </v-btn>
      <v-btn fab small title="Open profile" :to="{name: 'user', params: {uid: $globals.currentUser.uid, username: linkUsername}}">
        <v-icon>fa fa-id-card</v-icon>
      </v-btn>
      <v-btn fab small title="Sign out" @click="logoutClicked" >
        <v-icon>fa fa-sign-out-alt</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script>
import EventBus from "service/EventBus.js"
import { api } from 'api'
import "firebaseui/dist/firebaseui.css"

const auth = api.auth
let firebaseui

export default {
  name: "UserStatus",
  components: {},
  data() {
    return {
      showSignInDialog: false
    };
  },
  computed: {
    linkUsername() {
      return this.$globals.currentUser.displayName.replace(/\s/g, "+");
    }
  },
  methods: {
    logoutClicked() {
      auth
        .signOut()
        .then(() => {
          this.$globals.currentUser = null;
        })
        .catch(() => {
          EventBus.error("Could not logout.");
        });
    },
    openLoginDialog() {
      this.showSignInDialog = true;
      const ui =
        api.firebaseui.auth.AuthUI.getInstance() ||
        new api.firebaseui.auth.AuthUI(auth);
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
          api.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          api.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          api.firebase.auth.GithubAuthProvider.PROVIDER_ID,
          api.firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-status {
  position: relative;
  top: 13px;
  right: 8px;
}
.user-status i.fa-sign-out-alt {
  margin-left: 4px;
}
#firebaseui-auth-container {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
