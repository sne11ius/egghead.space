<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <Sketch v-for="sketch of orderedSketches" :key="sketch.id" :sketch="sketch"></Sketch>
      </v-flex>
    </v-layout>
    <v-btn id="create-sketch-button" to="/create" title="Create new sketch" color="primary" fab top right fixed>
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import Sketch from "@/components/Sketch.vue";
import "simplemde/dist/simplemde.min.css";
import { db } from "@/firebase";

const orderedSketches = db.collection("sketches").orderBy("created", "desc");

export default {
  name: "Home",
  components: {
    Sketch
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
