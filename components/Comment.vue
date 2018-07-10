<template>
  <div class="comment" :id="this.comment.id">
    <h4 v-if="sketchTitle !== '_'" class="comment-header">For sketch &bdquo;{{sketchTitle}}&ldquo;</h4>
    <div class="comment-body">
      {{comment.body}}
    </div>
    <div class="comment-footer">
      <span v-if="showUserLink" class="author-link"><router-link :to="{name: 'user', params: {uid: this.comment.createdByUid, username: linkUsername}}">{{author}}</router-link></span>
      <span v-bind:class="{ created: true, fixPos: sketchLink !== ''}">{{creationDate}}</span>
      <v-btn v-if="sketchLink !== ''" class="details-link" :to="{name: 'sketch', params: {id: this.sketchId, commentId: this.commentId, title: this.sketchTitle.replace(/\s/g, '+')}}" flat small color="primary">
        Go to sketch
      </v-btn>
    </div>
  </div>
</template>

<script>
import FirebaseUtil from 'service/FirebaseUtil'
import { format } from 'date-fns/'

export default {
  name: 'Comment',
  props: {
    comment: {
      default: null
      // type: Object
    },
    showUserLink: {
      default: true,
      type: Boolean
    },
    sketchLink: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      sketchId: '_',
      sketchTitle: '_',
      commentId: '_'
    }
  },
  computed: {
    author () {
      return this.comment.createdBy.displayName
    },
    linkUsername () {
      return (
        this.comment &&
        this.comment.createdBy &&
        this.comment.createdBy.displayName &&
        this.comment.createdBy.displayName.replace(/\s/g, '+')
      )
    },
    creationDate () {
      if (!(this.comment && this.comment.created)) {
        return ''
      }
      return format(FirebaseUtil.toDate(this.comment.created), 'MMMM D. YYYY HH:mm')
    },
    deepLink () {
      return this.sketchLink
    }
  },
  mounted () {
    if (this.sketchLink) {
      db.doc(this.sketchLink)
        .parent.parent.get()
        .then(snapshot => {
          this.sketchId = snapshot.id
          this.sketchTitle = snapshot.data().title
          this.commentId = this.comment.id
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  border-bottom: 1px solid #0a6aa6;
  padding-bottom: 5px;
  padding-left: 8px;
  border-left: 1px solid #0a6aa6;
  padding-right: 5px;
  margin-bottom: 17px;
  .comment-body {
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .created {
    float: right;
    &.fixPos {
      padding-top: 13px;
    }
  }
  .author-link {
    margin-right: 20px;
  }
}
</style>
