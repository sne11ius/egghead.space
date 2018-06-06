<template>
  <v-card class="sketch" flat tile>
    <v-card-media v-if="this.sketch.previewImage" :src="this.sketch.previewImage" height="200px"></v-card-media>
    <v-card-title primary-title>
      <h3 class="headline text-title" v-html="title"></h3>
    </v-card-title>
    <v-card-text v-text="strippedBody" class="text-preview fade-out"></v-card-text>
    <v-card-actions>
      <span class="author-link">by <router-link :to="{name: 'user', params: {uid: this.sketch.createdByUid, username: this.sketch.createdBy.displayName.replace(/\s/g, '+')}}">{{author}}</router-link></span>
      <v-spacer></v-spacer>
      <v-btn v-if="showDetailsLink" :to="{name: 'sketch', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" flat small color="primary">
        Show more
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import striptags from "striptags";
import shave from "shave";

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
  mounted: function() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleResize);
  },
  updated() {
    this.$nextTick(() => {
      this.handleResize();
    });
  },
  computed: {
    title() {
      const maxLength = 50;
      return this.sketch.title.substr(0, maxLength);
    },
    strippedBody() {
      const headingsRegex = /(<h1>.*<\/h1>)|(<h2>.*<\/h2>)|(<h3>.*<\/h3>)|(<h4>.*<\/h4>)|(<h5>.*<\/h5>)|(<h6>.*<\/h6>)/g;
      return striptags(
        this.marked(this.sketch.body).replace(headingsRegex, "")
      );
    },
    author() {
      return this.sketch.createdBy.displayName;
    }
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        shave(".text-preview", 130);
      });
    }
  }
};
</script>

<style lang="scss">
.sketch {
  .text-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text-preview {
    height: 100px;
    overflow: hidden;
  }
  .author-link {
    position: relative;
    top: 12px;
    left: -4px;
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
