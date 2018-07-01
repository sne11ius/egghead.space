import firebase from 'firebase'
import store from './'
require('firebase/firestore')

firebase.initializeApp({
  apiKey: 'AIzaSyAtbFdQlWu-oWtN3Y7vpslY0oht5SbCSf8',
  authDomain: 'eggheadspace-e99d7.firebaseapp.com',
  projectId: 'eggheadspace-e99d7'
})

const db = firebase.firestore()
const featured = db.collection('featuredSketches')
  .orderBy('featuredSince', 'desc')
  .limit(1)

// Getting Real time feeds
featured.onSnapshot(featuredSnapshot => {
  const featured = []
  featuredSnapshot.forEach(doc => {
    featured.push(doc)
  })
  store.commit('watchFeatured', featured)
})

export default {
  fetchFeatured: () => {
    return featured.get()
  }
}
