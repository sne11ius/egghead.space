const functions = require("firebase-functions");

exports.helloEgghead = functions.https.onRequest((request, response) => {
  response.send("Hello from egghead.space!");
});

exports.createSketch = functions.firestore
  .document("sketches/{sketchId}")
  .onCreate((snap, context) => {
    console.log("new sketch: '%s'", snap.data().title);
  });
