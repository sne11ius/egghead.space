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

const toStaticData = snapshot => {
  const data = {
    ...snapshot.data(),
    id: snapshot.id
  }
  const promises = []
  for (let i in data) {
    const value = data[i]
    if (value && value.firestore) {
      promises.push(
        value
          .get()
          .then(toStaticData)
          .then(val => {
            data[i] = val
            return val
          })
      )
    }
  }
  return Promise.all(promises).then(() => data)
}

function arrayToStaticData (querySnapshot) {
  return Promise.all(querySnapshot.docs.map(toStaticData))
}

function fetchCollection (collection, onUpdate) {
  collection.onSnapshot(querySnapshot => {
    arrayToStaticData(querySnapshot).then(onUpdate)
  })
  return collection.get()
}

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
  featured.onSnapshot(featuredSnapshot => {
    arrayToStaticData(featuredSnapshot).then(data => onUpdate(data[0]))
  })
  return featured.get()
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
    fetchCollection(newest, onNewest),
    fetchCollection(bestRatedLastWeek, onBestRatedLastWeek),
    fetchCollection(bestRatedLastMonth, onBestRatedLastMonth),
    fetchCollection(bestRatedAllTime, onBestRatedAllTime),
    fetchCollection(mostCommentedLastWeek, onMostCommentedLastWeek),
    fetchCollection(mostCommentedLastMonth, onMostCommentedLastMonth),
    fetchCollection(mostCommentedAllTime, onMostCommentedAllTime)
  ])
}

apiImpl.fetchDetailSketch = (id, onUpdate) => {
  console.log(id)
  const ref = sketches.doc(id)
  console.log('fetchDetailSketch')
  ref.onSnapshot(snapshot => toStaticData(snapshot).then(onUpdate))
  return ref.get()
}

apiImpl.fetchDetailSketchComments = (id, onUpdate) => {
  const ref = sketches
    .doc(id)
    .collection('comments')
    .orderBy('created', 'asc')
  return new Promise((resolve, reject) => {
    ref.onSnapshot(data => {
      return arrayToStaticData(data).then(onUpdate)
    })
    return newest
      .get()
      .then(resolve)
      .catch(error => {
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
