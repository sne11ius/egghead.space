const functions = require("firebase-functions");

const marked = require("marked");

// Finds all images from a markdown text
function findImages(markdown) {
  const renderer = new marked.Renderer();
  const images = [];
  renderer.image = function(href, title, text) {
    images.push({
      href: href,
      title: title,
      text: text
    });
    return marked.Renderer.prototype.image.apply(this, arguments);
  };
  marked(markdown, { renderer: renderer });
  return images;
}

function selectImage(body) {
  const images = findImages(body);
  const userMarkedImages = images.filter(image => {
    return image.href.endsWith("preview_image");
  });
  if (userMarkedImages.length > 0) {
    const userMarkedImage = userMarkedImages[0];
    console.log(`Found user marked image: ${JSON.stringify(userMarkedImage)}`);
    console.log("... and using this image for preview.");
    return userMarkedImage.href;
  }
  console.log("No user marked image. Selecting best image :D");
  console.log("No yet...");
  return null;
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
    }
    const imageLink = selectImage(body);
    if (imageLink !== null && imageLink !== data.previewImage) {
      console.log("Image has changed. Setting new property");
      return change.after.ref.set(
        {
          previewImage: userMarkedImage.href
        },
        {
          merge: true
        }
      );
    }
    return null;
  });
