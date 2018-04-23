<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="user-details">
          <v-card-title primary-title>
            <h3 class="headline mb-0">{{user.displayName}}</h3>
          </v-card-title>
          <v-card-text>
            This user created {{userSketches.length}} sketches so far.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat icon title="Heart this user">
              <v-icon>fas fa-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <Sketch v-for="sketch of userSketches" :key="sketch.id" :sketch="sketch"></Sketch>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Sketch from "@/components/Sketch.vue";
import { db } from "@/firebase";

const sketches = db.collection("sketches");
const users = db.collection("users");

export default {
  name: "User",
  props: ["uid"],
  components: {
    Sketch
  },
  created: function() {
    this.$bind(
      "userSketches",
      sketches.where("createdByUid", "==", this.uid).orderBy("created", "desc")
    );
    this.$bind(
      "user",
      users
        .doc(this.uid)
        .collection("public")
        .doc("userInfo")
    );
  },
  data() {
    return {
      userSketches: [],
      user: {
        displayName: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.user-details {
  margin-bottom: 15px;
}
</style>
