<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs6>
        <Sketch :sketch="sketch" :showDetailsLink=false></Sketch>
      </v-flex>
      <v-flex xs6 class="details">
        <div class="likes">
          <v-icon v-if="didLike" large color="pink">favorite</v-icon>
          <v-icon v-else large color="grey">favorite</v-icon>
          <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
          <div v-else class="like-interaction">
            <v-btn v-if="didLike" icon @click="invertLike">
              <v-icon>remove</v-icon>
            </v-btn>
            <v-btn v-else icon @click="invertLike">
              <v-icon>add</v-icon>
            </v-btn>
          </div>
          <h5>
            <span v-if="0 === totalLikes">
              no
            </span>
            <span v-else>
              {{totalLikes}}&ensp;
            </span>egg<span v-if="1 < totalLikes">s</span> in the basket
            <span v-if="0 === totalLikes">
              yet
            </span>
          </h5>
        </div>
        <div>
          Meta data here...
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Firebase from "firebase";
import EventBus from "@/service/EventBus.js";
import Sketch from "@/components/Sketch.vue";
import { db } from "@/firebase";

const sketches = db.collection("sketches");

export default {
  name: "SketchDetails",
  props: ["id"],
  components: {
    Sketch
  },
  created: function() {
    this.$bind("sketch", sketches.doc(this.id));
  },
  data() {
    return {
      sketch: {
        id: "",
        body: "",
        createdBy: {
          displayName: ""
        },
        createdByUid: "lazy"
      },
      show: true,
      isLoading: false
    };
  },
  computed: {
    didLike: function() {
      if (!this.$globals.currentUser) {
        return false;
      } else {
        return (
          this.sketch.likes &&
          this.sketch.likes[this.$globals.currentUser.uid] &&
          this.sketch.likes[this.$globals.currentUser.uid].didLike
        );
      }
    },
    totalLikes: function() {
      return this.sketch.totalLikes || 0;
    }
  },
  methods: {
    invertLike: function() {
      if (!this.$globals.isAuthenticated) {
        EventBus.info("You must be logged in to share the love.");
        return;
      }
      this.isLoading = true;
      const currentUserId = this.$globals.currentUser.uid;
      const sketchRef = this.$firestoreRefs.sketch;
      const _this = this;
      db.runTransaction(function(transaction) {
        return transaction
          .get(sketchRef)
          .then(function(sketch) {
            if (!sketch.exists) {
              console.log("Cannot vote on a Sketch that doesn't exist.");
            }
            let totalLikes = sketch.data().totalLikes || 0;
            let likes = sketch.data().likes || {};
            if (likes[currentUserId] && likes[currentUserId].didLike) {
              likes[currentUserId] = {
                lastChanged: Firebase.firestore.FieldValue.serverTimestamp(),
                didLike: false
              };
              totalLikes--;
            } else {
              likes[currentUserId] = {
                lastChanged: Firebase.firestore.FieldValue.serverTimestamp(),
                didLike: true
              };
              totalLikes++;
            }
            transaction.update(sketchRef, {
              totalLikes: totalLikes,
              likes: likes
            });
          })
          .then(() => {
            _this.isLoading = false;
          })
          .catch(function(error) {
            console.log("Transaction failed: ", error);
            _this.isLoading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.details {
  padding: 7px;
  .likes {
    button {
      margin-left: 0px;
    }
    .like-interaction {
      display: inline-block;
    }
    h5 {
      display: inline-block;
      font-weight: normal;
      font-size: 16px;
      position: relative;
      top: 2px;
    }
  }
}
</style>
