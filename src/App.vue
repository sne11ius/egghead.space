<template>
  <v-app>
    <div id="wait" v-if="unknownUserState">
      <h3>Please wait&hellip;</h3>
      <img src="@/assets/flask.svg">
    </div>
    <div id="app" v-else>
      <GlobalSnackbar></GlobalSnackbar>
      <AppHeader></AppHeader>
      <v-content v-bind:class="{ isHome: isHomeView }">
        <transition name="component-fade" mode="out-in">
          <router-view/>
        </transition>
        <v-footer height="auto" color="accent">
          <router-link to="/about">
            Made with
          </router-link>
          <router-link to="/about">
            <img src="egg.svg" class="egg">
          </router-link>
          <v-spacer></v-spacer>
          <router-link to="/about">
            &copy; 2018
          </router-link>
          &emsp;|&emsp;
          <router-link to="/about">
            Imprint
          </router-link>
          &emsp;|&emsp;
          <router-link to="/about">
            Privacy policy
          </router-link>
        </v-footer>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import firebase from "firebase";

import GlobalSnackbar from "@/components/GlobalSnackbar.vue";
import AppHeader from "@/components/AppHeader.vue";
import FirebaseUtil from "@/service/FirebaseUtil.js";

import { db } from "@/firebase";

const mkPublicInfo = ({ createdAt, displayName, photoURL, uid }) => ({
  createdAt,
  displayName,
  photoURL,
  uid
});

export default {
  name: "App",
  components: {
    AppHeader,
    GlobalSnackbar
  },
  data() {
    return {
      unknownUserState: true,
      /* eslint-disable no-undef */
      gitHash: __COMMIT_HASH__,
      commitUrl:
        "https://github.com/sne11ius/egghead.space/commits/" + __COMMIT_HASH__,
      gitBranch: __BRANCH_NAME__
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userObject = FirebaseUtil.toSimpleObject(user);
        db.collection("users")
          .doc(user.uid)
          .collection("private")
          .doc("loginData")
          .set(userObject)
          .then(() => {
            const publicInfo = db
              .collection("users")
              .doc(user.uid)
              .collection("public")
              .doc("userInfo");
            return publicInfo.get().then(snapshot => {
              if (!snapshot.exists) {
                return publicInfo.set(mkPublicInfo(userObject));
              }
              return snapshot.data();
            });
          })
          .then(() => {
            this.$globals.loadUser(user.uid);
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
  },
  computed: {
    isHomeView: function() {
      return this.$route.path === "/";
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
#app footer {
  width: 100%;
  color: white;
  padding-left: 8px;
  padding-right: 8px;
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .egg {
    height: 20px;
    padding-left: 3px;
    padding-right: 1px;
    position: relative;
    top: 4px;
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
main.content {
  padding-top: 90px !important;
  height: 0;
}
main.content.isHome {
  padding-top: 0px !important;
}
</style>
