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
      <v-flex id="input-container" s12 md9>
        <v-card >
          <v-card-title>
            <h3 class="headline mb-0">{{pageTitle}}</h3>
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
            <v-btn color="primary" flat @click.stop="createSketch" :disabled="!$globals.isAuthenticated">{{submitButtonTitle}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex id="sign-in-warning" v-if="!$globals.isAuthenticated" s12 md3>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">You want to share an idea? Awesome!</h3>
          </v-card-title>
          <v-card-text>
            &hellip; but please sign in first or you won't be able to save.
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-else id="file-upload" s12 md3>
        <v-card>
          <MediaList :items="medias" v-on:add="add" v-on:remove="remove" ref="mediaList"></MediaList>
        </v-card>
        <v-card>
          <FileUpload v-on:media-added="mediaAdded" v-on:post-process="postProcess" ref="fileUpload" :storageRef="mediaStorageRef"></FileUpload>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MediaList from "@/components/MediaList.vue";
import FileUpload from "@/components/FileUpload.vue";
import Firebase from "firebase";
import EventBus from "@/service/EventBus.js";
import easymde from "easymde";
import "easymde/dist/easymde.min.css";
import { db, storage } from "@/firebase";

const sketches = db.collection("sketches");

let easyMde;

export default {
  name: "Create",
  components: {
    MediaList,
    FileUpload
  },
  props: ["id"],
  data() {
    return {
      sketches: [],
      title: "",
      body: "",
      showHelp: false,
      next: null,
      medias: []
    };
  },
  computed: {
    isEditMode() {
      return null !== this.id;
    },
    isCreateMode() {
      return !this.isEditMode;
    },
    pageTitle() {
      if (this.isEditMode) {
        return "Edit sketch";
      } else {
        return "Create new sketch";
      }
    },
    submitButtonTitle() {
      if (this.isCreateMode) {
        return "Let's do this";
      } else {
        return "Save changes";
      }
    },
    mediaStorageRef() {
      if (this.isEditMode) {
        return storage
          .ref()
          .child("medias")
          .child(this.id);
      } else {
        return storage.ref().child("temp");
      }
    }
  },
  created() {
    if (this.id) {
      sketches
        .doc(this.id)
        .get()
        .then(snapshot => {
          const sketch = snapshot.data();
          this.medias.push(...sketch.medias);
          this.title = sketch.title;
          this.body = sketch.body;
          easyMde.value(this.body);
        });
    }
  },
  mounted() {
    this.title = "";
    easyMde = new easymde({
      element: document.querySelectorAll("#sketch-body")[0],
      autoDownloadFontAwesome: false,
      hideIcons: ["side-by-side", "fullscreen"]
    });
    easyMde.value("");
  },
  beforeRouteLeave: function(to, from, next) {
    if (
      !this.$globals.isAuthenticated ||
      (this.title.length > 0 || (easyMde.value() && easyMde.value().length > 0))
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
      const body = easyMde.value();
      if (this.title.length === 0) {
        EventBus.error("Please add a title.");
        return;
      }
      if (body.length === 0) {
        EventBus.error("Please add a body.");
        return;
      }
      if (this.isEditMode) {
        EventBus.error(`Editing is not implemented yet.`);
        const medias = this.medias.map(({ url, preview }) => ({
          url,
          preview
        }));
        sketches
          .doc(this.id)
          .update({
            title: this.title,
            body,
            updated: Firebase.firestore.FieldValue.serverTimestamp(),
            updatedByUid: this.$globals.currentUser.uid,
            medias
          })
          .then(() => {
            EventBus.info(`Sketch '${this.title}' updated.`);
            const title = this.title;
            this.title = "";
            easyMde.value("");
            this.$router.push({
              name: "sketch",
              params: {
                id: this.id,
                title: title.replace(/\s/g, "+")
              }
            });
          });
      } else {
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
            body,
            created: Firebase.firestore.FieldValue.serverTimestamp(),
            medias: this.medias.map(media => {
              return {
                path: media.snapshot.fullPath,
                url: media.file.downloadUrl,
                preview: {
                  path: media.previewSnapshot.ref.fullPath,
                  url: media.previewDownloadUrl
                }
              };
            })
          })
          .then(() => {
            EventBus.info(`Sketch '${this.title}' created.`);
            this.title = "";
            easyMde.value("");
            this.$router.push("/");
          });
      }
    },
    mediaAdded(file, previewDownloadUrl, snapshot, previewSnapshot) {
      this.$refs.mediaList.stopIndicatePostProcess(file);
      this.medias.push({
        file,
        url: file.downloadUrl,
        preview: { url: previewDownloadUrl },
        snapshot,
        previewSnapshot
      });
    },
    postProcess(file) {
      this.$refs.mediaList.indicatePostProcess(file);
    },
    add(item) {
      const imageLink = `![Alt text](${item.url})`;
      const editor = easyMde.codemirror;
      const selection = editor.getSelection();
      if (selection.length > 0) {
        editor.replaceSelection(imageLink);
      } else {
        const doc = editor.getDoc();
        const cursor = doc.getCursor();
        const pos = {
          line: cursor.line,
          ch: cursor.ch
        };
        doc.replaceRange(imageLink, pos);
      }
    },
    remove(item, index) {
      if (this.isEditMode) {
        const body = easyMde.value();
        if (body.includes(item.url)) {
          const editor = easyMde.codemirror;
          const cursor = editor.getSearchCursor(item.url);
          cursor.findNext();
          editor.setSelection(cursor.pos.from, cursor.pos.to);
          EventBus.error(`Please remove from text first.`);
          return;
        }
      }
      this.medias.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
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
