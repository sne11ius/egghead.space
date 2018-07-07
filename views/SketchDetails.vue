<template>
  <v-container grid-list-lg>
    <v-dialog v-model="showFeatureThisDialog">
      <v-card>
        <v-card-title class="headline">Please enter a little teaser text</v-card-title>
        <v-card-text>
          <v-text-field multi-line v-model="featureThisText"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click.native="showFeatureThisDialog = false">Cancel</v-btn>
          <v-btn color="primary" flat="flat" @click.native="submitFeatureThis">Feature this!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <Sketch :sketch="sketch" :showDetailsLink=false :showAuthor=false></Sketch>
      </v-flex>
      <v-flex xs12 md6 class="details">
        <v-card>
          <v-card-text>
            <v-btn v-if="canEdit" :to="{name: 'edit', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" title="Edit this sketch">Edit</v-btn>
            <v-btn v-if="isModerator" @click="showFeatureThisDialog = true" title="Feature this sketch on the home page">Feature this</v-btn>
            <div class="likes">
              <v-icon v-if="didLike" large color="pink" :title="didLikeTitle">favorite</v-icon>
              <v-icon v-else large color="grey">favorite</v-icon>
              <v-progress-circular v-if="isLoading" class="wait-icon" indeterminate color="primary"></v-progress-circular>
              <div v-else class="like-interaction">
                <v-btn v-if="didLike" icon @click="invertLike" title="I want my egg back!">
                  <v-icon>remove</v-icon>
                </v-btn>
                <v-btn v-else icon @click="invertLike" title="Add an egg to the basket">
                  <v-icon>add</v-icon>
                </v-btn>
              </div>
              <h5>
                <span v-if="0 === totalLikes">
                  no
                </span>
                <span v-else>
                  {{totalLikes}}&nbsp;
                </span>egg<span v-if="1 < totalLikes">s</span> in the basket
                <span v-if="0 === totalLikes">
                  yet
                </span>
              </h5>
            </div>
            <div class="author-link">
              Author: <router-link :to="{name: 'user', params: {uid: this.sketch.createdByUid, username: this.sketch.createdBy.displayName.replace(/\s/g, '+')}}">{{this.sketch.createdBy.displayName}}</router-link>
            </div>
            <div class="created">Date: {{creationDate}}</div>
            <div class="comments">
              <div class="create-comment">
                <v-btn icon color="primary" title="Write comment" v-scroll-to="'#comment-textfield'" @click="focusCommentTextfield">
                  <v-icon>add</v-icon>
                </v-btn>
              </div>
              <h2>{{comments.length}} Comments</h2>
              <Comment v-for="comment in comments" :comment="comment" :key="comment.id"></Comment>
              <v-text-field
                id="comment-textfield"
                v-model="newCommentBody"
                label="Add a comment"
                hint="Please be polite ;)"
                ref="commentTextfield"
                multi-line
              ></v-text-field>
              <v-btn class="submitComment" :disabled="this.newCommentBody.length === 0" small color="primary" @click="submitComment">Submit comment</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Firebase from "firebase";
import EventBus from "service/EventBus.js";
import Sketch from "components/Sketch.vue";
import Comment from "components/Comment.vue";
import { distanceInWordsToNow, format } from "date-fns/";
import { db } from "@/firebase";

const sketches = db.collection("sketches");

export default {
  name: "SketchDetails",
  props: ["id", "commentId"],
  components: {
    Sketch,
    Comment
  },
  created: function() {
    this.$bind("sketch", sketches.doc(this.id));
    this.$bind(
      "comments",
      sketches
        .doc(this.id)
        .collection("comments")
        .orderBy("created", "asc")
    );
  },
  mounted: function() {
    if (this.commentId) {
      setTimeout(() => {
        const commentEl = document.getElementById(this.commentId);
        this.$scrollTo(commentEl, 1000, {
          onDone() {
            commentEl.classList.add("highlight");
          }
        });
      }, 500);
    }
    if (!this.$globals.isAuthenticated) {
      return;
    }
    db.collection("moderators")
      .doc(this.$globals.currentUser.uid)
      .get()
      .then(moderatorInfo => {
        this.isModerator =
          moderatorInfo.exists && moderatorInfo.data().isModerator;
      });
  },
  data() {
    return {
      // Weird route/component-binding stuff forces us to add details...
      sketch: {
        id: "",
        body: "",
        created: "0",
        createdBy: {
          displayName: "Loading..."
        },
        createdByUid: "lazy"
      },
      comments: [],
      show: true,
      isLoading: false,
      newCommentBody: "",
      showFeatureThisDialog: false,
      featureThisText: "",
      isModerator: false
    };
  },
  computed: {
    canEdit: function() {
      return (
        this.$globals.isAuthenticated &&
        (this.$globals.currentUser.uid === this.sketch.createdByUid ||
          this.isModerator)
      );
    },
    didLike: function() {
      if (!this.$globals.currentUser) {
        return false;
      } else {
        return (
          this.sketch.likes &&
          this.sketch.likes[this.$globals.currentUser.uid] &&
          this.sketch.likes[this.$globals.currentUser.uid].didLike
        );
      }
    },
    didLikeTitle: function() {
      return `You added your egg ${distanceInWordsToNow(
        this.sketch.likes[[this.$globals.currentUser.uid]].lastChanged.toDate()
      )} ago`;
    },
    totalLikes: function() {
      return this.sketch.totalLikes || 0;
    },
    creationDate: function() {
      if (!(this.sketch.created && this.sketch.created.toDate)) {
        return "Created a long time ago";
      }
      return format(this.sketch.created.toDate(), "MMMM D. YYYY HH:mm");
    }
  },
  watch: {
    didLike: function() {
      this.isLoading = false;
    }
  },
  methods: {
    submitComment: function() {
      if (!this.$globals.isAuthenticated) {
        EventBus.info("Please sign in to submit your comment.");
        return;
      }
      const userRef = db
        .collection("users")
        .doc(this.$globals.currentUser.uid)
        .collection("public")
        .doc("userInfo");
      sketches
        .doc(this.id)
        .collection("comments")
        .add({
          createdBy: userRef,
          createdByUid: this.$globals.currentUser.uid,
          body: this.newCommentBody,
          created: Firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(ref => {
          return db
            .collection("users")
            .doc(this.$globals.currentUser.uid)
            .collection("comments")
            .add({
              ref,
              refString: `sketches/${this.id}/comments/${ref.id}`,
              created: Firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
          this.newCommentBody = "";
        })
        .catch(error => {
          EventBus.error("Comment creation failed: " + error);
        });
    },
    invertLike: function() {
      if (!this.$globals.isAuthenticated) {
        EventBus.info("You must be logged in to share the love.");
        return;
      }
      this.isLoading = true;
      const currentUserId = this.$globals.currentUser.uid;
      const sketchRef = this.$firestoreRefs.sketch;
      const _this = this;
      db.runTransaction(function(transaction) {
        return transaction
          .get(sketchRef)
          .then(function(sketch) {
            if (!sketch.exists) {
              EventBus.error("Cannot vote on a Sketch that doesn't exist.");
            }
            let totalLikes = sketch.data().totalLikes || 0;
            let likes = sketch.data().likes || {};
            if (likes[currentUserId] && likes[currentUserId].didLike) {
              likes[currentUserId] = {
                lastChanged: Firebase.firestore.FieldValue.serverTimestamp(),
                didLike: false
              };
              totalLikes--;
            } else {
              likes[currentUserId] = {
                lastChanged: Firebase.firestore.FieldValue.serverTimestamp(),
                didLike: true
              };
              totalLikes++;
            }
            transaction.update(sketchRef, {
              totalLikes: totalLikes,
              likes: likes
            });
          })
          .catch(function(error) {
            EventBus.error("Could not change vote: " + error);
            _this.isLoading = false;
          });
      });
    },
    submitFeatureThis: function() {
      db.collection("featuredSketches")
        .add({
          sketch: db.collection("sketches").doc(this.sketch.id),
          featureText: this.featureThisText,
          featuredSince: Firebase.firestore.FieldValue.serverTimestamp(),
          featuredBy: this.$globals.currentUser.uid
        })
        .then(() => {
          this.showFeatureThisDialog = false;
          this.featureThisText = "";
        })
        .catch(error => {
          EventBus.error("Could not feature this sketch: " + error);
        });
    },
    focusCommentTextfield: function() {
      this.$refs.commentTextfield.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.details {
  .v-card {
    padding-bottom: 15px;
  }
  .likes {
    min-height: 60px;
    button {
      margin-left: 0px;
    }
    .wait-icon {
      height: 28px !important;
      width: 28px !important;
      position: relative;
      top: 10px;
      left: 4px;
      margin-top: 0;
      margin-left: 0;
      margin-right: 16px;
    }
    .like-interaction {
      display: inline-block;
    }
    h5 {
      display: inline-block;
      font-weight: normal;
      font-size: 16px;
      position: relative;
      top: 2px;
    }
  }
  .created {
    border-bottom: 1px solid #0a6aa6;
    padding-bottom: 20px;
  }
  .created,
  .comments {
    margin-top: 10px;
  }
  .comments {
    padding-top: 30px;
    .create-comment {
      float: right;
      position: relative;
      top: -5px;
      button {
        margin-right: 0;
        top: 0px;
      }
    }
    & h2 {
      margin-bottom: 10px;
    }
  }
}
@keyframes highlight {
  0% {
    background: #f3f39d;
  }
  100% {
    background: none;
  }
}

.highlight {
  animation: highlight 3s;
}
</style>

<style lang="scss">
.comments button {
  float: right;
  margin-right: 0;
  margin-top: 0;
  position: relative;
  top: -12px;
}
</style>
