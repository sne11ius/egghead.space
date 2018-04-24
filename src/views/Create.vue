<template>
  <v-container grid-list-md fluid fill-height>
    <v-dialog v-model="showHelp" max-width="580px">
      <v-card>
        <v-card-title>
          <h3 class="headline mb-0">Help</h3>
        </v-card-title>
        <v-card-text class="help">
          <p>You can control which image we choose for your sketches preview:
            <ol>
              <li>Make the URL end with "preview_image":<br>
                Example: <code>![Alt txt](https://xmpl.url/image.jpeg#<u>preview_image</u> "title txt")</code>
              </li>
              <li>Include "preview image" in the alt text:.<br>
                Example: <code>![Alt txt. Used for <u>preview image</u>](https://xmpl.url/image.jpeg "title txt")</code>
              </li>
              <li>Include "preview image" in the title text:<br>
                Example: <code>![Alt txt](https://xmpl.url/image.jpeg "Title txt. Used for <u>preview image</u>"")</code>
              </li>
              <li>If you don't give us any hints, we will just use the first image and call it a day.
              </li>
            </ol>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.stop="showHelp=false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex id="input-container">
        <v-card >
          <v-card-title>
            <h3 class="headline mb-0">Create new sketch</h3>
            <v-spacer></v-spacer>
            <v-btn @click="showHelp = true" flat icon>
              <v-icon>help_outline</v-icon>
            </v-btn>
          </v-card-title>
          <div id="protip">
            Protip:
            <p>If you include images in your sketch (which you totally should btw),
            we will include one of them in your sketches preview. Click Help to see how.
            </p>
          </div>
          <v-card-text>
            <v-text-field v-model="title" required label="Add a good title"></v-text-field>
            <div id="editor">
              <textarea id="sketch-body" placeholder="Write something interesting"></textarea>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat to="/">Cancel</v-btn>
            <v-btn color="primary" flat @click.stop="createSketch" :disabled="!$globals.isAuthenticated">Let's do this</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex id="sign-in-warning" v-if="!$globals.isAuthenticated">
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">You want to share an idea? Awesome!</h3>
          </v-card-title>
          <v-card-text>
            &hellip; but please sign in first or you won't be able to save.
          </v-card-text>
        </v-card>
      </v-flex>
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
      showHelp: false,
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
      const body = simpleMde.value();
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
          createdByUid: this.$globals.currentUser.uid,
          title: this.title,
          body: body,
          created: Firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          EventBus.info(`Sketch '${this.title}' created.`);
          this.title = "";
          simpleMde.value("");
          this.$router.push("/");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#sign-in-warning {
  flex: 40;
}
#input-container {
  flex: 100;
}
.CodeMirror,
.CodeMirror-scroll {
  max-height: 50px;
}
#protip {
  margin-left: 50px;
  margin-right: 30px;
}
.help ol {
  margin: 10px 10px 15px 30px;
  li + li {
    margin-top: 7px;
  }
}
</style>
