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

const bestRatedLastWeek = apiImpl.db
  .collection('sketches')
  .orderBy('likesLastWeek', 'desc')

const bestRatedLastMonth = apiImpl.db
  .collection('sketches')
  .orderBy('likesLastMonth', 'desc')

const bestRatedAllTime = apiImpl.db
  .collection('sketches')
  .orderBy('totalLikes', 'desc')

const mostCommentedLastWeek = apiImpl.db
  .collection('sketches')
  .orderBy('commentsLastWeek', 'desc')

const mostCommentedLastMonth = apiImpl.db
  .collection('sketches')
  .orderBy('commentsLastMonth', 'desc')

const mostCommentedAllTime = apiImpl.db
  .collection('sketches')
  .orderBy('commentCount', 'desc')

const sketches = apiImpl.db.collection('sketches')

apiImpl.fetchFeatured = onUpdate => {
  featured.onSnapshot(featuredSnapshot => {
    arrayToStaticData(featuredSnapshot).then(data => onUpdate(data[0]))
  })
  return featured.get()
}

apiImpl.fetchTopSketches = (
  fetchCount,
  onNewest,
  onBestRatedLastWeek,
  onBestRatedLastMonth,
  onBestRatedAllTime,
  onMostCommentedLastWeek,
  onMostCommentedLastMonth,
  onMostCommentedAllTime
) => {
  return Promise.all([
    fetchCollection(newest.limit(fetchCount), onNewest),
    fetchCollection(bestRatedLastWeek.limit(fetchCount), onBestRatedLastWeek),
    fetchCollection(bestRatedLastMonth.limit(fetchCount), onBestRatedLastMonth),
    fetchCollection(bestRatedAllTime.limit(fetchCount), onBestRatedAllTime),
    fetchCollection(mostCommentedLastWeek.limit(fetchCount), onMostCommentedLastWeek),
    fetchCollection(mostCommentedLastMonth.limit(fetchCount), onMostCommentedLastMonth),
    fetchCollection(mostCommentedAllTime.limit(fetchCount), onMostCommentedAllTime)
  ])
}

apiImpl.fetchDetailSketch = (id, onUpdate) => new Promise((resolve, reject) => {
  const ref = sketches.doc(id)
  ref.onSnapshot(snapshot => toStaticData(snapshot).then(details => {
    onUpdate(details)
    resolve(details)
  }))
  ref.get()
})

apiImpl.fetchDetailSketchComments = (id, onUpdate) => {
  const ref = sketches
    .doc(id)
    .collection('comments')
    .orderBy('created', 'asc')
  return new Promise((resolve, reject) => {
    ref.onSnapshot(data => arrayToStaticData(data).then(onUpdate))
    return newest
      .get()
      .then(resolve)
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
}
apiImpl.fetchUserSketches = (userId, onUpdate) => {
  const ref = sketches.where('createdByUid', '==', userId).orderBy('created', 'desc')
  return new Promise((resolve, reject) => {
    ref.onSnapshot(data => arrayToStaticData(data).then(onUpdate))
    ref
      .get()
      .then(resolve)
  })
}

apiImpl.fetchUserComments = (userId, onUpdate) => {
  const ref = apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('comments')
    .orderBy('created', 'asc')
  return new Promise((resolve, reject) => {
    ref.onSnapshot(data => arrayToStaticData(data).then(onUpdate))
    ref
      .get()
      .then(resolve)
  })
}

apiImpl.fetchSketch = id => {
  return sketches
    .doc(id)
    .get()
    .then(toStaticData)
}

apiImpl.submitSketch = (userId, title, body, medias) => {
  const userRef = apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
  const sketch = {
    createdBy: userRef,
    createdByUid: userId,
    title,
    body,
    created: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
    medias
  }
  return sketches.add(sketch)
}

apiImpl.updateSketch = (sketchId, title, body, medias, updatedByUid) => {
  return sketches
    .doc(sketchId)
    .update({
      title,
      body,
      updated: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
      updatedByUid,
      medias
    })
}

apiImpl.submitComment = (userId, sketchId, commentBody) => {
  const userRef = apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
  return sketches
    .doc(sketchId)
    .collection('comments')
    .add({
      createdBy: userRef,
      createdByUid: userId,
      body: commentBody,
      created: apiImpl.firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(ref => {
      return apiImpl.db
        .collection('users')
        .doc(userId)
        .collection('comments')
        .add({
          ref,
          refString: `sketches/${sketchId}/comments/${ref.id}`,
          created: apiImpl.firebase.firestore.FieldValue.serverTimestamp()
        })
    })
}

apiImpl.submitFeatureThis = (sketchId, featureText, featuredBy) =>
  apiImpl.db
    .collection('featuredSketches')
    .add({
      sketch: sketches.doc(sketchId),
      featureText,
      featuredSince: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
      featuredBy
    })

apiImpl.invertLike = (userId, sketchId) => {
  return new Promise((resolve, reject) => {
    const sketchRef = sketches.doc(sketchId)
    apiImpl.db.runTransaction(transaction => {
      return transaction
        .get(sketchRef)
        .then(function (sketch) {
          if (!sketch.exists) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject("Cannot vote on a Sketch that doesn't exist.")
          }
          let totalLikes = sketch.data().totalLikes || 0
          let likes = sketch.data().likes || {}
          if (likes[userId] && likes[userId].didLike) {
            likes[userId] = {
              lastChanged: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
              didLike: false
            }
            totalLikes--
          } else {
            likes[userId] = {
              lastChanged: apiImpl.firebase.firestore.FieldValue.serverTimestamp(),
              didLike: true
            }
            totalLikes++
          }
          transaction.update(sketchRef, {
            totalLikes: totalLikes,
            likes: likes
          })
        })
        .then(resolve)
        .catch(error => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Could not change vote: ' + error)
        })
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

apiImpl.updateEmail = (userId, email) =>
  apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('private')
    .doc('loginData')
    .update({
      email
    })

apiImpl.updatePhoto = (userId, photoURL, photoPath) =>
  apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
    .update({
      photoURL,
      photoPath,
      photoURLDidChange: true
    })

apiImpl.fetchPublicUserData = (userId, onSnapshot) => {
  var ref = apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
  if (onSnapshot) {
    ref.onSnapshot(snapshot => {
      toStaticData(snapshot).then(onSnapshot)
    })
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

apiImpl.updateDisplayName = (userId, displayName) =>
  apiImpl.db
    .collection('users')
    .doc(userId)
    .collection('public')
    .doc('userInfo')
    .update({
      displayName
    })

apiImpl.checkIsModerator = userId =>
  apiImpl.db
    .collection('moderators')
    .doc(userId)
    .get()
    .then(moderatorInfo => moderatorInfo.exists && moderatorInfo.data().isModerator)

export const api = apiImpl
