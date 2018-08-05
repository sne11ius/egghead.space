<template>
  <div class="search-box">
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
      v-bind:class="{ showResults: showResults }"
    ></v-text-field>
    <div id="search-results" v-if="showResults">
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
  </div>
</template>

<script>
import SketchTiny from 'components/SketchTiny'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'SearchBox',
  components: {
    NoSSR,
    SketchTiny
  },
  data () {
    return {
      searchText: '',
      searchFocused: false
    }
  },
  computed: {
    showResults () {
      return this.searchFocused && this.searchText.length > 0
    },
    appendIcon: function () {
      return this.showResults
        ? 'clear'
        : 'search'
    }
  },
  methods: {
    appendClicked () {
      if (this.showResults) {
        this.searchText = ''
      }
    },
    onBlur () {
      // If we set this instantly, navigation will not work
      window.setTimeout(() => { this.searchFocused = false }, 500)
    }
  }
}
</script>

<style lang="scss">
.search-box {
  .v-input__slot {
    border-radius: 3px;
  }
  .showResults {
    .v-input__slot {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
#search-results {
  position: relative;
  top: -28px;
  background-color: white;
  border-bottom-left-radius: 3px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #cacaca;
  background-color: #eee;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 1px;
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
