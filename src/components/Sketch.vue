<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{title}}</h3>
    </v-card-title>
    <v-card-text v-html="body"></v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="sketch.createdBy && sketch.createdBy.uid && $globals.currentUser.uid == sketch.createdBy.uid" flat icon color="error" title="Delete this sketch" @click="deleteSketch(sketch)">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Firebase from "firebase";
import EventBus from "@/service/EventBus.js";
import { db } from "@/firebase";

const sketches = db.collection("sketches");
const deletedSketches = db.collection("deletedSketches");

const animalNames = [
  "Bearded Dragon",
  "Sugar Glider",
  "Hedgehog",
  "Fennec Fox",
  "Kinkajou",
  "Serval",
  "Wallaby",
  "Capybara",
  "Squirrel Monkey",
  "Slow Loris",
  "Giraffe",
  "Chameleon",
  "Duckling",
  "Deer",
  "Hippo",
  "Kitten",
  "Dolphin",
  "Panda",
  "Lamb",
  "Seal",
  "Puffer Fish",
  "Bunny",
  "Piglet",
  "Hamster",
  "Penguin"
];

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
    deleteSketch(sketch) {
      const animal =
        animalNames[Math.floor(Math.random() * animalNames.length)];
      this.$confirm(
        `Every time you delete a sketch a ${animal} <span style="white-space: nowrap">dies :(</span><br>Are you sure you want to do this?`,
        {
          title: "Delete sketch?"
        }
      ).then(yes => {
        if (yes) {
          sketch.deleted = Firebase.firestore.FieldValue.serverTimestamp();
          deletedSketches
            .add(sketch)
            .then(() => {
              sketches.doc(sketch.id).delete();
            })
            .then(() => {
              EventBus.info(`Sketch '${sketch.title}' removed.`);
            })
            .catch(error => {
              // eslint-disable-next-line
              console.error(`Could not remove sketch '${sketch.title}'.`, error);
              EventBus.info(`Could not remove sketch '${sketch.title}'.`);
            });
        }
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
