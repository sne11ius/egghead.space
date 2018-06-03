const functions = require("firebase-functions");
const firebase = require("../firebase.js");
const firestore = firebase.firestore;
const storage = firebase.storage;
const bucket = storage.bucket();

exports.onPhotoChanged = functions.firestore
  .document("users/{userId}/public/userInfo")
  .onUpdate((change, context) => {
    const userId = context.params.userId;
    console.log("Public user info modified. Id: '%s'", userId);
    const userInfo = change.after.data();
    const previousUserInfo = change.before.data();
    if (!userInfo.photoURLDidChange) {
      console.log("photoURL did not change - nothing to do.");
      return true;
    } else {
      console.log("photoURL did change - moving file.");
    }
    const photoPath = userInfo.photoPath;
    const photoURL = userInfo.photoURL;

    const sourceFile = bucket.file(photoPath);
    const targetPath = `avatars/${userId}`;
    const targetFile = bucket.file(targetPath);
    return sourceFile
      .move(targetFile)
      .then(
        () =>
          new Promise((resolve, reject) => {
            bucket.file(targetPath).getMetadata((error, metadata) => {
              if (error) {
                console.error(error);
                return reject(error);
              }
              const token = metadata.metadata.firebaseStorageDownloadTokens;
              const updatedPhotoURL = `https://firebasestorage.googleapis.com/v0/b/${
                bucket.name
              }/o/${encodeURIComponent(targetPath)}?alt=media&token=${token}`;
              return resolve(updatedPhotoURL);
            });
          })
      )
      .then(photoURL => {
        console.log(`Updating photoURL for user ${userId} to ${photoURL}"`);
        return change.after.ref.update({
          photoURL,
          photoURLDidChange: false
        });
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  });
