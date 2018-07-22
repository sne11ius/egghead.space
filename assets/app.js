import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Globals from 'mixins/globals'
import App from './App.vue'
import Components from 'components/_index'
import VuetifyConfirm from 'vuetify-confirm'
import VueScrollTo from 'vue-scrollto'

import store from 'store/index'
import { createRouter } from 'router/index'
import { sync } from 'vuex-router-sync'

import 'assets/main.scss'

Vue.use(Vuetify, {
  theme: {
    primary: '#0a6aa6',
    secondary: '#023859',
    accent: '#70a649'
  }
})

Vue.use(Globals)
Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Yes',
  buttonFalseText: 'No',
  color: 'warning',
  icon: 'warning',
  title: 'Warning'
})
Vue.use(VueScrollTo)

Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp (ssrContext) {
  // create store and router instances
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    ssrContext,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
