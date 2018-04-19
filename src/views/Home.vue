<template>
  <div>
    <input v-if="$globals.isAuthenticated" v-model.trim="newSketchTitle" @keyup.enter="addSketch" placeholder="Add new sketch">
    <span v-else><b>Sign in to create a sketch</b></span>
    <br>
    Here are the sketches:
    <p v-for="sketch of sketches" :key="sketch.id">
      {{sketch.title}}:
      {{sketch.content}}<br>
    </p>
  </div>
</template>

<script>
import Firebase from "firebase";
import { db } from "@/firebase";

const sketches = db.collection("sketches");

export default {
  name: "home",
  components: {},
  data() {
    return {
      sketches: [],
      newSketchTitle: ""
    };
  },
  firestore: {
    sketches: sketches
  },
  methods: {
    addSketch() {
      sketches.add({
        title: this.newSketchTitle,
        content: "some content",
        created: Firebase.firestore.FieldValue.serverTimestamp()
      });
      this.newSketchTitle = "";
    }
  }
};
</script>
