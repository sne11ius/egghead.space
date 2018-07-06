import Vue from 'vue'
import Vuex from 'vuex'

import { api } from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    featureText: '',
    featuredSketch: {
      title: '',
      body: ''
    }
  },
  actions: {
    fetchFeatureText ({ commit, dispatch }) {
      return api.fetchFeatured(({ text, sketch }) => {
        commit('setFeatureText', text)
        commit('setFeaturedSketch', sketch)
      })
    }
  },
  mutations: {
    setFeatureText (state, featureText) {
      state.featureText = featureText
    },
    setFeaturedSketch (state, featuredSketch) {
      state.featuredSketch = featuredSketch
    }
  }
})
