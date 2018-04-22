<template>
  <v-app>
    <div id="wait" v-if="unknownUserState">
      <h3>Please wait&hellip;</h3>
      <img src="@/assets/flask.svg">
    </div>
    <div id="app" v-else>
      <GlobalSnackbar></GlobalSnackbar>
      <v-navigation-drawer
        fixed
        v-model="drawer"
        app
      >
        <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="contactClicked">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer>
      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>egghead.space</v-toolbar-title>
        <v-spacer></v-spacer>
        <UserStatus/>
      </v-toolbar>
      <v-content>
        <transition name="component-fade" mode="out-in">
          <router-view/>
        </transition>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import firebase from "firebase";

import GlobalSnackbar from "@/components/GlobalSnackbar.vue";
import EventBus from "@/service/EventBus.js";
import UserStatus from "@/components/UserStatus.vue";
import FirebaseUtil from "@/service/FirebaseUtil.js";

import { db } from "@/firebase";

const stripSensitiveData = user => {
  const strippedUser = Object.assign({}, user);
  delete strippedUser["apiKey"];
  delete strippedUser["stsTokenManager"];
  return strippedUser;
};

export default {
  name: "App",
  components: {
    UserStatus,
    GlobalSnackbar
  },
  data() {
    return {
      drawer: null,
      unknownUserState: true
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userObject = FirebaseUtil.toSimpleObject(user);
        db
          .collection("users")
          .doc(user.uid)
          .collection("private")
          .doc("loginData")
          .set(userObject)
          .then(() => {
            db
              .collection("users")
              .doc(user.uid)
              .collection("public")
              .doc("userInfo")
              .set(stripSensitiveData(userObject));
          })
          .then(() => {
            this.$globals.currentUser = user;
            EventBus.info(`Successfully logged in as ${user.displayName}`);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.error("Login failed: ", error);
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.$globals.currentUser = null;
              })
              .catch(error => {
                // eslint-disable-next-line
                console.error("Could not logout after login error.", error);
              });
          });
      } else {
        this.$globals.currentUser = null;
      }
      this.unknownUserState = false;
    });
  },
  methods: {
    contactClicked: () => {
      // eslint-disable-next-line
      console.log("contact clicked");
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
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
