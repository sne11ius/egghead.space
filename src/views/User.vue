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
            <v-btn v-if="displayNameEditor" title="Save" fab small flat color="primary" @click="updateDisplayName">
              <v-icon>check</v-icon>
            </v-btn>
            <v-btn v-if="displayNameEditor" title="Cancel" fab small flat color="error" @click="cancelDisplayNameEditor">
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <img v-if="user.photoURL" class="avatar" :src="user.photoURL" alt="avatar">
            <v-icon class="avatar" v-else>fas fa-user-circle</v-icon>
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
import SketchTiny from "@/components/SketchTiny.vue";
import Comment from "@/components/Comment.vue";
import { db } from "@/firebase";
import { format } from "date-fns/";

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
      displayNameEditor: false
    };
  },
  computed: {
    totalLikes() {
      return (
        (this.userSketches.length > 0 &&
          this.userSketches.map(s => s.totalLikes).reduce((a, b) => a + b)) ||
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
    }
  },
  watch: {
    // user(user) {
    // console.log(user);
    // }
  }
};
</script>

<style lang="scss" scoped>
.user-details {
  margin-bottom: 15px;
  .avatar {
    width: 150px;
    vertical-align: top;
    &.fa-user-circle:before {
      font-size: 140px;
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
