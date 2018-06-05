<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex d-flex xs12 md6 lg4>
        <v-container fluid grid-list-lg id="featured-container">
          <v-layout row wrap>
            <v-flex>
              <v-card>
                <v-card-title>
                  <h3 class="headline">Featured sketch</h3>
                </v-card-title>
                <v-card-text v-html="featureText"></v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              <SketchSummary :sketch="featuredSketch"></SketchSummary>
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
              others think about it and<br>
              <v-btn id="create-btn" color="primary" router-link to="/create">create a sketch</v-btn>
            </p>
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
import TopSketches from "@/components/TopSketches.vue";
import SketchSummary from "@/components/SketchSummary.vue";
import { db } from "@/firebase";

const orderedSketches = db.collection("sketches").orderBy("created", "desc");

export default {
  name: "Home",
  components: {
    SketchSummary,
    TopSketches
  },
  data() {
    return {
      orderedSketches: [],
      featureText: "",
      featuredSketch: {
        id: "not_yet",
        body: "",
        title: "Loading...",
        created: "0",
        createdBy: {
          displayName: "Loading..."
        },
        createdByUid: "lazy"
      }
    };
  },
  created: function() {
    db.collection("featuredSketches")
      .orderBy("featuredSince", "desc")
      .limit(1)
      .get()
      .then(list => {
        let featured;
        list.forEach(item => {
          featured = item.data();
        });
        return featured;
      })
      .then(featured => {
        this.$bind("featuredSketch", featured.sketch);
        this.featureText = featured.featureText;
      });
  },
  firestore: {
    orderedSketches
  }
};
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
}
#create-btn {
  float: right;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
