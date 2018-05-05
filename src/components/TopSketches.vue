<template>
  <div id="top-sketches">
    <v-toolbar tabs>
      <v-tabs v-model="activeTab">
        <v-tab ripple>Newest</v-tab>
        <v-tab ripple>Rating</v-tab>
        <v-tab ripple>Comments</v-tab>
        <v-tab-item>
          <sketch-tiny v-for="sketch in newest" :sketch="sketch" :key="sketch.id"></sketch-tiny>
          <v-btn flat small color="primary">
            Show all
          </v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <sketch-tiny v-for="sketch in sketchesByRating" :sketch="sketch" :key="sketch.id"></sketch-tiny>
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
            v-if="activeTab !== '0'"
            id="time-period"
            :items="items"
            item-text="label"
            item-value="value"
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

const newest = db
  .collection("sketches")
  .orderBy("created", "desc")
  .limit(10);

const bestRatedLastWeek = db
  .collection("sketches")
  .orderBy("likesLastWeek", "desc")
  .limit(10);

const bestRatedLastMonth = db
  .collection("sketches")
  .orderBy("likesLastMonth", "desc")
  .limit(10);

const bestRatedAllTime = db
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
      timePeriod: "week",
      activeTab: "0",
      items: [
        {
          label: "This week",
          value: "week"
        },
        {
          label: "This month",
          value: "month"
        },
        {
          label: "All time",
          value: "allTime"
        }
      ],
      newest: [],
      bestRatedAllTime: [],
      bestRatedLastWeek: [],
      bestRatedLastMonth: []
    };
  },
  computed: {
    sketchesByRating: function() {
      switch (this.timePeriod) {
        case "week":
          return this.bestRatedLastWeek;
        case "month":
          return this.bestRatedLastMonth;
        case "allTime":
          return this.bestRatedAllTime;
      }
    }
  },
  firestore: {
    newest: newest,
    bestRatedLastWeek: bestRatedLastWeek,
    bestRatedLastMonth: bestRatedLastMonth,
    bestRatedAllTime: bestRatedAllTime
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
