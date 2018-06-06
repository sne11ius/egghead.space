<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card class="user-details">
          <v-card-title primary-title>
            <h3 v-if="!displayNameEditor" class="headline mb-0">{{user.displayName}}</h3>
            <span v-if="displayNameEditor">
              <v-text-field v-model="user.displayName"></v-text-field>
            </span>
            <v-btn v-if="isCurrentUser && !displayNameEditor" class="edit-inline" fab small flat color="primary" title="Change username" @click="showDisplayNameEditor">
              <v-icon>edit</v-icon>
            </v-btn>
            <div v-if="isCurrentUser && displayNameEditor" class="button-container">
              <v-btn title="Save changes" fab small flat color="primary" @click="updateDisplayName">
                <v-icon>check</v-icon>
              </v-btn>
              <v-btn v-if="displayNameEditor" title="Cancel" fab small flat color="error" @click="cancelDisplayNameEditor">
                <v-icon>cancel</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="avatar-container">
              <img v-if="user.photoURL" class="avatar" :src="user.photoURL" alt="avatar">
              <v-icon class="avatar" v-else>fas fa-user-circle</v-icon>
            </div>
            <v-btn v-if="isCurrentUser && !avatarEditor" fab small flat color="primary" title="Change avatar" @click="showAvatarEditor">
              <v-icon>edit</v-icon>
            </v-btn>
            <div v-if="isCurrentUser && avatarEditor" class="button-container">
              <div id="upload-area"></div>
              <v-btn title="Save changes" fab small flat color="primary" @click="saveAvatar">
                <v-icon>check</v-icon>
              </v-btn>
              <v-btn title="Cancel" fab small flat color="error" @click="cancelAvatarEditor">
                <v-icon>cancel</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        <h4 class="headline">Sketches created by {{user.displayName}}</h4>
        <SketchTiny v-for="sketch of userSketches" :key="sketch.id" :sketch="sketch"></SketchTiny>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-text>
            <v-icon medium class="total-likes-icon">fas fa-heart</v-icon> {{totalLikes}} earned eggs<br>
            <div class="details">
              Joined:<br>
              {{joinedDate}}<br>
            </div>
            <div class="comments">
              <h4 class="headline">Recent comments</h4>
              <Comment v-for="comment in comments" :comment="comment.ref" :key="comment.ref.id" :showUserLink=false :sketchLink="comment.refString"></Comment>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Uppy from "uppy/lib/core";
import Dashboard from "uppy/lib/plugins/Dashboard";
import FirebaseCloudStorage from "@/service/FirebaseCloudStorage";
import SketchTiny from "@/components/SketchTiny.vue";
import Comment from "@/components/Comment.vue";
import EventBus from "@/service/EventBus.js";
import { db, storage } from "@/firebase";
import { format } from "date-fns/";

import "uppy/dist/uppy.min.css";

const tempStorage = storage.ref().child("temp");

const sketches = db.collection("sketches");
const users = db.collection("users");

export default {
  name: "User",
  props: ["uid"],
  components: {
    SketchTiny,
    Comment
  },
  data() {
    return {
      userSketches: [],
      user: {
        displayName: "",
        createdAt: null
      },
      comments: [],
      oldDisplayName: "",
      displayNameEditor: false,
      avatarEditor: false,
      uppy: null,
      oldPhotoURL: ""
    };
  },
  computed: {
    totalLikes() {
      return (
        (this.userSketches.length > 0 &&
          this.userSketches
            .map(s => s.totalLikes || 0)
            .reduce((a, b) => a + b)) ||
        0
      );
    },
    joinedDate() {
      return format(new Date(parseInt(this.user.createdAt)), "MMMM D. YYYY");
    },
    isCurrentUser() {
      return (
        this.$globals.isAuthenticated &&
        this.$globals.currentUser.uid === this.user.uid
      );
    }
  },
  created: function() {
    this.$bind(
      "userSketches",
      sketches.where("createdByUid", "==", this.uid).orderBy("created", "desc")
    );
    this.$bind(
      "user",
      users
        .doc(this.uid)
        .collection("public")
        .doc("userInfo")
    );
    this.$bind(
      "comments",
      users
        .doc(this.uid)
        .collection("comments")
        .orderBy("created", "desc")
    );
  },
  methods: {
    updateDisplayName() {
      if (this.user.displayName.trim() === "") {
        EventBus.error(
          "Nothing is not a good user name. We're cool with `_` or `anon` or ... though."
        );
        return;
      }
      users
        .doc(this.uid)
        .collection("public")
        .doc("userInfo")
        .update({
          displayName: this.user.displayName
        })
        .then(() => {
          this.displayNameEditor = false;
        });
    },
    showDisplayNameEditor() {
      this.displayNameEditor = !this.displayNameEditor;
      this.oldDisplayName = this.user.displayName;
    },
    cancelDisplayNameEditor() {
      this.user.displayName = this.oldDisplayName;
      this.displayNameEditor = false;
    },
    showAvatarEditor() {
      this.avatarEditor = true;
      this.oldPhotoURL = this.user.photoURL;
      setTimeout(() => {
        this.uppy = Uppy({
          autoProceed: true,
          restrictions: {
            maxNumberOfFiles: 1,
            maxFileSize: 1000000,
            allowedFileTypes: [
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".JPG",
              ".JPEG",
              ".PNG",
              ".GIF"
            ]
          }
        })
          .use(Dashboard, {
            inline: true,
            target: "#upload-area",
            width: "300px",
            height: "100%",
            note: "Images only, up to 1 MB per file",
            showProgressDetails: true,
            proudlyDisplayPoweredByUppy: false,
            locale: {
              strings: {
                // Placeholder {browse} doesn't seem to work...
                // dropPaste: "Drop image here, paste or %{browse}"
              }
            }
          })
          .use(FirebaseCloudStorage, { storageRef: tempStorage })
          .run();
        const _this = this;
        this.uppy.on("upload-success", (file, snapshot) => {
          const newUrl = file.downloadUrl;
          _this.user.photoURL = newUrl;
          _this.user.photoPath = snapshot.ref.fullPath;
          _this.uppy.removeFile(file.id);
        });
      }, 0);
    },
    saveAvatar() {
      if (this.user.photoURL === this.oldPhotoURL) {
        this.cancelAvatarEditor();
      }
      const _this = this;
      users
        .doc(this.uid)
        .collection("public")
        .doc("userInfo")
        .update({
          photoURL: this.user.photoURL,
          photoPath: this.user.photoPath,
          photoURLDidChange: true
        })
        .then(() => {
          _this.uppy.close();
          _this.avatarEditor = false;
        });
    },
    cancelAvatarEditor() {
      this.uppy.close();
      this.avatarEditor = false;
      this.user.photoURL = this.oldPhotoURL;
    }
  }
};
</script>
<style lang="scss">
.user-details {
  #upload-area {
    display: inline-block;
    position: relative;
    top: -14px;
    left: 5px;
    margin-bottom: -14px;
    &:not(:empty) {
      height: 150px !important;
    }
    .uppy-Dashboard-inner {
      height: 100%;
    }
    .uppy-DashboardTabs {
      display: none;
    }
    .uppy-DashboardItem-preview {
      width: 89px !important;
      height: 89px !important;
    }
    .uppy-Dashboard-dropFilesTitle {
      position: relative !important;
      top: -94px !important;
    }
    .uppy-Dashboard-progressindicators {
      position: relative;
      top: -150px;
    }
    .uppy-Dashboard-note {
      position: absolute !important;
      top: 83px;
    }
    .uppy-Informer {
      transform: none !important;
      top: -160px;
    }
  }
}
</style>

<style lang="scss" scoped>
.user-details {
  margin-bottom: 15px;
  & .input-group {
    padding-top: 0px;
    position: relative;
    top: 10px;
  }
  .card__title {
    height: 92px !important;
  }
  .avatar {
    width: 150px;
    height: 150px;
    vertical-align: top;
    &.fa-user-circle:before {
      font-size: 140px;
    }
  }
  .avatar-container {
    display: inline-block;
    &.upload {
      background-color: red;
      height: 150px;
    }
  }
  .button-container {
    display: inline-block;
    & button {
      margin-right: 0;
      & + button {
        margin-left: 0;
      }
    }
  }
}
h4.headline {
  font-size: 20px !important;
  margin-top: 30px;
  margin-bottom: 10px;
}
.total-likes-icon {
  margin-right: 10px;
}
.details {
  margin-top: 15px;
}
.comments {
  margin-top: 15px;
}
</style>
