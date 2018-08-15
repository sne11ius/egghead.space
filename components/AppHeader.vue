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
      <v-toolbar-title class="title" v-show="!breakpointXs">
        <h1 v-if="showTextTitle">
          <router-link to="/" class="home-link">
            egghead.space
          </router-link>
        </h1>
        <router-link to="/" class="home-link" v-show="!showTextTitle">
          <canvas id="hipster-title" width="600" height="128"></canvas>
        </router-link>
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
      isHydrated: false,
      showTextTitle: true
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
    this.isHydrated = true
    if (this.showTextTitle && !this.breakpointXs) {
      this.updateCanvas()
    }
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
  },
  methods: {
    updateCanvas () {
      const _this = this
      window.setTimeout(() => {
        const ParticleText = require('./particle-text.js')
        const config = {
          canvas: 'hipster-title', // id of the canvas element
          canvasWidth: 600,
          canvasHeight: 128,
          density: 4, // # of pixels a particle represents
          size: 4, // size of the particles
          font: {
            color: '#fff',
            size: 18,
            family: 'Hi Melody',
            weight: 'normal'
          },
          orbit: {
            speed: 5000
          }
        }
        // eslint-disable-next-line
        new ParticleText.default('egghead.space', config)
        _this.showTextTitle = false
      }, 0)
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
  }
  h1 {
    font-size: 59px;
    display: inline-block;
    font-family: 'Hi Melody', cursive;
    padding-top: 22px;
    padding-left: 5px;
  }
  #hipster-title {
    height: 110px;
    width: 600px;
    position: relative;
    left: -119px;
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
