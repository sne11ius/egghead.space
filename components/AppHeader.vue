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
          <v-text-field
            solo
            id="search-textfield"
            v-model="searchText"
            label="Search a sketch"
            color="primary"
            :append-icon="appendIcon"
            @click:append="appendClicked"
            autocomplete="off"
            @focus="searchFocused = true"
            @blur="onBlur"
          ></v-text-field>
          <div id="search-results" v-if="searchFocused && showResults">
            <NoSSR>
              <ais-index
                app-id="QSRFL6Q5CD"
                api-key="a26b09dda38122c796ef7440027e29b7"
                index-name="sketches"
                :query="searchText"
                >
                <ais-results inline-template :results-per-page=5>
                  <div class="result-list">
                    <SketchTiny v-for="result in results" :key="result.objectID" :sketch="result"></SketchTiny>
                  </div>
                </ais-results>
                <ais-no-results>
                  <template slot-scope="props">
                    No sketches found for <i>{{ props.query }}</i>.
                  </template>
                </ais-no-results>
                <ais-powered-by></ais-powered-by>
              </ais-index>
            </NoSSR>
          </div>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import UserStatus from 'components/UserStatus.vue'
import SketchTiny from 'components/SketchTiny.vue'

export default {
  name: 'AppHeader',
  components: {
    UserStatus,
    SketchTiny,
    NoSSR
  },
  data () {
    return {
      searchText: '',
      isHydrated: false,
      searchFocused: false
    }
  },
  mounted () {
    this.isHydrated = true
  },
  methods: {
    openSketch (sketchId) {
      console.log(sketchId)
    },
    appendClicked () {
      if (this.showResults) {
        this.searchText = ''
      }
    },
    onBlur () {
      window.setTimeout(() => { this.searchFocused = false }, 500)
    }
  },
  computed: {
    breakpoint () {
      return this.isHydrated
        ? this.$vuetify.breakpoint.xs
        : true
    },
    isHomeView: function () {
      return this.$route.path === '/'
    },
    showResults () {
      return this.searchText.length > 0
    },
    appendIcon: function () {
      return this.showResults
        ? 'clear'
        : 'search'
    }
  }
}
</script>

<style lang="scss">
#search-textfield {
  .ais-input {
    border: 1px solid #333;
    border-radius: 3px;
    background-color: white;
  }
}
#search-results {
  position: relative;
  top: -27px;
  background-color: white;
  border-radius: 3px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #cacaca;
  background-color: #eee;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 0;
  .ais-powered-by {
    float: right;
    background-color: #eee;
    border: 1px solid #cacaca;
    border-top: 0;
    border-radius: 3px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding-top: 6px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    top: 0;
    right: -4px
  }
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
