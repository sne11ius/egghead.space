<template>
  <v-progress-circular id="ajax-indicator" v-if="visible" indeterminate color="primary" :size="70" :width="10"></v-progress-circular>
</template>

<script>
import EventBus from 'service/EventBus'

export default {
  name: 'AjaxIndicator',
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    EventBus.$on('ajax-start', () => {
      this.visible = true
    })
    EventBus.$on('ajax-stop', () => {
      this.visible = false
    })
  }
}
</script>

<style lang="scss" scoped>
#ajax-indicator {
  position: fixed;
  z-index: 1001;
  top: 30%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-30%, -50%);
}
</style>
