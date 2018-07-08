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
  id,
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
  id,
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

const toComment = ({
  body,
  created,
  createdByUid
}) => ({
  body,
  created,
  createdByUid
})

const mkPrivateInfo = ({ email, uid }) => ({
  email,
  uid
})

const mkPublicInfo = ({ createdAt, displayName, photoURL, uid }) => ({
  createdAt,
  displayName,
  photoURL,
  uid
})

const featured = apiImpl.db
  .collection('featuredSketches')
  .orderBy('featuredSince', 'desc')
  .limit(1)

const newest = apiImpl.db
  .collection('sketches')
  .orderBy('created', 'desc')
  .limit(10)

const bestRatedLastWeek = apiImpl.db
  .collection('sketches')
  .orderBy('likesLastWeek', 'desc')
  .limit(10)

const bestRatedLastMonth = apiImpl.db
  .collection('sketches')
  .orderBy('likesLastMonth', 'desc')
  .limit(10)

const bestRatedAllTime = apiImpl.db
  .collection('sketches')
  .orderBy('totalLikes', 'desc')
  .limit(10)

const mostCommentedLastWeek = apiImpl.db
  .collection('sketches')
  .orderBy('commentsLastWeek', 'desc')
  .limit(10)

const mostCommentedLastMonth = apiImpl.db
  .collection('sketches')
  .orderBy('commentsLastMonth', 'desc')
  .limit(10)

const mostCommentedAllTime = apiImpl.db
  .collection('sketches')
  .orderBy('commentCount', 'desc')
  .limit(10)

const sketches = apiImpl.db.collection('sketches')

apiImpl.fetchFeatured = onUpdate => {
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

function toData (docs) {
  const data = []
  docs.forEach(doc => data.push({
    id: doc.id,
    ...doc.data()
  }))
  return data
}

function mkSketchCollectionPromise (collection, onUpdate) {
  return new Promise((resolve, reject) => {
    collection.onSnapshot(data => onUpdate(toData(data).map(toSketch)))
    return collection.get().then(resolve).catch(error => {
      console.error(error)
      reject(error)
    })
  })
}

apiImpl.fetchTopSketches = (
  onNewest,
  onBestRatedLastWeek,
  onBestRatedLastMonth,
  onBestRatedAllTime,
  onMostCommentedLastWeek,
  onMostCommentedLastMonth,
  onMostCommentedAllTime
) => {
  return Promise.all([
    mkSketchCollectionPromise(newest, onNewest),
    mkSketchCollectionPromise(bestRatedLastWeek, onBestRatedLastWeek),
    mkSketchCollectionPromise(bestRatedLastMonth, onBestRatedLastMonth),
    mkSketchCollectionPromise(bestRatedAllTime, onBestRatedAllTime),
    mkSketchCollectionPromise(mostCommentedLastWeek, onMostCommentedLastWeek),
    mkSketchCollectionPromise(mostCommentedLastMonth, onMostCommentedLastMonth),
    mkSketchCollectionPromise(mostCommentedAllTime, onMostCommentedAllTime)
  ])
}

apiImpl.fetchDetailSketch = (id, onUpdate) => {
  const ref = sketches.doc(id)
  ref.onSnapshot(snapshot => onUpdate({
    id: snapshot.id,
    ...snapshot.data()
  }))
  return ref.get()
}

apiImpl.fetchDetailSketchComments = (id, onUpdate) => {
  const ref = sketches
    .doc(id)
    .collection('comments')
    .orderBy('created', 'asc')
  return new Promise((resolve, reject) => {
    ref.onSnapshot(data => onUpdate(toData(data).map(toComment)))
    return newest.get().then(resolve).catch(error => {
      console.error(error)
      reject(error)
    })
  })
}

apiImpl.fetchPrivateUserData = userId =>
  apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('private')
    .doc('loginData')
    .get()

apiImpl.setPrivateUserData = userData =>
  apiImpl.db
    .collection('users')
    .doc(userData.uid)
    .collection('private')
    .doc('loginData')
    .set(mkPrivateInfo(userData))

apiImpl.fetchPublicUserData = (userId, onSnapshot) => {
  var ref = apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
  if (onSnapshot) {
    ref.onSnapshot(onSnapshot)
  }
  return ref.get()
}

apiImpl.setPublicUserData = userData =>
  apiImpl.db
    .collection('users')
    .doc(userData.uid)
    .collection('public')
    .doc('userInfo')
    .set(
      mkPublicInfo({
        createdAt: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
        ...userData
      })
    )

export const api = apiImpl
