import Plugin from '@uppy/core/lib/Plugin.js'
import uuid from 'uuid/v4'

export default class FirebaseCloudStorage extends Plugin {
  constructor (uppy, opts) {
    super(uppy, opts)
    if (!opts.storageRef) {
      throw Error(
        'Please provide the root storageRef to be used as option `storageRef`. See https://firebase.google.com/docs/storage/web/upload-files'
      )
    }
    this.type = 'uploader'
    this.id = 'FirebaseCloudStorage'
    this.title = 'Firebase Cloud Storage'
    this.storageRef = opts.storageRef
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile (fileIds) {
    return Promise.all(
      fileIds.map(id => {
        return new Promise((resolve, reject) => {
          const file = this.uppy.getFile(id)
          const refId = uuid()
          const fileRef = this.storageRef.child(refId)
          const metaData = {
            contentType: file.type
          }
          this.uppy.emit('upload-started', file)
          const uploadTask = fileRef.put(file.data, metaData)
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progressInfo = {
                uploader: this,
                bytesUploaded: snapshot.bytesTransferred,
                bytesTotal: snapshot.totalBytes
              }
              this.uppy.emit('upload-progress', file, progressInfo)
            },
            error => {
              this.uppy.emit('upload-error', file, error)
              reject(error)
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                const file = this.uppy.getFile(id)
                file.downloadUrl = downloadUrl
                this.uppy.emit('upload-success', file, uploadTask.snapshot, downloadUrl)
                resolve()
              })
            }
          )
        })
      })
    )
  }

  install () {
    this.uppy.addUploader(this.uploadFile)
  }

  uninstall () {
    this.uppy.removeUploader(this.uploadFile)
  }
}
