const firebase = require("firebase-admin");
firebase.initializeApp();

module.exports = firebase.firestore();
