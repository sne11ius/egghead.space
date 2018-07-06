// this is aliased in webpack config based on server/client build
import { createAPI } from 'create-api'

const apiImpl = createAPI({
  config: {
    apiKey: 'AIzaSyAtbFdQlWu-oWtN3Y7vpslY0oht5SbCSf8',
    authDomain: 'eggheadspace-e99d7.firebaseapp.com',
    databaseURL: 'https://eggheadspace-e99d7.firebaseio.com',
    projectId: 'eggheadspace-e99d7',
    storageBucket: 'eggheadspace-e99d7.appspot.com',
    messagingSenderId: '774445755419'
  }
})

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

const featured = apiImpl.db
  .collection('featuredSketches')
  .orderBy('featuredSince', 'desc')
  .limit(1)

apiImpl.fetchFeatured = (onUpdate) => {
  return new Promise((resolve, reject) => {
    featured.onSnapshot(featuredSnapshot => {
      let featured
      featuredSnapshot.forEach(doc => {
        featured = doc.data()
      })
      featured.sketch.get().then(snapshot => {
        onUpdate({
          text: featured.featureText,
          sketch: toSketch(snapshot.data())
        })
        resolve()
      })
    })
  })
}

export const api = apiImpl
