<template>
  <v-card>
    <v-container fluid v-show="items.length > 0 || postProcessIndicators.length > 0" id="media-list">
      <v-layout row wrap>
        <v-flex v-for="(item, index) in items" :key="item.preview.url" class="media-container" xs12 lg6>
          <v-card tile flat>
            <v-card-media :src="item.preview.url" height="200px">
            </v-card-media>
            <v-card-actions>
              <v-btn small color="primary" @click="$emit('add', item, index)" title="Insert this image into markdown">
                Add to text
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn fab small @click="$emit('remove', item, index)" title="Delete">
                <v-icon color="error">delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex v-for="(file, index) in postProcessIndicators" :key="index" class="media-container process-placeholder" xs12 lg6>
          <v-card tile height="256px">
            <v-card-text>
              <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
              <span class="text">Processing&hellip;</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'MediaList',
  props: {
    items: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      postProcessIndicators: []
    }
  },
  methods: {
    indicatePostProcess (file) {
      this.postProcessIndicators.push(file)
    },
    stopIndicatePostProcess (file) {
      for (let i = 0; i < this.postProcessIndicators.length; i++) {
        if (this.postProcessIndicators[i].id === file.id) {
          this.postProcessIndicators.splice(i, 1)
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#media-list {
  margin-bottom: 10px;
  .media-container {
    display: inline;
    img {
      max-width: 140px;
    }
  }
  .process-placeholder {
    height: 100%;
    .text {
      position: absolute;
      bottom: 7px;
      left: 0;
      width: 100%;
      text-align: center;
    }
  }
  .progress-circular {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
