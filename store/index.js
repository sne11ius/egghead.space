import Vue from 'vue'
import Vuex from 'vuex'

import { api } from 'api'

Vue.use(Vuex)

const featured = api.db
  .collection('featuredSketches')
  .orderBy('featuredSince', 'desc')
  .limit(1)

const toSketch = ({
  title,
  body,
  commentsLastMonth,
  commentsLastWeek,
  created,
  createdByUid,
  likes,
  totalLikes,
  likesLastMonth,
  likesLastWeek,
  medias,
  previewImage,
  updated,
  updatedByUid
}) => ({
  title,
  body,
  commentsLastMonth,
  commentsLastWeek,
  created,
  createdByUid,
  likes,
  totalLikes,
  likesLastMonth,
  likesLastWeek,
  medias,
  previewImage,
  updated,
  updatedByUid
})

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
            console.log(toSketch(snapshot.data()))
            commit('setFeaturedSketch', toSketch(snapshot.data()))
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
