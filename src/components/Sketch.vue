<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{title}}</h3>
    </v-card-title>
    <v-card-text v-html="body"></v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="$globals.currentUser.uid == sketch.createdBy.uid" flat icon color="error" title="Delete" @click="deleteSketch(sketch)">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import EventBus from "@/service/EventBus.js";
import { db } from "@/firebase";
const sketches = db.collection("sketches");

export default {
  props: ["sketch"],
  computed: {
    title() {
      return this.sketch.title;
    },
    body() {
      return this.marked(this.sketch.body || this.sketch.content || "");
    }
  },
  methods: {
    deleteSketch: sketch => {
      sketches
        .doc(sketch.id)
        .delete()
        .then(() => {
          EventBus.info(`Sketch '${this.title}' removed.`);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error("Could not remove sketch '${this.title}':", error);
          EventBus.info(`Could not remove sketch '${this.title}'.`);
        });
    }
  }
};
</script>

<style lang="scss">
.sketch.card + .sketch.card {
  margin-top: 15px;
}
.sketch .card__text img {
  max-width: 100%;
}
</style>
