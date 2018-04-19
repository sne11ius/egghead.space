<template>
  <div>
    <input v-model.trim="newSketchTitle" @keyup.enter="addSketch" placeholder="Add new sketch"><br>
    Here are the sketches:
    <p v-for="sketch of sketches" :key="sketch.id">
      {{sketch.title}}:
      {{sketch.content}}<br>
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
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
