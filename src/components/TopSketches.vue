<template>
  <div id="top-sketches">
    <v-toolbar tabs>
      <v-tabs v-model="active">
        <v-tab ripple>Newest</v-tab>
        <v-tab ripple>Rating</v-tab>
        <v-tab ripple>Comments</v-tab>
        <v-tab-item>
          <sketch-tiny v-for="sketch in newestSketches" :sketch="sketch" :key="sketch.id"></sketch-tiny>
          <v-btn flat small color="primary">
            Show all
          </v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <sketch-tiny v-for="sketch in bestRatedSketches" :sketch="sketch" :key="sketch.id"></sketch-tiny>
            <v-btn flat small color="primary">
              Show all
            </v-btn>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            Most commented Sketches here
          </v-card>
        </v-tab-item>
        <v-spacer></v-spacer>
        <v-select
            id="time-period"
            :items="items"
            v-model="timePeriod"
            label="From..."
            single-line
            class="tabs__item"
            solo
          ></v-select>
      </v-tabs>
    </v-toolbar>
  </div>
</template>

<script>
import SketchTiny from "@/components/SketchTiny.vue";
import { db } from "@/firebase";

const newestSketches = db
  .collection("sketches")
  .orderBy("created", "desc")
  .limit(10);

const bestRatedSketches = db
  .collection("sketches")
  .orderBy("totalLikes", "desc")
  .limit(10);

export default {
  name: "TopSketches",
  components: {
    SketchTiny
  },
  data() {
    return {
      timePeriod: "This week",
      active: "",
      items: ["This week", "This month", "All time"],
      newestSketches: [],
      bestRatedSketches: []
    };
  },
  firestore: {
    newestSketches: newestSketches,
    bestRatedSketches: bestRatedSketches
  }
};
</script>

<style>
#top-sketches .toolbar__content {
  height: auto !important;
}
</style>

<style lang="scss" scoped>
#time-period {
  max-width: 153px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 0px 0 rgba(0, 0, 0, 0.14),
    0 1px 0px 0 rgba(0, 0, 0, 0.12);
}
</style>
