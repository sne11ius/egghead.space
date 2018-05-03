<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs6>
        <Sketch :sketch="sketch" :showDetailsLink=false></Sketch>
      </v-flex>
      <v-flex xs6>
        <v-btn v-if="didLike" flat icon color="grey" @click="invertLike">
          <v-icon>favorite</v-icon>
        </v-btn>
        <v-btn v-else flat icon color="pink" @click="invertLike">
          <v-icon>favorite</v-icon>
        </v-btn>
        Meta data here...
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
      show: true
    };
  },
  computed: {
    didLike: function() {
      if (!this.$globals.currentUser) {
        console.log("No current user");
        return false;
      } else {
        console.log("Current user");
        return (
          this.sketch.likes && this.sketch.likes[this.$globals.currentUser.uid]
        );
      }
    }
  },
  methods: {
    rerender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        console.log("re-render start");
        this.$nextTick(() => {
          console.log("re-render end");
        });
      });
    },
    invertLike: function() {
      console.log(JSON.stringify(this.sketch));
      console.log(`Current user id: ${this.$globals.currentUser.uid}`);
      const currentUserId = this.$globals.currentUser.uid;
      const sketchRef = this.$firestoreRefs.sketch;
      const _this = this;
      db.runTransaction(function(transaction) {
        return transaction
          .get(sketchRef)
          .then(function(sketch) {
            if (!sketch.exists) {
              throw Error("Cannot vote on a Sketch that doesn't exist.");
            }
            let totalLikes = sketch.data().totalLikes || 0;
            let likes = sketch.data().likes || {};
            if (likes[currentUserId]) {
              console.log(`Found likes for user ${currentUserId}`);
              likes[currentUserId] = null;
              totalLikes--;
            } else {
              console.log(`Found no likes for user ${currentUserId}`);
              likes[currentUserId] = true;
              totalLikes++;
            }
            transaction.update(sketchRef, {
              totalLikes: totalLikes,
              likes: likes
            });
          })
          .then(function() {
            console.log("Transaction successfully committed!");
            _this.rerender();
          })
          .catch(function(error) {
            console.log("Transaction failed: ", error);
          });
      });
    }
  }
};
</script>
