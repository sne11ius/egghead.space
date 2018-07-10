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
    isModerator: false,
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
      return new Promise(resolve => {
        return api.fetchFeatured(({ text, sketch }) => {
          commit('setFeatureText', text)
          commit('setFeaturedSketch', sketch)
          resolve()
        })
      })
    },
    fetchTopSketches ({ commit }) {
      return new Promise(resolve => {
        const done = []
        const all = [
          'setNewest',
          'setBestRatedLastWeek',
          'setBestRatedLastMonth',
          'setBestRatedAllTime',
          'setMostCommentedLastWeek',
          'setMostCommentedLastMonth',
          'setMostCommentedAllTime'
        ]
        function checkDone () {
          if (all.every(x => done.includes(x))) {
            resolve()
          }
        }
        return api.fetchTopSketches(
          newest => {
            commit('setNewest', newest)
            done.push('setNewest')
            checkDone()
          },
          bestRatedLastWeek => {
            commit('setBestRatedLastWeek', bestRatedLastWeek)
            done.push('setBestRatedLastWeek')
            checkDone()
          },
          bestRatedLastMonth => {
            commit('setBestRatedLastMonth', bestRatedLastMonth)
            done.push('setBestRatedLastMonth')
            checkDone()
          },
          bestRatedAllTime => {
            commit('setBestRatedAllTime', bestRatedAllTime)
            done.push('setBestRatedAllTime')
            checkDone()
          },
          mostCommentedLastWeek => {
            commit('setMostCommentedLastWeek', mostCommentedLastWeek)
            done.push('setMostCommentedLastWeek')
            checkDone()
          },
          mostCommentedLastMonth => {
            commit('setMostCommentedLastMonth', mostCommentedLastMonth)
            done.push('setMostCommentedLastMonth')
            checkDone()
          },
          mostCommentedAllTime => {
            commit('setMostCommentedAllTime', mostCommentedAllTime)
            done.push('setMostCommentedAllTime')
            checkDone()
          }
        )
      })
    },
    fetchDetailSketch ({ commit }, sketchId) {
      return api
        .fetchDetailSketch(sketchId, sketchDetails => {
          commit('setSketchDetails', sketchDetails)
        })
        .then(() => {
          api.fetchDetailSketchComments(sketchId, comments => {
            commit('setSketchDetailsComments', comments)
          })
        })
    },
    updateCurrentUser ({ commit }, userId) {
      return api.fetchPublicUserData(userId, userData => {
        commit('setCurrentUser', userData)
        api.checkIsModerator(userId).then(isModerator => commit('setIsModerator', isModerator))
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
    setIsModerator (state, isModerator) {
      state.isModerator = isModerator
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
