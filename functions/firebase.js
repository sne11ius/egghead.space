const firebase = require("firebase-admin");
firebase.initializeApp();

exports.firestore = firebase.firestore();
exports.storage = firebase.storage();
