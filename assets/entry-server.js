import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp(context)

    // set router's location
    router.push(context.url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        reject({ code: 404 })
      }
      // in order to load all promises
      let targetPromises = []
      // this cache is used to record operated components' keys, avoid infinite recursion
      let keyCache = []
      const doAsyncData = (component) => {
        if (component.asyncData) {
          targetPromises.push(component.asyncData({
            route: router.currentRoute,
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
      matchedComponents.map(component => {
        recursive(component, component.name)
      })
      Promise.all(targetPromises).then(data => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        targetPromises = []
        keyCache = []
        context.state = store.state
        resolve(app)
      }).catch(() => {
        targetPromises = []
        keyCache = []
        reject(app)
      })
    }, reject)
  })
}
