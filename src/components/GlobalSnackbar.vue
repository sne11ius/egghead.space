<template>
  <md-snackbar :md-active.sync="showSnackbar" md-position="center" :md-duration="3000" class="global-snackbar">
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
      icon: "info",
      showSnackbar: false
    };
  },
  mounted() {
    EventBus.$on("global-snack", (text, type) => {
      this.icon = type;
      this.text = text;
      this.showSnackbar = true;
    });
  }
};
</script>

<style>
.global-snackbar .md-icon {
  margin-left: 0;
}
</style>
