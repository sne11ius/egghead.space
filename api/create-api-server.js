import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import LRU from 'lru-cache'

export function createAPI ({ config }) {
  let api
  // this piece of code may run multiple times in development mode,
  // so we attach the instantiated API to `process` to avoid duplications
  if (process.__API__) {
    api = process.__API__
  } else {
    const firebaseApp = !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app()
    firebaseApp.firestore().settings({
      timestampsInSnapshots: true
    })
    api = process.__API__ = {
      firebase: Firebase,
      db: firebaseApp.firestore(),
      storage: firebaseApp.storage(),
      auth: firebaseApp.auth(),
      onServer: true,
      // fetched item cache
      cachedItems: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15 // 15 min cache
      })
    }
  }
  return api
}
