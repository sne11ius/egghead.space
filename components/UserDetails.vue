<template>
  <v-card class="user-details" flat>
    <v-card-title primary-title>
      <h3 v-if="!displayNameEditor" class="headline mb-0">{{userDetails.displayName}}</h3>
      <span v-if="displayNameEditor">
        <v-text-field v-model="userDetails.displayName"></v-text-field>
      </span>
      <v-btn v-if="isCurrentUser && !displayNameEditor" class="edit-inline" fab small flat color="primary" title="Change username" @click="showDisplayNameEditor">
        <v-icon>edit</v-icon>
      </v-btn>
      <div v-if="isCurrentUser && displayNameEditor" class="button-container">
        <v-btn title="Save changes" fab small flat color="primary" @click="updateDisplayName">
          <v-icon>check</v-icon>
        </v-btn>
        <v-btn v-if="displayNameEditor" title="Cancel" fab small flat color="error" @click="cancelDisplayNameEditor">
          <v-icon>cancel</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="email" v-if="isCurrentUser">
        <h4 v-if="!displayEmailEditor">{{privateInfo.email}}</h4>
        <span v-if="displayEmailEditor">
          <v-text-field v-model="privateInfo.email"></v-text-field>
        </span>
        <v-btn v-if="!displayEmailEditor"  @click="showEmailEditor" fab small flat color="primary" title="Change email">
          <v-icon>edit</v-icon>
        </v-btn>
        <div v-if="displayEmailEditor" class="button-container">
          <v-btn title="Save changes" fab small flat color="primary" @click="updateEmail">
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn v-if="displayEmailEditor" title="Cancel" fab small flat color="error" @click="cancelEmailEditor">
            <v-icon>cancel</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="photo">
        <div class="avatar-container">
          <img v-if="userDetails.photoURL" class="v-avatar" :src="userDetails.photoURL" alt="avatar">
          <v-icon class="v-avatar" v-else title="No avatar yet">fas fa-user-circle</v-icon>
        </div>
        <v-btn v-if="isCurrentUser && !avatarEditor" fab small flat color="primary" title="Change avatar" @click="showAvatarEditor">
          <v-icon>edit</v-icon>
        </v-btn>
        <div v-if="isCurrentUser && avatarEditor" class="button-container">
          <div id="upload-area"></div>
          <v-btn title="Save changes" fab small flat color="primary" @click="saveAvatar">
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn title="Cancel" fab small flat color="error" @click="cancelAvatarEditor">
            <v-icon>cancel</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import FirebaseCloudStorage from 'service/FirebaseCloudStorage'
import EventBus from 'service/EventBus.js'
import { api } from 'api'
import '@uppy/dashboard/dist/style.min.css'

const tempStorage = api.storage.ref().child('temp')

export default {
  // Warning:
  // This component will not asyncData and thus cannot be used if parent doesn't fetch
  // the required data
  name: 'UserDetails',
  data () {
    return {
      privateInfo: {
        email: ''
      },
      oldDisplayName: '',
      displayNameEditor: false,
      avatarEditor: false,
      displayEmailEditor: false,
      uppy: null,
      oldPhotoURL: ''
    }
  },
  computed: {
    userDetails () {
      return this.$store.state.userDetails
    },
    currentUser () {
      return this.$store.state.currentUser
    },
    isAuthenticated () {
      return this.currentUser !== null
    },
    isCurrentUser () {
      return (
        this.isAuthenticated &&
        this.userDetails.uid === this.currentUser.uid
      )
    }
  },
  watch: {
    isCurrentUser (isCurrentUser) {
      if (isCurrentUser) {
        api
          .fetchPrivateUserData(this.currentUser.uid)
          .then(snapshot => {
            this.privateInfo = snapshot.data()
          })
      }
    }
  },
  mounted () {
    if (this.isCurrentUser) {
      api
        .fetchPrivateUserData(this.currentUser.uid)
        .then(snapshot => {
          this.privateInfo = snapshot.data()
        })
    }
  },
  methods: {
    updateDisplayName () {
      if (this.userDetails.displayName.trim() === '') {
        EventBus.error(
          "Nothing is not a good user name. We're cool with `_` or `anon` or ... though."
        )
        return
      }
      api
        .updateDisplayName(this.userDetails.uid, this.userDetails.displayName.trim())
        .then(() => {
          this.displayNameEditor = false
        })
    },
    showDisplayNameEditor () {
      this.displayNameEditor = !this.displayNameEditor
      this.oldDisplayName = this.userDetails.displayName
    },
    cancelDisplayNameEditor () {
      this.userDetails.displayName = this.oldDisplayName
      this.displayNameEditor = false
    },
    updateEmail () {
      if (
        this.privateInfo.email.trim() === '' ||
        !this.privateInfo.email.includes('@')
      ) {
        EventBus.error('This does not seem to be a valid email.')
      }
      api
        .updateEmail(this.currentUser.uid, this.privateInfo.email)
        .then(() => {
          this.displayEmailEditor = false
        })
    },
    showEmailEditor () {
      this.displayEmailEditor = !this.displayEmailEditor
      this.oldEmail = this.privateInfo.email
    },
    cancelEmailEditor () {
      this.privateInfo.email = this.oldEmail
      this.displayEmailEditor = !this.displayEmailEditor
    },
    showAvatarEditor () {
      this.avatarEditor = true
      this.oldPhotoURL = this.userDetails.photoURL
      setTimeout(() => {
        this.uppy = Uppy({
          autoProceed: true,
          restrictions: {
            maxNumberOfFiles: 1,
            maxFileSize: 1000000,
            allowedFileTypes: [
              '.jpg',
              '.jpeg',
              '.png',
              '.gif',
              '.JPG',
              '.JPEG',
              '.PNG',
              '.GIF'
            ]
          }
        })
          .use(Dashboard, {
            inline: true,
            target: '#upload-area',
            width: '300px',
            height: '100%',
            note: 'Images only, up to 1 MB per file',
            showProgressDetails: true,
            proudlyDisplayPoweredByUppy: false,
            locale: {
              strings: {
                // Placeholder {browse} doesn't seem to work...
                // dropPaste: "Drop image here, paste or %{browse}"
              }
            }
          })
          .use(FirebaseCloudStorage, { storageRef: tempStorage })
        const _this = this
        this.uppy.on('upload-success', (file, snapshot) => {
          const newUrl = file.downloadUrl
          _this.currentUser.photoURL = newUrl
          _this.userDetails.photoURL = newUrl
          _this.userDetails.photoPath = snapshot.ref.fullPath
          _this.uppy.removeFile(file.id)
        })
      }, 0)
    },
    saveAvatar () {
      if (this.userDetails.photoURL === this.oldPhotoURL) {
        this.cancelAvatarEditor()
      }
      api.updatePhoto(
        this.currentUser.uid,
        this.currentUser.photoURL,
        this.userDetails.photoPath
      )
        .then(() => {
          this.uppy.close()
          this.avatarEditor = false
        })
    },
    cancelAvatarEditor () {
      this.uppy.close()
      this.avatarEditor = false
      this.currentUser.photoURL = this.oldPhotoURL
      this.userDetails.photoURL = this.oldPhotoURL
    }
  }
}
</script>

<style lang="scss">
.user-details {
  #upload-area {
    display: inline-block;
    position: relative;
    top: -14px;
    left: 5px;
    margin-bottom: -14px;
    &:not(:empty) {
      height: 150px !important;
    }
    .uppy-Dashboard-inner {
      height: 100%;
      min-height: 100px !important;
    }
    .uppy-DashboardTabs {
      display: none;
    }
    .uppy-DashboardItem-preview {
      width: 89px !important;
      height: 89px !important;
    }
    .uppy-Dashboard-dropFilesTitle {
      position: relative !important;
      top: -94px !important;
    }
    .uppy-Dashboard-progressindicators {
      position: relative;
      top: -150px;
    }
    .uppy-Dashboard-note {
      position: absolute !important;
      top: 83px;
    }
    .uppy-Informer {
      transform: none !important;
      top: -160px;
    }
  }
}
</style>

<style lang="scss" scoped>
.user-details {
  margin-bottom: 15px;
  & .v-input-group {
    padding-top: 0px;
    position: relative;
    top: 10px;
  }
  .v-card__title {
    height: 92px !important;
    padding-left: 0;
    padding-right: 0;
    .v-input {
      display: inline-block;
      min-width: 235px;
    }
  }
  .v-card__text {
    padding-left: 0;
    padding-right: 0;
  }
  .v-avatar {
    width: 150px;
    height: 150px;
    vertical-align: top;
    &.fa-user-circle:before {
      font-size: 140px;
    }
  }
  .avatar-container {
    display: inline-block;
    &.upload {
      background-color: red;
      height: 150px;
    }
  }
  .email {
    display: block;
    position: relative;
    height: 30px;
    top: -20px;
    .button-container {
      position: relative;
      top: -10px;
    }
    .v-input {
      display: inline-block;
      min-width: 235px;
      max-width: 300px;
      position: relative;
      top: -10px;
      .v-input__control {
        display: inline-block;
      }
    }
    h4 {
      display: inline-block;
    }
  }
  .button-container {
    display: inline-block;
    & button {
      margin-right: 0;
      & + button {
        margin-left: 0;
      }
    }
  }
}
</style>
