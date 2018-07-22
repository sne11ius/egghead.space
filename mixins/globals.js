import Vue from 'vue'

const globals = new Vue({
  data: {
    mouseActive: false
  },
  created () {
    const _this = this
    // s. https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'mouseover',
        function onFirstHover () {
          _this.mouseActive = true
          window.removeEventListener('mouseover', onFirstHover, false)
        },
        false
      )
    }
  }
})

export default {
  install (vue) {
    if (!vue.prototype.$globals) {
      Object.defineProperty(vue.prototype, '$globals', {
        get () {
          return globals
        }
      })
    }
  }
}
