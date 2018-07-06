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
    },
    currentUser: null
  },
  actions: {
    fetchFeatureText ({ commit }) {
      return api.fetchFeatured(({ text, sketch }) => {
        commit('setFeatureText', text)
        commit('setFeaturedSketch', sketch)
      })
    },
    updateCurrentUser ({ commit }, userId) {
      console.log('update current user')
      return api.fetchPublicUserData(userId, snapshot => {
        commit('setCurrentUser', snapshot.data())
      })
    },
    removeCurrentUser ({ commit }) {
      console.log('remove current user')
      commit('setCurrentUser', null)
    }
  },
  mutations: {
    setFeatureText (state, featureText) {
      state.featureText = featureText
    },
    setFeaturedSketch (state, featuredSketch) {
      state.featuredSketch = featuredSketch
    },
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
    }
  }
})
