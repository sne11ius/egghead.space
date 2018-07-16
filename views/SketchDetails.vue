<template>
  <v-container grid-list-lg>
    <v-dialog v-model="showFeatureThisDialog">
      <v-card>
        <v-card-title class="headline">Please enter a little teaser text</v-card-title>
        <v-card-text>
          <v-textarea v-model="featureThisText"></v-textarea>
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
        <Sketch :sketch="sketch"></Sketch>
      </v-flex>
      <v-flex xs12 md6 class="details">
        <v-card>
          <v-card-text>
            <v-btn v-if="canEdit" :to="{name: 'edit', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" title="Edit this sketch">Edit</v-btn>
            <v-btn v-if="isModerator" @click="showFeatureThisDialog = true" title="Feature this sketch on the home page">Feature this</v-btn>
            <div class="likes">
              <v-icon v-if="didLike" large color="pink" class="heart" :title="didLikeTitle">favorite</v-icon>
              <v-icon v-else large color="grey" class="heart">favorite</v-icon>
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
              <v-textarea
                id="comment-textfield"
                v-model="newCommentBody"
                label="Add a comment"
                hint="Please be polite ;)"
                ref="commentTextfield"
              ></v-textarea>
              <v-btn class="submitComment" :disabled="this.newCommentBody.length === 0" small color="primary" @click="submitComment">Submit comment</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { api } from 'api'
import { distanceInWordsToNow, format } from 'date-fns/'

import EventBus from 'service/EventBus'
import FirebaseUtil from 'service/FirebaseUtil'
import Sketch from 'components/Sketch.vue'
import Comment from 'components/Comment.vue'

export default {
  name: 'SketchDetails',
  props: ['id', 'commentId'],
  components: {
    Sketch,
    Comment
  },
  data () {
    return {
      showFeatureThisDialog: false,
      featureThisText: '',
      isLoading: false,
      newCommentBody: ''
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchDetailSketch', route.params.id)
  },
  mounted: function () {
    if (this.commentId) {
      setTimeout(() => {
        const commentEl = document.getElementById(this.commentId)
        this.$scrollTo(commentEl, 1000, {
          onDone () {
            commentEl.classList.add('highlight')
          }
        })
      }, 500)
    }
  },
  computed: {
    sketch () {
      return this.$store.state.sketchDetails
    },
    comments () {
      return this.$store.state.sketchDetailsComments
    },
    isModerator () {
      return this.$store.state.isModerator
    },
    currentUser () {
      return this.$store.state.currentUser
    },
    isAuthor () {
      return this.currentUser !== null && this.currentUser.uid === this.sketch.createdByUid
    },
    canEdit () {
      return this.isAuthor || this.isModerator
    },
    didLike: function () {
      if (this.currentUser === null) {
        return false
      } else {
        return (
          this.sketch.likes &&
          this.sketch.likes[this.currentUser.uid] &&
          this.sketch.likes[this.currentUser.uid].didLike
        )
      }
    },
    didLikeTitle: function () {
      const lastChanged = this.sketch.likes[[this.currentUser.uid]].lastChanged
      const date = FirebaseUtil.toDate(lastChanged)
      return `You added your egg ${distanceInWordsToNow(date)} ago`
    },
    totalLikes: function () {
      return this.sketch.totalLikes || 0
    },
    creationDate: function () {
      if (!this.sketch.created) {
        return 'Created a long time ago'
      }
      return format(FirebaseUtil.toDate(this.sketch.created), 'MMMM D. YYYY HH:mm')
    }
  },
  watch: {
    didLike: function () {
      this.isLoading = false
    }
  },
  methods: {
    submitComment: function () {
      if (this.currentUser === null) {
        EventBus.info('Please sign in to submit your comment.')
        return
      }
      api.submitComment(this.currentUser.uid, this.sketch.id, this.newCommentBody)
        .then(() => {
          this.newCommentBody = ''
        })
        .catch(error => {
          EventBus.error('Comment creation failed: ' + error)
        })
    },
    invertLike: function () {
      if (this.currentUser === null) {
        EventBus.info('You must be logged in to share the love.')
        return
      }
      this.isLoading = true
      api
        .invertLike(this.currentUser.uid, this.sketch.id)
        .then(() => {
          this.isLoading = false
        })
        .catch(error => {
          EventBus.error(error)
          this.isLoading = false
        })
    },
    submitFeatureThis: function () {
      api
        .submitFeatureThis(this.sketch.id, this.featureThisText, this.currentUser.uid)
        .then(() => {
          this.showFeatureThisDialog = false
          this.featureThisText = ''
        })
        .catch(error => {
          EventBus.error('Could not feature this sketch: ' + error)
        })
    },
    focusCommentTextfield: function () {
      this.$refs.commentTextfield.focus()
    }
  }
}
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
    i.v-icon.heart {
      position: relative;
      top: 10px;
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
