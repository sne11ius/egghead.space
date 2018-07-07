<template>
  <v-card class="sketch tiny" @click.native="cardClicked">
    <div class="image">
      <img v-if="this.sketch.previewImage" :src="this.sketch.previewImage">
      <div v-else class="preview-placeholder"></div>
    </div>
    <div class="summary">
      <h3 class="text-title">{{title}}</h3>
      <div class="counter-wrap">
        <span class="counter" :title="likesTitle"><v-icon>fas fa-heart</v-icon> {{sketch.totalLikes || 0 }}</span><br>
        <span class="counter" :title="commentsTitle"><v-icon>fas fa-comment</v-icon> {{sketch.commentCount || 0}}</span>
      </div>
    </div>
    <v-btn class="details-link" :to="{name: 'sketch', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" flat small color="primary">
      Show more
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: "SketchTiny",
  props: {
    sketch: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  computed: {
    title () {
      const maxLength = 50
      let truncatedTitle = this.sketch.title.substr(0, maxLength)
      if (truncatedTitle.length < this.sketch.title.length) {
        truncatedTitle += "..."
      }
      return truncatedTitle
    },
    likesTitle () {
      if (!this.sketch.totalLikes || this.sketch.totalLikes === 0) {
        return "No likes yet."
      }
      return this.sketch.totalLikes + " people like this sketch";
    },
    commentsTitle () {
      if (!this.sketch.commentCount || this.sketch.commentCount === 0) {
        return "No comments yet."
      }
      return this.sketch.commentCount + " people commented on this sketch"
    }
  },
  methods: {
    cardClicked () {
      this.$router.push({ id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+') })
    }
  }
}
</script>

<style lang="scss" scoped>
.sketch.tiny {
  a:not(.btn) {
    color: black;
  }
  &.card {
    padding: 7px;
    padding-bottom: 0;
    margin-bottom: 3px;
    margin-top: 3px;
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline;
      position: absolute;
      top: 7px;
      font-size: 20px;
      font-weight: normal;
    }
    .details-link {
      position: absolute;
      top: 74px;
      right: 0px;
    }
  }
  .image {
    display: inline-block;
    img {
      max-width: 100px;
      height: 100px;
      display: block;
    }
    .preview-placeholder {
      background-color: #cacaca;
      width: 100px;
      height: 100px;
      float: left;
      &:after {
        content: "No\Apreview\Ayet";
        white-space: pre;
        position: relative;
        top: 15px;
        left: 15px;
      }
    }
  }
  .summary {
    display: inline-block;
    margin-left: 8px;
    .counter-wrap {
      position: relative;
      bottom: 10px;
      .counter {
        .icon {
          width: 25px;
          height: 25px;
          margin-right: 6px;
        }
        min-width: 100px;
        display: inline-block;
      }
      br + .counter {
        margin-top: 7px;
      }
    }
  }
}
</style>
