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
    sketchDetails: {
      title: ''
    },
    sketchDetailsComments: [],
    currentUser: null,
    newest: [],
    bestRatedLastWeek: [],
    bestRatedLastMonth: [],
    bestRatedAllTime: [],
    monstCommentedLastWeek: [],
    monstCommentedLastMonth: [],
    monstCommentedAllTime: []
  },
  actions: {
    fetchFeatureText ({ commit }) {
      return api.fetchFeatured(({ text, sketch }) => {
        commit('setFeatureText', text)
        commit('setFeaturedSketch', sketch)
      })
    },
    fetchTopSketches ({ commit }) {
      return api.fetchTopSketches(
        newest => {
          commit('setNewest', newest)
        },
        bestRatedLastWeek => {
          commit('setBestRatedLastWeek', bestRatedLastWeek)
        },
        bestRatedLastMonth => {
          commit('setBestRatedLastMonth', bestRatedLastMonth)
        },
        bestRatedAllTime => {
          commit('setBestRatedAllTime', bestRatedAllTime)
        },
        mostCommentedLastWeek => {
          commit('setMostCommentedLastWeek', mostCommentedLastWeek)
        },
        mostCommentedLastMonth => {
          commit('setMostCommentedLastMonth', mostCommentedLastMonth)
        },
        mostCommentedAllTime => {
          commit('setMostCommentedAllTime', mostCommentedAllTime)
        }
      )
    },
    fetchDetailSketch ({ commit }, sketchId) {
      return api
        .fetchDetailSketch(sketchId, sketchDetails => {
          console.log('store fetchDetailSketch', sketchDetails)
          commit('setSketchDetails', sketchDetails)
        })
        .then(() => {
          api
            .fetchDetailSketchComments(sketchId, comments => {
              commit('setSketchDetailsComments', comments)
            })
        })
    },
    updateCurrentUser ({ commit }, userId) {
      return api.fetchPublicUserData(userId, snapshot => {
        commit('setCurrentUser', snapshot.data())
      })
    },
    removeCurrentUser ({ commit }) {
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
    setSketchDetails (state, sketchDetails) {
      state.sketchDetails = sketchDetails
    },
    setSketchDetailsComments (state, sketchDetailsComments) {
      state.sketchDetailsComments = sketchDetailsComments
    },
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
    },
    setNewest (state, newest) {
      state.newest = newest
    },
    setBestRatedLastWeek (state, bestRatedLastWeek) {
      state.bestRatedLastWeek = bestRatedLastWeek
    },
    setBestRatedLastMonth (state, bestRatedLastMonth) {
      state.bestRatedLastMonth = bestRatedLastMonth
    },
    setBestRatedAllTime (state, bestRatedAllTime) {
      state.bestRatedAllTime = bestRatedAllTime
    },
    setMostCommentedLastWeek (state, mostCommentedLastWeek) {
      state.mostCommentedLastWeek = mostCommentedLastWeek
    },
    setMostCommentedLastMonth (state, mostCommentedLastMonth) {
      state.mostCommentedLastMonth = mostCommentedLastMonth
    },
    setMostCommentedAllTime (state, mostCommentedAllTime) {
      state.mostCommentedAllTime = mostCommentedAllTime
    }
  }
})
