<template>
  <v-btn class="share-button" flat @click="copyLink" title="Share">
    <v-icon>share</v-icon>
    <span>Copy link</span>
  </v-btn>
</template>

<script>
import EventBus from 'service/EventBus'

export default {
  name: 'ShareUrl',
  methods: {
    copyLink () {
      const text = document.title + '\n' + location.href
      navigator.clipboard
        .writeText(text)
        .then(() => EventBus.info('Copied the url for you.'))
    }
  }
}
</script>

<style lang="scss" scoped>
.share-button {
  left: -3px;
  margin-left: 2px;
  margin-bottom: 10px;
  padding-left: 8px;
  .v-icon {
    margin-right: 15px;
  }
}
</style>
