const functions = require("firebase-functions");
const admin = require("admin.js");

const subWeeks = require("date-fns/sub_weeks");
const subMonths = require("date-fns/sub_months");
const isWithinRange = require("date-fns/is_within_range");

exports.onCommentCreated = functions.firestore
  .document("sketches/{sketchId}/comments/{commentId}")
  .onCreate((snap, context) => {
    const sketchId = context.params.sketchId;
    const firestore = admin.firestore();
    const sketchRef = firestore.collection("sketches").doc(sketchId);
    return sketchRef.get().then(sketch => {
      const commentCount = (sketch.commentCount || 0) + 1;
      return sketchRef.update({
        commentCount
      });
    });
  });

exports.onCommentDeleted = functions.firestore
  .document("sketches/{sketchId}/comments/{commentId}")
  .onDelete((snap, context) => {
    const sketchId = context.params.sketchId;
    const firestore = admin.firestore();
    const sketchRef = firestore.collection("sketches").doc(sketchId);
    return sketchRef.get().then(sketch => {
      const commentCount = sketch.commentCount - 1;
      return sketchRef.update({
        commentCount
      });
    });
  });

exports.updatePeriodicComments = functions.https.onRequest((req, res) => {
  console.log("Updating weekly and monthly comments...");
  const firestore = admin.firestore();
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);
  const sketchDocSnapshots = [];
  firestore
    .collection("sketches")
    .get()
    .then(sketchesQuerySnapshot => {
      let promises = [];
      sketchesQuerySnapshot.forEach(sketchDocSnapshot => {
        sketchDocSnapshots.push(sketchDocSnapshot);
        promises.push(
          firestore
            .collection("sketches")
            .doc(sketchDocSnapshot.id)
            .collection("comments")
            .get()
        );
      });
      return Promise.all(promises);
    })
    .then(commentsLists => {
      const updateData = [];
      for (let i = 0; i < sketchDocSnapshots.length; i++) {
        const docRef = sketchDocSnapshots[i].ref;
        const commentsRef = commentsLists[i];
        let commentsLastWeek = 0;
        let commentsLastMonth = 0;
        if (!commentsRef.empty) {
          commentsRef.forEach(commentSnapshot => {
            const comment = commentSnapshot.data();
            const lastChanged = new Date(comment.created);
            if (isWithinRange(lastChanged, oneWeekAgo, now)) {
              commentsLastWeek++;
            }
            if (isWithinRange(lastChanged, oneMonthAgo, now)) {
              commentsLastMonth++;
            }
          });
        }
        updateData.push({
          docRef,
          commentsLastWeek,
          commentsLastMonth
        });
      }
      return updateData;
    })
    .then(updateData => {
      const promises = updateData.map(
        ({ docRef, commentsLastWeek, commentsLastMonth }) => {
          return docRef.update({
            commentsLastWeek,
            commentsLastMonth
          });
        }
      );
      return Promise.all(promises);
    })
    .then(() => {
      console.log("finished");
      res.send("ok");
      return true;
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error: " + JSON.stringify(error));
    });
});
