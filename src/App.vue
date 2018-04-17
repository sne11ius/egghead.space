<template>
  <div class="page-container">
    <GlobalSnackbar></GlobalSnackbar>
    <sign-in-dialog></sign-in-dialog>
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
        <div class="md-toolbar-section-end">
          <UserStatus/>
        </div>
      </md-app-toolbar>
      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item to="/">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>
          <md-list-item to="about">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import GlobalSnackbar from "@/components/GlobalSnackbar.vue";
// import EventBus from "@service/EventBus.js";
import UserStatus from "@/views/UserStatus.vue";
import SignInDialog from "@/views/SignInDialog.vue";

export default {
  components: {
    GlobalSnackbar,
    UserStatus,
    SignInDialog
  },
  mounted() {
    console.log("mounted");
  }
};
</script>


<style scoped lang="scss">
/*
  Place styles here
*/
</style>
