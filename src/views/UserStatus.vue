<template>
  <div class="user-status">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <md-button v-if="!authenticated" @click="showLoginDialog">
      <md-icon class="fa fa-sign-in"></md-icon>
      <span class="button-text">Sign in</span>
    </md-button>
    <md-button v-else @click="logoutClicked">
      <md-icon class="fa fa-sign-out"></md-icon>
      <span class="button-text">Sign out</span>
    </md-button>
  </div>
</template>

<script>
// import EventBus from "@/service/EventBus.js";

export default {
  name: "UserStatus",
  props: ["authenticated"],
  methods: {
    showLoginDialog() {
      console.log("Show login...");
      this.$emit("loginClicked");
    },
    logoutClicked() {
      this.$emit("logoutClicked");
    }
  }
};
</script>

<style scoped>
.user-status .button-text {
  padding-left: 6px;
  position: relative;
  top: 1px;
}
</style>
