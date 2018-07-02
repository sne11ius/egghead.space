import Vue from 'vue'
import Vuex from 'vuex'

import { db } from '../firebase'

Vue.use(Vuex)

const featured = db
  .collection('featuredSketches')
  .orderBy('featuredSince', 'desc')
  .limit(1)

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
      return new Promise((resolve, reject) => {
        featured.onSnapshot(featuredSnapshot => {
          let featured
          featuredSnapshot.forEach(doc => {
            featured = doc.data()
          })
          featured.sketch.get().then(snapshot => {
            const data = snapshot.data()
            commit('setFeaturedSketch', {
              title: data.title,
              body: data.body
            })
            commit('setFeatureText', featured.featureText)
            resolve()
          })
        })
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
