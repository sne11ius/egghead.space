const functions = require("firebase-functions");
const firebase = require("../firebase.js");
const firestore = firebase.firestore;
const storage = firebase.storage;
const bucket = storage.bucket();
const marked = require("marked");

const algoliasearch = require('algoliasearch')

const subDays = require("date-fns/sub_days");
const subWeeks = require("date-fns/sub_weeks");
const subMonths = require("date-fns/sub_months");
const isWithinRange = require("date-fns/is_within_range");
const isBefore = require("date-fns/is_before");

const escapeStringRegexp = require("escape-string-regexp");

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

function findBy(images, attributeName, search = "preview image", mustEndWith = false) {
  const img = images.find(img => {
    const attributeValue = img[attributeName].toLowerCase();
    if (mustEndWith) {
      return attributeValue.endsWith(search.toLowerCase());
    } else {
      return attributeValue.includes(search.toLowerCase());
    }
  });
  if (img) {
    console.log(`Found user marked image by ${attributeName}: ${JSON.stringify(img)}`);
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
  console.log("No user marked image. Selecting best image by advanced ImagaMagic magic :D");
  const firstImage = images[0];
  console.log(`Just kidding, we use the first image: ${JSON.stringify(firstImage)}`);
  return firstImage.href;
}

exports.onSketchCreated = functions.firestore
  .document("sketches/{sketchId}")
  .onCreate((snap, context) => {
    console.log("Sketch created. Id: '%s'", snap.id);
    const data = snap.data();

    // Since this sketch is saved for the first time, all medias must be moved out of temp to
    // deliver them from being removed by temp-cleanup-task.
    //
    // This code is ... pita. Object literals could be shorter with the spread properties syntax,
    // but this is only supported in node >= 8.6 and we are stuck with 6.14...
    // s. https://node.green/#ES2018-features-object-rest-spread-properties
    //
    // Also, the individual function blocks *could* be extracted into seperate functions

    // This is gonna be a wild ride... ;)
    const medias = data.medias;
    let body = data.body;
    return Promise.all(
      // Step 1: move files
      medias.map((media, index) => {
        return new Promise((resolve, reject) => {
          const sourcePath = media.path;
          const sourceFile = bucket.file(sourcePath);
          const targetPath = `medias/${snap.id}/${index}`;
          const targetFile = bucket.file(targetPath);
          sourceFile
            .move(targetFile)
            .then(() => {
              return resolve({
                sourcePath,
                targetPath,
                mediaDownloadUrl: media.url,
                previewPath: media.preview.path,
                previewDownloadUrl: media.preview.url
              });
            })
            .catch(error => reject(error));
        });
      })
    )
      .then(movedFiles => {
        // Step 2: move preview files
        return Promise.all(
          movedFiles.map(
            (
              { sourcePath, targetPath, mediaDownloadUrl, previewPath, previewDownloadUrl },
              index
            ) => {
              return new Promise((resolve, reject) => {
                const previewSourcePath = previewPath;
                const previewSourceFile = bucket.file(previewSourcePath);
                const previewTargetPath = `medias/${snap.id}/${index}_preview`;
                const previewTargetFile = bucket.file(previewTargetPath);
                /* eslint-disable promise/no-nesting */
                previewSourceFile
                  .move(previewTargetFile)
                  .then(() => {
                    return resolve({
                      sourcePath,
                      targetPath,
                      previewSourcePath,
                      previewTargetPath,
                      mediaDownloadUrl,
                      previewDownloadUrl
                    });
                  })
                  .catch(error => reject(error));
                /* eslint-enable promise/no-nesting */
              });
            }
          )
        );
      })
      .then(movedFilesAndPreviews => {
        // Step 3: create new download urls
        return Promise.all(
          movedFilesAndPreviews.map(
            ({
              sourcePath,
              targetPath,
              previewSourcePath,
              previewTargetPath,
              mediaDownloadUrl,
              previewDownloadUrl
            }) => {
              return new Promise((resolve, reject) => {
                // s. https://stackoverflow.com/a/43764656/649835
                bucket.file(targetPath).getMetadata((error, metadata) => {
                  if (error) {
                    console.error(error);
                    return reject(error);
                  }
                  const token = metadata.metadata.firebaseStorageDownloadTokens;
                  const updatedMediaDownloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
                    bucket.name
                  }/o/${encodeURIComponent(targetPath)}?alt=media&token=${token}`;
                  return resolve({
                    sourcePath,
                    targetPath,
                    previewSourcePath,
                    previewTargetPath,
                    mediaDownloadUrl,
                    updatedMediaDownloadUrl,
                    previewDownloadUrl
                  });
                });
              });
            }
          )
        );
      })
      .then(movedFilesAndPreviews => {
        // Step 4: create new preview download urls
        return Promise.all(
          movedFilesAndPreviews.map(
            ({
              sourcePath,
              targetPath,
              previewSourcePath,
              previewTargetPath,
              mediaDownloadUrl,
              updatedMediaDownloadUrl,
              previewDownloadUrl
            }) => {
              return new Promise((resolve, reject) => {
                bucket.file(previewTargetPath).getMetadata((error, metadata) => {
                  if (error) {
                    console.error(error);
                    return reject(error);
                  }
                  const token = metadata.metadata.firebaseStorageDownloadTokens;
                  const updatedPreviewDownloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
                    bucket.name
                  }/o/${encodeURIComponent(previewTargetPath)}?alt=media&token=${token}`;
                  return resolve({
                    sourcePath,
                    targetPath,
                    previewSourcePath,
                    previewTargetPath,
                    mediaDownloadUrl,
                    updatedMediaDownloadUrl,
                    previewDownloadUrl,
                    updatedPreviewDownloadUrl
                  });
                });
              });
            }
          )
        );
      })
      .then(movedFilesAndPreviews => {
        // Step 5a: update sketch body
        movedFilesAndPreviews.forEach(
          ({
            mediaDownloadUrl,
            updatedMediaDownloadUrl,
          }) => {
            const regex = new RegExp(escapeStringRegexp(mediaDownloadUrl), "g");
            body = body.replace(regex, updatedMediaDownloadUrl);
          }
        );
        // Step 5b: update sketch media list
        const updatedMedias = movedFilesAndPreviews.map(
          ({
            targetPath,
            previewTargetPath,
            updatedMediaDownloadUrl,
            updatedPreviewDownloadUrl
          }) => {
            return {
              url: updatedMediaDownloadUrl,
              path: targetPath,
              preview: {
                url: updatedPreviewDownloadUrl,
                path: previewTargetPath
              }
            };
          }
        );
        return snap.ref.update({
          body,
          medias: updatedMedias
        });
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  });

// https://firebase.google.com/docs/functions/config-env
const algoliaClient = algoliasearch(functions.config().algolia.id, functions.config().algolia.key);
const algoliaSketchesIndex = algoliaClient.initIndex('sketches')

exports.onSketchModified = functions.firestore
  .document("sketches/{sketchId}")
  .onUpdate((change, context) => {
    const id = change.after.id
    console.log("Sketch modified. Id: '%s'", id);
    const data = change.after.data();
    const body = data.body;
    const algoliaData = {
      id,
      objectID: id, // Used by algolia
      previewImage: data.previewImage,
      title: data.title,
      totalLikes: data.totalLikes,
      commentCount: data.commentCount
    }
    console.log('Submitting to algolia: ', algoliaData)
    algoliaSketchesIndex.saveObjects([algoliaData], (error) => {
      if (error) {
        console.error('Could not submit to algolia: ', error)
      }
    })
    return bucket
      .getFiles({ prefix: `medias/${id}` })
      .then(results => {
        const files = results[0].filter(file => !file.name.endsWith("_preview"));
        return Promise.all(
          files.map(file => {
            return new Promise((resolve, reject) => {
              const filename = file.name;
              const isInUse = data.medias.some(media =>
                media.url.includes(encodeURIComponent(filename))
              );
              if (isInUse) {
                return resolve();
              }
              // Delete media and preview
              /* eslint-disable promise/no-nesting */
              console.log("Delete " + file.name);
              const preview = bucket.file(`${file.name}_preview`);
              console.log("Delete " + preview.name);
              return Promise.all([file.delete(), preview.delete()])
                .then(resolve())
                .catch(error => {
                  console.error(error);
                  return reject(error);
                });
              /* eslint-enable promise/no-nesting */
            });
          })
        );
      })
      .then(() => {
        const previousData = change.before.data();
        if (body === previousData.body) {
          console.log("Body didn't change, nothing to do.");
          return null;
        }
        let imageLink = selectImage(body);
        if (imageLink !== null) {
          const medias = change.after.data().medias;
          for (let { url, preview } of medias) {
            if (url === imageLink.replace(/&amp;/g, '&') && preview && preview.url) {
              imageLink = preview.url;
              console.log("Found preview image: ", url, preview);
              break;
            }
          }
          if (imageLink !== data.previewImage) {
            console.log("Image has changed. Setting new property: " + imageLink);
            return change.after.ref.update({
              previewImage: imageLink
            });
          }
        }
        return null;
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  });

exports.removeUnusedMediaFiles = functions.https.onRequest((req, res) => {
  console.log("Removing old temp files...");
  const now = new Date();
  const oneDayAgo = subDays(now, 1);
  return bucket.getFiles({ prefix: "temp/" }).then(results => {
    const files = results[0];
    console.log(files.length + " files found");
    let deletedCount = 0;
    /* eslint-disable promise/no-nesting */
    return Promise.all(
      files.map(file => file.getMetadata().then(data => ({ file, metadata: data[0] })))
    )
      .then(filesWithMetadata => {
        return Promise.all(
          filesWithMetadata.map(({ file, metadata }) => {
            const updated = new Date(metadata.updated);
            if (isBefore(updated, oneDayAgo)) {
              console.log("delete", file);
              deletedCount++;
              return file.delete();
            }
            return true;
          })
        );
        /* eslint-enable promise/no-nesting */
      })
      .then(() => {
        console.log(deletedCount + " files removed.");
        console.log("finished");
        res.send("ok");
        return true;
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + JSON.stringify(error));
      });
  });
});

exports.updatePeriodicLikes = functions.https.onRequest((req, res) => {
  console.log("Updating weekly and monthly likes...");
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
