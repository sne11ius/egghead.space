<template>
  <div id="app-header">
    <v-toolbar app class="main-toolbar" color="secondary">
      <v-toolbar-title class="title small" v-if="$vuetify.breakpoint.xs">
        <h1>
          <img src="logo_200.png">
          <router-link to="/" class="home-link">
            .space
          </router-link>
        </h1>
      </v-toolbar-title>
      <v-toolbar-title class="title" v-else>
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
    <v-parallax src="header_image_2.jpeg" height="450" v-if="isHomeView" id="parallax">
      <v-container fluid>
        <v-layout row>
          <v-spacer></v-spacer>
          <v-flex xs12>
            <v-text-field
              id="search"
              v-model="searchText"
              label="Search a sketch"
              color="primary"
              solo
              append-icon="search"
              :append-icon-cb="search"
            ></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
      </v-container>
    </v-parallax>
  </div>
</template>

<script>
import UserStatus from "@/components/UserStatus.vue";
import EventBus from "@/service/EventBus.js";

export default {
  name: "AppHeader",
  components: {
    UserStatus
  },
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    search: function() {
      EventBus.info(`Searching for '${this.searchText}'`);
    }
  },
  computed: {
    isHomeView: function() {
      return this.$route.path === "/";
    }
  }
};
</script>

<style lang="scss" scoped>
.main-toolbar {
  height: 90px;
  .title {
    overflow: visible;
    position: absolute;
    &:not(.small) {
      left: 50%;
      transform: translate(-50%, 0%);
    }
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
#parallax {
  margin-top: 90px;
  .row {
    transform: translate(0%, 50%);
    height: 80%;
    .xs12 {
      max-width: 500px;
    }
  }
}
</style>
