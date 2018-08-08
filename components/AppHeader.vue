<template>
  <div id="app-header">
    <AjaxIndicator></AjaxIndicator>
    <v-toolbar app class="main-toolbar" color="primary">
      <v-toolbar-title class="title small" v-if="breakpointXs">
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
    <v-parallax src="creativity.jpg" height="550" v-if="isHomeView" id="parallax">
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
import AjaxIndicator from 'components/AjaxIndicator.vue'
import UserStatus from 'components/UserStatus.vue'
import SearchBox from 'components/SearchBox.vue'
import ParticlesConfig from 'components/particles.config.json'

export default {
  name: 'AppHeader',
  components: {
    AjaxIndicator,
    UserStatus,
    SearchBox,
    NoSSR
  },
  data () {
    return {
      isHydrated: false
    }
  },
  updated () {
    if (this.isHomeView) {
      require('particles.js')
      // eslint-disable-next-line no-undef
      particlesJS('parallax', ParticlesConfig)
      // We could have altered particles.js to create the node
      // were we need it, but it's easier to just move it to the correct node...
      const particlesCanvas = document.querySelectorAll('.v-parallax .particles-js-canvas-el')[0]
      document
        .querySelectorAll('.v-parallax__image-container')[0]
        .appendChild(particlesCanvas)
    }
  },
  mounted () {
    this.isHydrated = true
  },
  computed: {
    breakpointXs () {
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

<style lang="scss">
.particles-js-canvas-el {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  height: 950px !important;
}
</style>

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
  height: 0;
  padding: 0;
  .row {
    transform: translate(0, 50%);
    height: 0;
    position: relative;
    top: -260px;
    z-index: 999;
    .xs12 {
      max-width: 500px;
    }
  }
}
</style>
