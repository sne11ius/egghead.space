<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{title}}</h3>
    </v-card-title>
    <v-card-text v-html="body"></v-card-text>
  </v-card>
</template>

<script>
import MarkdownRenderer from 'service/MarkdownRenderer'

export default {
  props: {
    sketch: {
      default: () => {
        return {}
      },
      type: Object
    },
    showAuthor: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    title () {
      return this.sketch.title
    },
    body () {
      return MarkdownRenderer.render(this.sketch.body)
    }
  }
}
</script>

<style lang="scss">
.sketch .v-card__text {
  img {
    max-width: 100%;
  }
  ul,
  ol {
    margin-left: 30px;
    margin-bottom: 16px;
  }
}
</style>
