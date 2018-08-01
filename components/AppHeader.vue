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
            id="search-textfield"
            v-model="searchText"
            label="Search a sketch"
            color="primary"
            solo
            append-icon="search"
            @click:append="search"
          ></v-text-field>
          <div id="search-results" v-if="showResults">
            <ais-index
              app-id="QSRFL6Q5CD"
              api-key="a26b09dda38122c796ef7440027e29b7"
              index-name="sketches"
              :query="searchText"
              >
              <ais-results>
                <template slot-scope="{ result }">
                  <div class="search-result">
                    <router-link :to="{name: 'SketchDetails', params: {id: result.objectID, title: result.title.replace(/\s/g, '+')}}">
                      <h3>
                        <ais-highlight :result="result" attribute-name="title"></ais-highlight>
                      </h3>
                      <h5><ais-highlight :result="result" attribute-name="body"></ais-highlight></h5>
                    </router-link>
                  </div>
                </template>
              </ais-results>
              <ais-no-results>
                <template slot-scope="props">
                  No sketches found for <i>{{ props.query }}</i>.
                </template>
              </ais-no-results>
              <NoSSR>
                <ais-powered-by></ais-powered-by>
              </NoSSR>
              </ais-index>
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
import EventBus from 'service/EventBus.js'

export default {
  name: 'AppHeader',
  components: {
    UserStatus,
    NoSSR
  },
  data () {
    return {
      searchText: '',
      isHydrated: false
    }
  },
  mounted () {
    this.isHydrated = true
  },
  methods: {
    search: function () {
      EventBus.info(`Searching for '${this.searchText}'`)
    },
    openSketch (sketchId) {
      console.log(sketchId)
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
  border: 1px solid #333;
  padding: 3px;
  color: black;
  .search-result {
    padding: 5px;
    a {
      text-decoration: none;
      color: black;
      :hover {
        background-color: #ddd;
      }
    }
    .ais-highlight em {
      background-color: #ddd;
    }
  }
  .ais-powered-by {
    float: right;
    background-color: #eee;
    border: 1px solid #333;
    border-top: 0;
    border-radius: 3px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding-top: 6px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    top: 3px;
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
