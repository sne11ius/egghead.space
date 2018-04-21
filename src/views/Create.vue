<template>
  <v-container fluid fill-height>
    <v-layout child-flex>
      <v-card id="input-container" v-if="$globals.isAuthenticated">
        <v-card-title>
          <h3 class="headline mb-0">Create new sketch</h3>
        </v-card-title>
        <v-text-field v-model="title" required label="Add a good title"></v-text-field>
        <div id="editor">
          <textarea id="sketch-body" placeholder="Write something interesting"></textarea>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat to="/">Cancel</v-btn>
          <v-btn color="primary" flat @click.stop="createSketch">Let's do this</v-btn>
        </v-card-actions>
      </v-card>
      <v-card>
        Please <v-btn to="/login">login</v-btn> to create s sketch.
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Firebase from "firebase";
import EventBus from "@/service/EventBus.js";
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css";
import { db } from "@/firebase";

const sketches = db.collection("sketches");

let simpleMde;

export default {
  name: "Create",
  data() {
    return {
      sketches: [],
      title: "",
      body: "",
      dialog: false,
      next: null
    };
  },
  mounted() {
    this.title = "";
    simpleMde = new SimpleMDE({
      element: document.querySelectorAll("#sketch-body")[0],
      autoDownloadFontAwesome: false,
      hideIcons: ["side-by-side", "fullscreen"]
    });
    simpleMde.value("");
  },
  // eslint-disable-next-line
  beforeRouteLeave: function(to, from, next) {
    if (
      !this.$globals.isAuthenticated ||
      (this.title.length > 0 ||
        (simpleMde.value() && simpleMde.value().length > 0))
    ) {
      this.$confirm("Are u sure you want to trash all your edits?").then(
        res => {
          next(res);
        }
      );
    } else {
      next(true);
    }
  },
  methods: {
    createSketch() {
      const body = (simpleMde && simpleMde.value()) || "";
      if (this.title.length === 0) {
        EventBus.error("Please add a title.");
        return;
      }
      if (body.length === 0) {
        EventBus.error("Please add a body.");
        return;
      }
      const userRef = db
        .collection("users")
        .doc(this.$globals.currentUser.uid)
        .collection("public")
        .doc("userInfo");
      sketches
        .add({
          createdBy: userRef,
          title: this.title,
          body: body,
          created: Firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          EventBus.info(`Sketch '${this.title}' created.`);
          this.$router.push("/");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#input-container {
  padding-left: 10px;
  padding-right: 10px;
}
.CodeMirror,
.CodeMirror-scroll {
  max-height: 500px;
}
</style>
