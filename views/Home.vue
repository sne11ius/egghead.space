<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex d-flex xs12 md6 lg4>
        <v-container id="featured-container">
          <v-layout row wrap>
            <v-flex>
              <v-card>
                <v-card-title>
                  <h3 class="headline">Featured sketch</h3>
                </v-card-title>
                <v-card-text v-html="featureText"></v-card-text>
                <v-flex>
                  <SketchSummary :sketch="featuredSketch"></SketchSummary>
                </v-flex>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex d-flex xs12 md6 lg4>
        <v-card>
          <v-card-title>
            <h2 class="headline">What is egghead.space</h2>
          </v-card-title>
          <v-card-text>
            <p>
              egghead.space is a place to share project ideas.
            </p>
            <p>
              I used to have various lists with notes for projects I don't have the time to actually
              work on. &ndash; .txt files, gists, paper notes flying around, being lost, forgotten
              and not always found again.
            </p>
            <p>
              Then one day came another idea: why not build central
              place to note project ideas? And while we're on it: why not share these ideas and
              maybe get some comments and suggestions?
            </p>
            <p>
              So this is that place: share, discuss and vote project ideas. Since "project idea" is
              a rather long term, we simply call them "sketches".
            </p>
          </v-card-text>
          <v-card-title>
            <h2 class="headline">Share a sketch</h2>
          </v-card-title>
          <v-card-text>
            <p>
              There's that one thingy you thought about and you think it's awesome. Find out what
              others think about it and
            </p>
            <v-btn id="create-btn" color="primary" router-link to="/create">create a sketch</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 md12 lg4>
        <TopSketches></TopSketches>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SketchSummary from 'components/SketchSummary.vue'
import TopSketches from 'components/TopSketches.vue'

export default {
  name: 'Home',
  components: {
    SketchSummary,
    TopSketches
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchFeatureText')
  },
  computed: {
    featureText () {
      return this.$store.state.featureText
    },
    featuredSketch () {
      return this.$store.state.featuredSketch
    }
  }
}
</script>

<style lang="scss">
#create-sketch-button {
  margin-top: 65px;
  right: 20px;
}
#featured-container {
  height: 100%;
  padding: 0;
  .flex {
    padding-bottom: 0;
    width: 100%;
    & + .flex {
      padding-top: 0;
    }
  }
  ul,
  ol {
    margin-left: 30px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
#create-btn {
  float: right;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
