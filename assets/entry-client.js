import 'es6-promise/auto'
import { createApp } from './app'

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })
    if (!activated.length) {
      return next()
    }
    // in order to load all promises
    let targetPromises = []
    // this cache is used to record operated components' keys, avoid infinite recursion
    let keyCache = []
    const doAsyncData = (component) => {
      if (component.asyncData) {
        targetPromises.push(component.asyncData({
          route: to,
          store
        }))
      }
    }
    const recursive = (component, key) => {
      // if has key, recursived
      if (keyCache.indexOf(key) !== -1) return
      // cache key
      keyCache.push(key)
      // do async data
      doAsyncData(component)
      // query sub components
      if (component.components) {
        Object.keys(component.components).forEach(key => {
          recursive(component.components[key], key)
        })
      }
    }
    activated.map(component => {
      recursive(component, component.name)
    })
    Promise.all(targetPromises)
      .then(next)
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})
