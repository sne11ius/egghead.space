const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const marked = require("marked");

// Finds all images from a markdown text
function findImages(markdown) {
  const renderer = new marked.Renderer();
  const images = [];
  renderer.image = function(href, title, alt) {
    images.push({
      href: href || "",
      title: title || "",
      alt: alt || ""
    });
    return marked.Renderer.prototype.image.apply(this, arguments);
  };
  marked(markdown, { renderer: renderer });
  return images;
}

function findBy(
  images,
  attributeName,
  search = "preview image",
  mustEndWith = false
) {
  const img = images.find(img => {
    const attributeValue = img[attributeName].toLowerCase();
    if (mustEndWith) {
      return attributeValue.endsWith(search.toLowerCase());
    } else {
      return attributeValue.includes(search.toLowerCase());
    }
  });
  if (img) {
    console.log(
      `Found user marked image by ${attributeName}: ${JSON.stringify(img)}`
    );
  }
  return img && img.href;
}

function selectImage(body) {
  const images = findImages(body);
  if (images.length === 0) {
    return null;
  }
  const markedByUrlHref = findBy(images, "href", "preview_image", true);
  if (markedByUrlHref) {
    return markedByUrlHref;
  }
  const markedByTextHref = findBy(images, "alt");
  if (markedByTextHref) {
    return markedByTextHref;
  }
  const markedByTitleHref = findBy(images, "title");
  if (markedByTitleHref) {
    return markedByTitleHref;
  }
  console.log(
    "No user marked image. Selecting best image by advanced ImagaMagic magic :D"
  );
  const firstImage = images[0];
  console.log(
    `Just kidding, we use the first image: ${JSON.stringify(firstImage)}`
  );
  return firstImage.href;
}

exports.onSketchCreated = functions.firestore
  .document("sketches/{sketchId}")
  .onCreate((snap, context) => {
    console.log("Sketch created. Id: '%s'", snap.id);
    const data = snap.data();
    const body = data.body;
    const imageLink = selectImage(body);
    if (imageLink !== null && imageLink !== data.previewImage) {
      console.log("Image has changed. Setting new property");
      return snap.ref.set(
        {
          previewImage: imageLink
        },
        {
          merge: true
        }
      );
    }
    return null;
  });

exports.onSketchModified = functions.firestore
  .document("sketches/{sketchId}")
  .onUpdate((change, context) => {
    console.log("Sketch modified. Id: '%s'", change.after.id);
    const data = change.after.data();
    const body = data.body;
    const previousData = change.before.data();
    if (body === previousData.body) {
      console.log("Body didn't change, nothing to do.");
      return null;
    }
    const imageLink = selectImage(body);
    if (imageLink !== null && imageLink !== data.previewImage) {
      console.log("Image has changed. Setting new property");
      return change.after.ref.set(
        {
          previewImage: imageLink
        },
        {
          merge: true
        }
      );
    }
    return null;
  });

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

const subWeeks = require("date-fns/sub_weeks");
const subMonths = require("date-fns/sub_months");
const isWithinRange = require("date-fns/is_within_range");

exports.updatePeriodicLikes = functions.https.onRequest((req, res) => {
  console.log("Updating weekly and monthly likes...");
  const firestore = admin.firestore();
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);
  firestore
    .collection("sketches")
    .get()
    .then(querySnapshot => {
      let updateData = [];
      querySnapshot.forEach(docSnapshot => {
        const data = docSnapshot.data();
        let likesLastWeek = 0;
        let likesLastMonth = 0;
        if (data.likes) {
          for (var i in data.likes) {
            const like = data.likes[i];
            if (like && like.didLike) {
              const lastChanged = new Date(like.lastChanged);
              if (isWithinRange(lastChanged, oneWeekAgo, now)) {
                likesLastWeek++;
              }
              if (isWithinRange(lastChanged, oneMonthAgo, now)) {
                likesLastMonth++;
              }
            }
          }
        }
        updateData.push({
          docRef: docSnapshot.ref,
          likesLastWeek,
          likesLastMonth
        });
      });
      return updateData;
    })
    .then(updateData => {
      const promises = updateData.map(data => {
        return data.docRef.update({
          likesLastWeek: data.likesLastWeek,
          likesLastMonth: data.likesLastMonth
        });
      });
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

exports.updatePeriodicComments = functions.https.onRequest((req, res) => {
  console.log("Updating weekly and monthly comments...");
  const firestore = admin.firestore();
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);
  let sketchDocSnapshots = [];
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
          updateData.push({
            docRef: docRef,
            commentsLastWeek,
            commentsLastMonth
          });
        }
      }
      return updateData;
    })
    .then(updateData => {
      const promises = updateData.map(data => {
        return data.docRef.update({
          commentsLastWeek: data.commentsLastWeek,
          commentsLastMonth: data.commentsLastMonth
        });
      });
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
