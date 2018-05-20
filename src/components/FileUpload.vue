<template>
  <div>
    file upload
    <v-btn id="uppy-select-files">Add files</v-btn>
  </div>
</template>

<script>
import Uppy from "uppy/lib/core";
import Dashboard from "uppy/lib/plugins/Dashboard";
import { storage } from "@/firebase";
import FirebaseCloudStorage from "@/service/FirebaseCloudStorage";

import "uppy/dist/uppy.min.css";

export default {
  name: "FileUpload",
  mounted() {
    const storageRef = storage.ref().child("temp");
    const uppy = Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: 10000000,
        allowedFileTypes: ["image/*", ".jpg", ".jpeg", ".png", ".gif"]
      }
    })
      .use(Dashboard, {
        trigger: "#uppy-select-files",
        note: "Images only, up to 10 MB",
        showProgressDetails: true,
        disableStatusBar: false,
        metaFields: [{ id: "name", name: "Name", placeholder: "file name" }]
      })
      .use(FirebaseCloudStorage, { storageRef })
      .run();
    uppy.on("complete", result => {
      console.log("successful files:", result.successful);
      console.log("failed files:", result.failed);
    });
  }
};
</script>
