import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

export function createAPI ({ config }) {
  const firebaseApp = !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app()

  firebaseApp.firestore().settings({
    timestampsInSnapshots: true
  })
  return {
    db: firebaseApp.firestore(),
    storage: firebaseApp.storage(),
    onServer: false
  }
}
