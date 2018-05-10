<template>
  <v-card class="sketch tiny">
    <div class="image">
      <img v-if="this.sketch.previewImage" :src="this.sketch.previewImage">
      <div v-else class="preview-placeholder"></div>
      <v-icon>fas fa-heart</v-icon> {{sketch.totalLikes || 0 }}<br>
      <v-icon>fas fa-comment</v-icon> {{sketch.commentCount || 0}}
    </div>
    <h3 class="text-title" v-html="title"></h3>
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
        return {};
      },
      type: Object
    }
  },
  computed: {
    title() {
      const maxLength = 50;
      return this.sketch.title.substr(0, maxLength);
    }
  }
};
</script>

<style lang="scss" scoped>
.sketch.tiny {
  &.card {
    padding: 7px;
    margin-bottom: 3px;
    margin-top: 3px;
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline;
      margin-left: 5px;
      position: absolute;
      top: 7px;
      font-size: 20px;
      font-weight: normal;
    }
    .details-link {
      position: absolute;
      top: 76%;
      right: 0px;
    }
  }
  .image {
    .icon {
      width: 30px;
      height: 30px;
    }
    display: inline-block;
    img {
      max-width: 100px;
      height: 100px;
      display: block;
      margin-bottom: 5px;
    }
    .preview-placeholder {
      background-color: #cacaca;
      width: 100px;
      height: 100px;
      margin-bottom: 5px;
      &:after {
        content: "No\Apreview\Ayet";
        white-space: pre;
        position: relative;
        top: 15px;
        left: 15px;
      }
    }
  }
}
</style>
