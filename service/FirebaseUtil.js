import { api } from 'api'
class FirebaseUtil {
  toDate (timestampData) {
    if (typeof timestampData === 'string') {
      return new Date(parseInt(timestampData))
    }
    return new api.firebase.firestore.Timestamp(
      timestampData.seconds,
      timestampData.nanoseconds
    ).toDate()
  }
}

export default new FirebaseUtil()
