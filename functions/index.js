const functions = require("firebase-functions");

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
