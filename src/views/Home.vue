<template>
  <div>
    <div v-show="$globals.isAuthenticated">
      <md-content class="md-elevation-1 " id="input-container">
        <md-field>
          <label>Title here!</label>
          <md-input v-model="title"></md-input>
          <span class="md-helper-text">Please add a nice title</span>
        </md-field>
        <md-divider></md-divider>
        <textarea id="sketch-body" placeholder="Please add a body"></textarea>
        <div class="md-layout md-alignment-top-right">
          <md-button class="md-primary md-alignment-top-right" @click="addSketch">Create sketch</md-button>
        </div>
      </md-content>
    </div>
    <span v-show="!$globals.isAuthenticated"><b>Sign in to create a sketch</b></span>
    <br>
    Here are the sketches:
    <p v-for="sketch of sketches" :key="sketch.id">
      <Sketch :sketch="sketch"></Sketch>
    </p>
  </div>
</template>

<script>
import Firebase from "firebase";
import Sketch from "@/components/Sketch.vue";
import EventBus from "@/service/EventBus.js";
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css";
import { db } from "@/firebase";

const sketches = db.collection("sketches");

let simpleMde;

export default {
  name: "home",
  components: {
    Sketch
  },
  data() {
    return {
      sketches: [],
      title: "",
      body: ""
    };
  },
  firestore: {
    sketches: sketches
  },
  mounted() {
    // eslint-disable-next-line
    simpleMde = new SimpleMDE({
      element: document.querySelectorAll("#sketch-body")[0],
      forceSync: true,
      hideIcons: ["fullscreen"]
    });
  },
  methods: {
    addSketch() {
      const body = (simpleMde && simpleMde.value()) || "";
      sketches.add({
        createdBy: this.$globals.currentUser.uid,
        title: this.title,
        body: body,
        created: Firebase.firestore.FieldValue.serverTimestamp()
      });
      EventBus.info(`Sketch '${this.title}' created.`);
      this.title = "";
      simpleMde && simpleMde.value("");
    }
  }
};
</script>

<style lang="scss">
#input-container {
  padding: 10px;
}
.CodeMirror,
.CodeMirror-scroll {
  max-height: 500px;
}
</style>
