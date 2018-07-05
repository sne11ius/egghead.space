import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import firebaseui from 'firebaseui'

export function createAPI ({ config }) {
  const firebaseApp = !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app()

  firebaseApp.firestore().settings({
    timestampsInSnapshots: true
  })
  return {
    firebase: Firebase,
    firebaseui,
    db: firebaseApp.firestore(),
    storage: firebaseApp.storage(),
    auth: firebaseApp.auth(),
    onServer: false
  }
}
