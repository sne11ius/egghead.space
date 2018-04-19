<template>
  <md-content class="md-elevation-1 sketch">
    <h3>{{title}}</h3>
    <span v-html="body"></span>
  </md-content>
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

<style lang="scss" scoped>
.sketch {
  padding: 7px;
}
</style>
