<template>
  <md-snackbar md-position="center" ref="snackbar" :md-duration="3000" class="global-snackbar">
    <md-icon>{{ icon }}</md-icon>
    <span>{{ text }}</span>
  </md-snackbar>
</template>

<script>
import EventBus from "@/service/EventBus";

export default {
  name: "GlobalSnackbar",
  data() {
    return {
      text: "",
      icon: "info"
    };
  },
  mounted() {
    const _this = this;
    EventBus.$on("global-snack", function(text, type) {
      _this.icon = type;
      _this.text = text;
      _this.$refs.snackbar.open();
    });
  }
};
</script>

<style>
.global-snackbar .md-icon {
  margin-left: 0;
}
</style>
