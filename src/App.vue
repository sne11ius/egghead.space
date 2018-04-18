<template>
  <div class="page-container">
    <div id="wait" v-if="unknownUserState">
      <h3>Please wait&hellip;</h3>
      <img src="@/assets/flask.svg">
    </div>
    <div id="app" v-else>
      <GlobalSnackbar></GlobalSnackbar>
      <sign-in-dialog :show="showSignInDialog" v-on:cancelClicked="showSignInDialog = false"></sign-in-dialog>
      <md-app>
        <md-app-toolbar class="md-primary">
          <h3 class="md-title" style="flex: 1">egghead.space</h3>
          <!--md-button v-if="currentUser !== null" class="md-icon-button">
            <img :src="currentUser.photoURL">
          </md-button-->
          <UserStatus :authenticated="currentUser !== null" v-on:loginClicked="showSignInDialog = true" v-on:logoutClicked="logoutClicked"/>
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
import GlobalSnackbar from "@/components/GlobalSnackbar.vue";
import EventBus from "@/service/EventBus.js";
import UserStatus from "@/views/UserStatus.vue";
import SignInDialog from "@/views/SignInDialog.vue";
import firebase from "firebase";

export default {
  components: {
    GlobalSnackbar,
    UserStatus,
    SignInDialog
  },
  data() {
    return {
      unknownUserState: true,
      currentUser: null,
      showSignInDialog: false
    };
  },
  mounted() {
    console.log("mounted");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.showSignInDialog = false;
        EventBus.info(`Successfully logged in as ${user.displayName}`);
      } else {
        // console.log(`no user`);
      }
      this.unknownUserState = false;
    });
  },
  methods: {
    logoutClicked() {
      console.log("logout clicked");
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.currentUser = null;
          EventBus.info("Successfully logged out");
        })
        .catch(error => {
          console.error(error);
          EventBus.error("Could not logout");
        });
    }
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
