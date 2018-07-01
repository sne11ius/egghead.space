import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    featured: []
  },
  mutations: {
    watchFeatured (state, featured) {
      state.featured = featured
    }
  },
  actions: {}
})
