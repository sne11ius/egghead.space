<template>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <Sketch v-for="sketch of orderedSketches" :key="sketch.id" :sketch="sketch"></Sketch>
        </v-flex>
      </v-layout>
      <v-dialog v-model="displayDialog">
        <v-card id="input-container">
          <v-card-title>Create new sketch</v-card-title>
          <v-text-field v-model="title" label="Title"></v-text-field>
          <textarea id="sketch-body" placeholder="Write something interesting"></textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.stop="displayDialog = false">Cancel</v-btn>
            <v-btn color="primary" flat @click.stop="createSketch">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn @click="showCreateSketchDialog" id="create-sketch-button" v-if="$globals.isAuthenticated" title="Create new sketch" color="primary" fab top right fixed>
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
</template>

<script>
import Firebase from "firebase";
import Sketch from "@/components/Sketch.vue";
import EventBus from "@/service/EventBus.js";
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css";
import { db } from "@/firebase";

const allSketches = db.collection("sketches");
const orderedSketches = allSketches.orderBy("created", "desc");

let simpleMde;

export default {
  name: "home",
  components: {
    Sketch
  },
  data() {
    return {
      allSketches: [],
      orderedSketches: [],
      title: "",
      body: "",
      displayDialog: false
    };
  },
  firestore: {
    allSketches: allSketches,
    orderedSketches: orderedSketches
  },
  watch: {
    displayDialog: function(newVal) {
      if (!newVal) {
        this.title = "";
        simpleMde && simpleMde.value("");
      }
    }
  },
  methods: {
    showCreateSketchDialog() {
      this.displayDialog = true;
      // eslint-disable-next-line
      simpleMde = simpleMde || new SimpleMDE({
          element: document.querySelectorAll("#sketch-body")[0],
          autoDownloadFontAwesome: false,
          hideIcons: ["side-by-side", "fullscreen"]
        });
    },
    createSketch() {
      const body = (simpleMde && simpleMde.value()) || "";
      const userRef = db
        .collection("users")
        .doc(this.$globals.currentUser.uid)
        .collection("public")
        .doc("userInfo");
      allSketches
        .add({
          createdBy: userRef,
          title: this.title,
          body: body,
          created: Firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          EventBus.info(`Sketch '${this.title}' created.`);
          this.displayDialog = false;
        });
    }
  }
};
</script>

<style lang="scss">
#input-container {
  padding-left: 10px;
  padding-right: 10px;
}
.CodeMirror,
.CodeMirror-scroll {
  max-height: 500px;
}
#create-sketch-button {
  margin-top: 65px;
  right: 20px;
}
</style>
