<template>
  <v-snackbar v-model="showSnackbar" color="success" :top="true" :timeout="7000" class="global-snackbar">
    <v-icon color="white">{{ icon }}</v-icon>{{ text }}
  </v-snackbar>
</template>

<script>
import EventBus from 'service/EventBus'

export default {
  name: 'GlobalSnackbar',
  data () {
    return {
      text: '',
      icon: 'info',
      showSnackbar: false
    }
  },
  mounted () {
    EventBus.$on('global-snack', (text, type) => {
      this.icon = type
      this.text = text
      this.showSnackbar = true
    })
  }
}
</script>

<style lang="scss" scoped>
.global-snackbar {
  .icon {
    margin-right: 20px;
  }
  z-index: 1001;
}
</style>
