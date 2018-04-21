<template>
  <v-card class="sketch">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{title}}</h3>
    </v-card-title>
    <v-card-text v-html="body"></v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["sketch"],
  computed: {
    title() {
      return this.sketch.title;
    },
    body() {
      return this.marked(this.sketch.body || this.sketch.content || "");
    }
  }
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
