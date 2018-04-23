<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline text-title" v-html="title"></h3>
    </v-card-title>
    <v-card-text v-html="truncatedBody" class="text-preview fade-out"></v-card-text>
    <v-card-actions>
      <span class="author-link">by <router-link :to="{name: 'user', params: {uid: this.sketch.createdByUid}}">{{author}}</router-link></span>
      <v-spacer></v-spacer>
      <v-btn v-if="showDetailsLink" :to="{name: 'sketch', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" flat>
        Show more
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import striptags from "striptags";

export default {
  props: {
    sketch: {
      default: () => {
        return {};
      },
      type: Object
    },
    showDetailsLink: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    title() {
      const maxLength = 28;
      return this.sketch.title.length <= maxLength
        ? this.sketch.title
        : this.sketch.title.substr(0, maxLength) + "&hellip;";
    },
    truncatedBody() {
      const html = this.marked(this.sketch.body);
      const truncatedBody = striptags(html, ["p"])
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");
      console.log(`truncated: ${truncatedBody}`);
      return truncatedBody;
    },
    author() {
      return this.sketch.createdBy.displayName;
    }
  }
};
</script>

<style lang="scss">
.sketch {
  .text-title {
    overflow: hidden;
  }
  .text-preview {
    height: 100px;
    overflow: hidden;
  }
  .fade-out {
    position: relative;
    max-height: 350px; // change the height
  }
  .fade-out:after {
    /* prettier-ignore */
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* prettier-ignore */
    background-image: linear-gradient( rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 100% );
  }
  .author-link {
    position: relative;
    top: 15px;
    left: -5px;
    a {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
  .author-link,
  .author-link a {
    color: #666;
  }
}
</style>
