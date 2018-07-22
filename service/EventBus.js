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
    },
    debug(text, data) {
      this.$emit(
        "global-snack",
        `${text} ${JSON.stringify(data, null, 2)}`,
        "info"
      );
    }
  }
});

export default bus;
