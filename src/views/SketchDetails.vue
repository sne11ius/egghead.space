<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <Sketch :sketch="sketch" :showDetailsLink=false></Sketch>
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
      }
    };
  }
};
</script>
