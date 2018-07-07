<template>
  <div id="top-sketches">
    <v-toolbar tabs flat>
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
            <sketch-tiny v-for="sketch in sketchesByComments" :sketch="sketch" :key="sketch.id"></sketch-tiny>
            <v-btn flat small color="primary">
              Show all
            </v-btn>
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
            class="tabs__item"
            append-icon=""
          ></v-select>
      </v-tabs>
    </v-toolbar>
  </div>
</template>

<script>
import SketchTiny from 'components/SketchTiny.vue'

export default {
  name: 'TopSketches',
  components: {
    SketchTiny
  },
  data() {
    return {
      timePeriod: 'week',
      activeTab: '0',
      items: [
        {
          label: '7 days',
          value: 'week'
        },
        {
          label: '30 days',
          value: 'month'
        },
        {
          label: 'Ever',
          value: 'allTime'
        }
      ]
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchTopSketches')
  },
  computed: {
    newest: function () {
      return this.$store.state.newest
    },
    sketchesByRating: function () {
      switch (this.timePeriod) {
        case "week":
          return this.$store.state.bestRatedLastWeek
        case "month":
          return this.$store.state.bestRatedLastMonth
        case "allTime":
          return this.$store.state.bestRatedAllTime
      }
    },
    sketchesByComments: function () {
      switch (this.timePeriod) {
        case "week":
          return this.$store.state.mostCommentedLastWeek
        case "month":
          return this.$store.state.mostCommentedLastMonth
        case "allTime":
          return this.$store.state.mostCommentedAllTime
      }
    }
  }
}
</script>

<style>
#top-sketches {
  max-width: 100%;
}

#top-sketches .toolbar {
  background-color: transparent;
}

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