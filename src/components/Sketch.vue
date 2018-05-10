<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{title}}</h3>
    </v-card-title>
    <v-card-text v-html="body"></v-card-text>
    <v-card-actions v-if="showDetailsLink">
      <v-spacer></v-spacer>
      <v-btn :to="{name: 'sketch', params: {id: this.sketch.id, title: this.sketch.title.replace(/\s/g, '+')}}" flat icon title="Details">
        <v-icon>more_horiz</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="showAuthor">
      by <router-link :to="{name: 'user', params: {uid: this.sketch.createdByUid}}">{{author}}</router-link>
    </v-card-actions>
  </v-card>
</template>

<script>
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
    },
    showAuthor: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    title() {
      return this.sketch.title;
    },
    body() {
      return this.marked(this.sketch.body);
    },
    author() {
      return this.sketch.createdBy.displayName;
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.sketch.card + .sketch.card {
  margin-top: 15px;
}
.sketch .card__text img {
  max-width: 100%;
}
</style>
