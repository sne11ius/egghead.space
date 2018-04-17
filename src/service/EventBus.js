import Vue from "vue";

const bus = new Vue({
  methods: {
    info(text) {
      this.snack(text);
    },
    snack(text) {
      this.$emit("global-snack", text, "info");
    },
    error(text) {
      this.$emit("global-snack", text, "error");
    }
  }
});

export default bus;
