<template>
  <div id="top-sketches">
    <v-toolbar tabs>
      <v-tabs v-model="active">
        <v-tab ripple>Newest</v-tab>
        <v-tab ripple>Rating</v-tab>
        <v-tab ripple>Comments</v-tab>
        <v-tab-item>
          <v-card>
            Newes Sketches here
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            Best rated Sketches here
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
export default {
  name: "TopSketches",
  data() {
    return {
      timePeriod: "This week",
      active: "",
      items: ["This week", "This month", "All time"]
    };
  }
};
</script>

<style lang="scss" scoped>
#time-period {
  max-width: 153px;
}
</style>
