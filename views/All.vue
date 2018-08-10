<template>
  <div class="all">
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-spacer></v-spacer>
        <v-flex d-flex xs12 md8 lg8>
          <v-card>
            <v-card-title>
              <h1 class="headline">All sketches</h1>
            </v-card-title>
            <TopSketches mode="all"></TopSketches>
          </v-card>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import TopSketches from 'components/TopSketches.vue'

export default {
  name: 'All',
  components: {
    TopSketches
  }
}
</script>

<style lang="scss" scoped>

</style>
