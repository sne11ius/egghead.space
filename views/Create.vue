<template>
  <v-container grid-list-md fluid fill-height>
    <v-dialog v-model="showHelp" max-width="580px">
      <v-card>
        <v-card-title>
          <h3 class="headline mb-0">Help</h3>
        </v-card-title>
        <v-card-text class="help">
          You can control which image we choose for your sketches preview:
          <ol>
            <li>Make the URL end with "preview_image":<br>
              Example: <code>![Alt txt](https://xmpl.url/image.jpeg#<u>preview_image</u> "title txt")</code>
            </li>
            <li>Include "preview image" in the alt text:.<br>
              Example: <code>![Alt txt. Used for <u>preview image</u>](https://xmpl.url/image.jpeg "title txt")</code>
            </li>
            <li>Include "preview image" in the title text:<br>
              Example: <code>![Alt txt](https://xmpl.url/image.jpeg "Title txt. Used for <u>preview image</u>"")</code>
            </li>
            <li>If you don't give us any hints, we will just use the first image and call it a day.
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.stop="showHelp=false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex id="input-container" s12 md9>
        <v-card >
          <v-card-title>
            <h3 class="headline mb-0">{{pageTitle}}</h3>
            <v-spacer></v-spacer>
            <v-btn @click="showHelp = true" flat icon>
              <v-icon>help_outline</v-icon>
            </v-btn>
          </v-card-title>
          <div id="protip">
            Protip:
            <p>If you include images in your sketch (which you totally should btw),
            we will include one of them in your sketches preview. Click Help to see how.
            </p>
          </div>
          <v-card-text>
            <v-text-field v-model="title" required label="Add a good title"></v-text-field>
            <div id="editor">
              <textarea id="sketch-body" placeholder="Write something interesting" v-model="body"></textarea>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat to="/">Cancel</v-btn>
            <v-btn color="primary" flat @click.stop="saveSketch" :disabled="!isAuthenticated">{{submitButtonTitle}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex id="sign-in-warning" v-if="!isAuthenticated" s12 md3>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">You want to share an idea? Awesome!</h3>
          </v-card-title>
          <v-card-text>
            &hellip; but please sign in first or you won't be able to save.
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-else id="file-upload" s12 md3>
        <v-card>
          <MediaList :items="medias" v-on:add="add" v-on:remove="remove" ref="mediaList"></MediaList>
        </v-card>
        <v-card>
          <FileUpload v-on:media-added="mediaAdded" v-on:post-process="postProcess" ref="fileUpload" :storageRef="mediaStorageRef"></FileUpload>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import marked from 'marked'
import MediaList from 'components/MediaList.vue'
import FileUpload from 'components/FileUpload.vue'
import EventBus from 'service/EventBus.js'
import 'easymde/dist/easymde.min.css'
import { api } from 'api'

const storage = api.storage

let Easymde, easyMde
export default {
  name: 'Create',
  components: {
    MediaList,
    FileUpload
  },
  data () {
    return {
      title: '',
      body: '',
      showHelp: false,
      next: null,
      medias: []
    }
  },
  computed: {
    editSketch () {
      return this.$store.state.editSketch
    },
    isEditMode () {
      return this.editSketch !== null
    },
    isCreateMode () {
      return !this.isEditMode
    },
    currentUser () {
      return this.$store.state.currentUser
    },
    isAuthenticated () {
      return this.currentUser !== null
    },
    pageTitle () {
      if (this.isEditMode) {
        return 'Edit sketch'
      } else {
        return 'Create new sketch'
      }
    },
    submitButtonTitle () {
      if (this.isCreateMode) {
        return "Let's do this"
      } else {
        return 'Save changes'
      }
    },
    mediaStorageRef () {
      if (this.isEditMode) {
        return storage
          .ref()
          .child('medias')
          .child(this.editSketch.id)
      } else {
        return storage.ref().child('temp')
      }
    }
  },
  asyncData ({ store, route }) {
    if (route.params.id) {
      return store.dispatch('fetchEditSketch', route.params.id)
    } else {
      return store.dispatch('removeEditSketch')
    }
  },
  created () {
    this.medias = []
    if (this.editSketch) {
      this.title = this.editSketch.title
      this.body = this.editSketch.body
      this.medias.push(...this.editSketch.medias)
    }
  },
  mounted () {
    this.medias = []
    if (this.editSketch) {
      this.title = this.editSketch.title
      this.body = this.editSketch.body
      this.medias.push(...this.editSketch.medias)
    }
    Easymde = require('easymde')
    easyMde = new Easymde({
      element: document.querySelectorAll('#sketch-body')[0],
      autoDownloadFontAwesome: false,
      hideIcons: ['side-by-side', 'fullscreen']
    })
    easyMde.value(this.body)
  },
  beforeRouteLeave: function (to, from, next) {
    if (
      !this.isAuthenticated ||
      (this.title.length > 0 || (easyMde.value() && easyMde.value().length > 0))
    ) {
      this.$confirm('Are u sure you want to trash all your edits?').then(
        res => {
          next(res)
        }
      )
    } else {
      next(true)
    }
  },
  methods: {
    findImages () {
      const renderer = new marked.Renderer()
      const images = []
      renderer.image = function (href, title, alt) {
        images.push({
          href: href || '',
          title: title || '',
          alt: alt || ''
        })
        return marked.Renderer.prototype.image.apply(this, arguments)
      }
      marked(easyMde.value(), { renderer: renderer })
      return images
    },
    validateSketch () {
      const body = easyMde.value()
      if (this.title.length === 0) {
        EventBus.error('Please add a title.')
        return false
      }
      if (body.length === 0) {
        EventBus.error('Please add a body.')
        return false
      }
      const images = this.findImages()
      for (let { href } of images) {
        if (href && href.length && href.length > 0 && !href.includes(api.projectId)) {
          const editor = easyMde.codemirror
          const cursor = editor.getSearchCursor(href)
          cursor.findNext()
          editor.setSelection(cursor.pos.from, cursor.pos.to)
          EventBus.error(`Please don't link external images. Upload images here instead.`)
          return false
        }
      }
      return true
    },
    saveSketch () {
      if (!this.validateSketch()) {
        return
      }
      const body = easyMde.value()
      if (this.isEditMode) {
        const medias = this.medias.map(({ url, preview }) => ({
          url,
          preview
        }))
        api
          .updateSketch(this.editSketch.id, this.title, body, medias, this.currentUser.uid)
          .then(() => {
            EventBus.info(`Sketch '${this.title}' updated.`)
            const title = this.title
            this.title = ''
            easyMde.value('')
            this.$router.push({
              name: 'SketchDetails',
              params: {
                id: this.editSketch.id,
                title: title.replace(/\s/g, '+')
              }
            })
          })
      } else {
        const medias = this.medias.map(media => ({
          path: media.snapshot.fullPath,
          url: media.file.downloadUrl,
          preview: {
            path: media.previewSnapshot.ref.fullPath,
            url: media.preview.url
          }
        })
        )
        api
          .submitSketch(
            this.currentUser.uid,
            this.title,
            body,
            medias
          )
          .then(() => {
            EventBus.info(`Sketch '${this.title}' created.`)
            this.title = ''
            easyMde.value('')
            this.$router.push('/')
          })
      }
    },
    mediaAdded (file, previewDownloadUrl, snapshot, previewSnapshot) {
      this.$refs.mediaList.stopIndicatePostProcess(file)
      this.medias.push({
        file,
        url: file.downloadUrl,
        preview: { url: previewDownloadUrl },
        snapshot,
        previewSnapshot
      })
    },
    postProcess (file) {
      this.$refs.mediaList.indicatePostProcess(file)
    },
    add (item) {
      const imageLink = `![Alt text](${item.url})`
      const editor = easyMde.codemirror
      const selection = editor.getSelection()
      if (selection.length > 0) {
        editor.replaceSelection(imageLink)
      } else {
        const doc = editor.getDoc()
        const cursor = doc.getCursor()
        const pos = {
          line: cursor.line,
          ch: cursor.ch
        }
        doc.replaceRange(imageLink, pos)
      }
    },
    remove (item, index) {
      const body = easyMde.value()
      if (body.includes(item.url)) {
        const editor = easyMde.codemirror
        const cursor = editor.getSearchCursor(item.url)
        cursor.findNext()
        editor.setSelection(cursor.pos.from, cursor.pos.to)
        EventBus.error(`Please remove from text first.`)
        return
      }
      this.medias.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.CodeMirror,
.CodeMirror-scroll {
  max-height: 50px;
}
#protip {
  margin-left: 50px;
  margin-right: 30px;
}
.help ol {
  margin: 10px 10px 15px 30px;
  li + li {
    margin-top: 7px;
  }
}
</style>
