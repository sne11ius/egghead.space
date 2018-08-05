<template>
  <div id="app-header">
    <v-toolbar app class="main-toolbar" color="primary">
      <v-toolbar-title class="title small" v-if="breakpoint">
        <h1>
          <router-link to="/" class="home-link">
            <img src="/mr_egg_60.png">
            .space
          </router-link>
        </h1>
      </v-toolbar-title>
      <v-toolbar-title class="title" v-else>
        <h1>
          <router-link to="/" class="home-link">
            egghead.space
            <img src="/mr_egg_60.png">
          </router-link>
        </h1>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <NoSSR>
        <UserStatus></UserStatus>
      </NoSSR>
    </v-toolbar>
    <v-parallax src="header_image_2.jpeg" height="450" v-if="isHomeView" id="parallax">
    </v-parallax>
    <v-container fluid v-if="isHomeView" id="search-container">
      <v-layout row>
        <v-spacer></v-spacer>
        <v-flex xs12>
          <SearchBox></SearchBox>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import UserStatus from 'components/UserStatus.vue'
import SearchBox from 'components/SearchBox.vue'

export default {
  name: 'AppHeader',
  components: {
    UserStatus,
    SearchBox,
    NoSSR
  },
  data () {
    return {
      isHydrated: false
    }
  },
  mounted () {
    this.isHydrated = true
  },
  methods: {
    openSketch (sketchId) {
      console.log(sketchId)
    },
  },
  computed: {
    breakpoint () {
      return this.isHydrated
        ? this.$vuetify.breakpoint.xs
        : true
    },
    isHomeView: function () {
      return this.$route.path === '/'
    }
  }
}
</script>

<style lang="scss" scoped>
.main-toolbar {
  height: 90px;
  z-index: 1000;
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
#search-container {
  .row {
    transform: translate(0, 50%);
    height: 0;
    position: relative;
    top: -215px;
    z-index: 999;
    .xs12 {
      max-width: 500px;
    }
  }
}
</style>
