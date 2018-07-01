class FirebaseUtil {
  toSimpleObject (data) {
    return JSON.parse(JSON.stringify(data))
  }
}

export default new FirebaseUtil()
