<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6 lg4 v-for="sketch of orderedSketches" :key="sketch.id">
        <v-card flat tile>
          <SketchSummary :sketch="sketch"></SketchSummary>
        </v-card>
      </v-flex>
    </v-layout>
    <v-btn id="create-sketch-button" to="/create" title="Create new sketch" color="primary" fab top right fixed>
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import SketchSummary from "@/components/SketchSummary.vue";
import "simplemde/dist/simplemde.min.css";
import { db } from "@/firebase";

const orderedSketches = db.collection("sketches").orderBy("created", "desc");

export default {
  name: "Home",
  components: {
    SketchSummary
  },
  data() {
    return {
      orderedSketches: []
    };
  },
  firestore: {
    orderedSketches: orderedSketches
  }
};
</script>

<style lang="scss">
#create-sketch-button {
  margin-top: 65px;
  right: 20px;
}
</style>
