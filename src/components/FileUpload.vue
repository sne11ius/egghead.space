<template>
  <div id="upload-area">
  </div>
</template>

<script>
import Uppy from "uppy/lib/core";
import Dashboard from "uppy/lib/plugins/Dashboard";
import { storage } from "@/firebase";
import FirebaseCloudStorage from "@/service/FirebaseCloudStorage";
import uuid from "uuid/v4";

import "uppy/dist/uppy.min.css";

export default {
  name: "FileUpload",
  mounted() {
    const storageRef = storage.ref().child("temp");
    const uppy = Uppy({
      autoProceed: true,
      restrictions: {
        maxFileSize: 10000000,
        allowedFileTypes: [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".JPG",
          ".JPEG",
          ".PNG",
          ".GIF"
        ]
      }
    })
      .use(Dashboard, {
        inline: true,
        target: "#upload-area",
        width: "100%",
        note: "Images only, up to 10 MB",
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false
      })
      .use(FirebaseCloudStorage, { storageRef })
      .run();
    uppy.on("upload-success", (file, snapshot) => {
      const previewRef = storageRef.child(uuid());
      fetch(file.preview)
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("Could not fetch blob url");
        })
        .then(blob => {
          return new Promise((resolve, reject) => {
            const uploadTask = previewRef.put(blob, {
              contentType: "image/png"
            });
            uploadTask.on(
              "state_changed",
              () => {},
              error => {
                reject(error);
              },
              () => {
                const previewSnapshot = uploadTask.snapshot;
                resolve({
                  file,
                  previewSnapshot
                });
              }
            );
          });
        })
        .then(({ file, previewSnapshot }) => {
          return new Promise((resolve, reject) => {
            previewSnapshot.ref
              .getDownloadURL()
              .then(previewDownloadUrl => {
                resolve({
                  file,
                  previewSnapshot,
                  previewDownloadUrl
                });
              })
              .catch(error => reject(error));
          });
        })
        .then(({ file, previewSnapshot, previewDownloadUrl }) => {
          snapshot.ref
            .updateMetadata({
              customMetadata: {
                previewUrl: previewDownloadUrl
              }
            })
            .then(() => {
              uppy.removeFile(file.id);
              this.$emit(
                "media-added",
                file,
                previewDownloadUrl,
                previewSnapshot
              );
            });
        });
    });
  }
};
</script>
