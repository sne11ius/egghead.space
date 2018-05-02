<template>
  <v-toolbar app class="main-toolbar" color="primary">
    <v-toolbar-title class="title">
      <h1>
        <router-link to="/" class="home-link">
          egghead.space
        </router-link>
      </h1>
      <img src="logo_200.png">
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <UserStatus/>
  </v-toolbar>
</template>

<script>
import UserStatus from "@/components/UserStatus.vue";

export default {
  name: "AppHeader",
  components: {
    UserStatus
  }
};
</script>

<style lang="scss" scoped>
.main-toolbar {
  height: 90px;
  .title {
    overflow: visible;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
  }
  h1 {
    font-size: 38px;
    display: inline-block;
  }
  img {
    height: 60px;
    position: relative;
    top: 17px;
    margin-left: 20px;
  }
  .home-link {
    text-decoration: none;
    color: white;
  }
}
</style>
